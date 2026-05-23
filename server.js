const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { matchProducts } = require('./matcher');

const app = express();
const PORT = process.env.PORT || 3001;

/* ── Data file path ── */
const DATA_PATH = process.env.RENDER
  ? '/data/db.json'
  : path.join(__dirname, 'db.json');

/* ── JSON file helpers ── */
function readDB() {
  try {
    return JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
  } catch {
    return { submissions: [], notes: [], nextId: 1, nextNoteId: 1 };
  }
}

function writeDB(data) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

/* ── Middleware ── */
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.static(path.join(__dirname)));

/* ═══════════════════════════════════════════
   API: Submit questionnaire
═══════════════════════════════════════════ */
app.post('/api/submissions', (req, res) => {
  const body = req.body;
  if (!body || !body.personal) {
    return res.status(400).json({ error: 'Invalid payload' });
  }

  const db = readDB();
  const p = body.personal || {};
  const id = db.nextId++;

  const record = {
    id,
    created_at: new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' }),
    status: 'new',
    full_name: [p.first_name_th, p.last_name_th].filter(Boolean).join(' ') || null,
    age: p.age ? parseInt(p.age) : null,
    gender: p.gender || null,
    mobile: p.mobile || null,
    email: p.email || null,
    occupation: body.occupation_finance?.occupation_type || null,
    sum_assured: body.insurance_needs?.sum_assured || null,
    data: body
  };

  db.submissions.push(record);
  writeDB(db);
  res.json({ id, message: 'บันทึกข้อมูลสำเร็จ' });
});

/* ═══════════════════════════════════════════
   API: List submissions (summary)
═══════════════════════════════════════════ */
app.get('/api/submissions', (req, res) => {
  const { status, search, page = 1, limit = 15 } = req.query;
  const db = readDB();

  let rows = [...db.submissions].reverse();

  if (status && status !== 'all') {
    rows = rows.filter(r => r.status === status);
  }
  if (search) {
    const q = search.toLowerCase();
    rows = rows.filter(r =>
      (r.full_name || '').toLowerCase().includes(q) ||
      (r.mobile || '').includes(q) ||
      (r.email || '').toLowerCase().includes(q)
    );
  }

  const total = rows.length;
  const offset = (parseInt(page) - 1) * parseInt(limit);
  const paged = rows.slice(offset, offset + parseInt(limit)).map(r => ({
    id: r.id, created_at: r.created_at, status: r.status,
    full_name: r.full_name, age: r.age, gender: r.gender,
    mobile: r.mobile, email: r.email, occupation: r.occupation, sum_assured: r.sum_assured
  }));

  res.json({ total, page: parseInt(page), limit: parseInt(limit), data: paged });
});

/* ═══════════════════════════════════════════
   API: Get single submission (full detail)
═══════════════════════════════════════════ */
app.get('/api/submissions/:id', (req, res) => {
  const db = readDB();
  const row = db.submissions.find(r => r.id === parseInt(req.params.id));
  if (!row) return res.status(404).json({ error: 'Not found' });

  const notes = db.notes.filter(n => n.submission_id === row.id)
    .sort((a, b) => b.id - a.id);

  res.json({ ...row, parsed: row.data, notes, data: undefined });
});

/* ═══════════════════════════════════════════
   API: Update status
═══════════════════════════════════════════ */
app.patch('/api/submissions/:id/status', (req, res) => {
  const { status } = req.body;
  const valid = ['new', 'reviewing', 'contacted', 'approved', 'rejected'];
  if (!valid.includes(status)) return res.status(400).json({ error: 'Invalid status' });

  const db = readDB();
  const row = db.submissions.find(r => r.id === parseInt(req.params.id));
  if (!row) return res.status(404).json({ error: 'Not found' });

  row.status = status;
  writeDB(db);
  res.json({ ok: true });
});

/* ═══════════════════════════════════════════
   API: Add note
═══════════════════════════════════════════ */
app.post('/api/submissions/:id/notes', (req, res) => {
  const { note } = req.body;
  if (!note?.trim()) return res.status(400).json({ error: 'Note required' });

  const db = readDB();
  const id = db.nextNoteId++;
  db.notes.push({
    id,
    submission_id: parseInt(req.params.id),
    created_at: new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' }),
    note: note.trim()
  });
  writeDB(db);
  res.json({ id });
});

/* ═══════════════════════════════════════════
   API: Stats
═══════════════════════════════════════════ */
app.get('/api/stats', (req, res) => {
  const db = readDB();
  const subs = db.submissions;

  const today = new Date().toLocaleDateString('th-TH', { timeZone: 'Asia/Bangkok' });
  const todayCount = subs.filter(r => r.created_at.startsWith(today.split('/').reverse().join('/'))).length;

  const byStatus = Object.entries(
    subs.reduce((acc, r) => { acc[r.status] = (acc[r.status] || 0) + 1; return acc; }, {})
  ).map(([status, n]) => ({ status, n }));

  const byOccupation = Object.entries(
    subs.reduce((acc, r) => { const k = r.occupation || 'other'; acc[k] = (acc[k] || 0) + 1; return acc; }, {})
  ).map(([occupation, n]) => ({ occupation, n }))
    .sort((a, b) => b.n - a.n).slice(0, 5);

  const ages = subs.map(r => r.age).filter(Boolean);
  const avgAge = ages.length ? Math.round(ages.reduce((a, b) => a + b, 0) / ages.length * 10) / 10 : null;

  res.json({ total: subs.length, today: todayCount, byStatus, byOccupation, avgAge });
});

/* ═══════════════════════════════════════════
   API: Product Match — by submission ID
═══════════════════════════════════════════ */
app.get('/api/match/:id', (req, res) => {
  const db = readDB();
  const row = db.submissions.find(r => r.id === parseInt(req.params.id));
  if (!row) return res.status(404).json({ error: 'Not found' });

  const matches = matchProducts(row.data);
  res.json({
    id: row.id,
    name: row.full_name,
    age: row.age,
    matches
  });
});

/* ═══════════════════════════════════════════
   API: Product Match — from raw FNA payload
═══════════════════════════════════════════ */
app.post('/api/match', (req, res) => {
  if (!req.body || !req.body.personal) {
    return res.status(400).json({ error: 'Invalid payload' });
  }
  const matches = matchProducts(req.body);
  res.json({ matches });
});

/* ── Serve HTML ── */
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'admin.html')));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.listen(PORT, () => {
  console.log(`\n🚀 Server: http://localhost:${PORT}`);
  console.log(`   Form:   http://localhost:${PORT}/`);
  console.log(`   Admin:  http://localhost:${PORT}/admin`);
  console.log(`   DB:     ${DATA_PATH}\n`);
});
