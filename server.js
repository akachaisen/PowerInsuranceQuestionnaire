const express = require('express');
const { DatabaseSync } = require('node:sqlite');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3001;

/* ── Middleware ── */
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.static(path.join(__dirname)));

/* ── Database setup ── */
const db = new DatabaseSync(path.join(__dirname, 'submissions.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS submissions (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at  TEXT    NOT NULL DEFAULT (datetime('now', 'localtime')),
    status      TEXT    NOT NULL DEFAULT 'new',
    full_name   TEXT,
    age         INTEGER,
    gender      TEXT,
    mobile      TEXT,
    email       TEXT,
    occupation  TEXT,
    sum_assured TEXT,
    data        TEXT    NOT NULL
  );

  CREATE TABLE IF NOT EXISTS notes (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    submission_id  INTEGER NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
    created_at     TEXT    NOT NULL DEFAULT (datetime('now', 'localtime')),
    note           TEXT    NOT NULL
  );
`);

/* ═══════════════════════════════════════════
   API: Submit questionnaire
═══════════════════════════════════════════ */
app.post('/api/submissions', (req, res) => {
  const body = req.body;
  if (!body || !body.personal) {
    return res.status(400).json({ error: 'Invalid payload' });
  }

  const p = body.personal || {};
  const full_name = [p.first_name_th, p.last_name_th].filter(Boolean).join(' ') || null;

  const stmt = db.prepare(`
    INSERT INTO submissions (full_name, age, gender, mobile, email, occupation, sum_assured, data)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const info = stmt.run(
    full_name,
    p.age ? parseInt(p.age) : null,
    p.gender || null,
    p.mobile || null,
    p.email || null,
    body.occupation_finance?.occupation_type || null,
    body.insurance_needs?.sum_assured || null,
    JSON.stringify(body)
  );

  res.json({ id: info.lastInsertRowid, message: 'บันทึกข้อมูลสำเร็จ' });
});

/* ═══════════════════════════════════════════
   API: List submissions (summary)
═══════════════════════════════════════════ */
app.get('/api/submissions', (req, res) => {
  const { status, search, page = 1, limit = 15 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  let where = [];
  let params = [];

  if (status && status !== 'all') {
    where.push('status = ?');
    params.push(status);
  }
  if (search) {
    where.push('(full_name LIKE ? OR mobile LIKE ? OR email LIKE ?)');
    const q = `%${search}%`;
    params.push(q, q, q);
  }

  const whereClause = where.length ? 'WHERE ' + where.join(' AND ') : '';

  const total = db.prepare(`SELECT COUNT(*) as cnt FROM submissions ${whereClause}`).get(...params).cnt;
  const rows  = db.prepare(`
    SELECT id, created_at, status, full_name, age, gender, mobile, email, occupation, sum_assured
    FROM submissions ${whereClause}
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?
  `).all(...params, parseInt(limit), offset);

  res.json({ total, page: parseInt(page), limit: parseInt(limit), data: rows });
});

/* ═══════════════════════════════════════════
   API: Get single submission (full detail)
═══════════════════════════════════════════ */
app.get('/api/submissions/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM submissions WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Not found' });

  const notes = db.prepare('SELECT * FROM notes WHERE submission_id = ? ORDER BY created_at DESC').all(row.id);
  row.parsed = JSON.parse(row.data);
  row.notes  = notes;
  delete row.data;
  res.json(row);
});

/* ═══════════════════════════════════════════
   API: Update status
═══════════════════════════════════════════ */
app.patch('/api/submissions/:id/status', (req, res) => {
  const { status } = req.body;
  const valid = ['new', 'reviewing', 'contacted', 'approved', 'rejected'];
  if (!valid.includes(status)) return res.status(400).json({ error: 'Invalid status' });

  db.prepare('UPDATE submissions SET status = ? WHERE id = ?').run(status, req.params.id);
  res.json({ ok: true });
});

/* ═══════════════════════════════════════════
   API: Add note
═══════════════════════════════════════════ */
app.post('/api/submissions/:id/notes', (req, res) => {
  const { note } = req.body;
  if (!note?.trim()) return res.status(400).json({ error: 'Note required' });

  const info = db.prepare('INSERT INTO notes (submission_id, note) VALUES (?, ?)').run(req.params.id, note.trim());
  res.json({ id: info.lastInsertRowid });
});

/* ═══════════════════════════════════════════
   API: Stats
═══════════════════════════════════════════ */
app.get('/api/stats', (req, res) => {
  const total        = db.prepare("SELECT COUNT(*) as n FROM submissions").get().n;
  const today        = db.prepare("SELECT COUNT(*) as n FROM submissions WHERE date(created_at) = date('now','localtime')").get().n;
  const byStatus     = db.prepare("SELECT status, COUNT(*) as n FROM submissions GROUP BY status").all();
  const byOccupation = db.prepare("SELECT occupation, COUNT(*) as n FROM submissions GROUP BY occupation ORDER BY n DESC LIMIT 5").all();
  const avgAge       = db.prepare("SELECT ROUND(AVG(age),1) as avg FROM submissions WHERE age IS NOT NULL").get().avg;

  res.json({ total, today, byStatus, byOccupation, avgAge });
});

/* ── Serve HTML ── */
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'admin.html')));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.listen(PORT, () => {
  console.log(`\n🚀 Server: http://localhost:${PORT}`);
  console.log(`   Form:   http://localhost:${PORT}/`);
  console.log(`   Admin:  http://localhost:${PORT}/admin\n`);
});
