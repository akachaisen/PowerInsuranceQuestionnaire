'use strict';

/* =============================================================
   PowerInsurance — Product Matching Engine
   จับคู่สินค้าประกันไทยประกันชีวิตกับข้อมูล FNA ของลูกค้า

   Products source: /products/*.yaml (21 products)
============================================================= */

const PRODUCTS = [
  /* ── 01 ชีวิตตลอดชีพ (Whole Life) ──────────────────── */
  {
    id: 'TL_KHUMTHANAKIJ_99_20_NN',
    name: 'คุ้มธนกิจ 99/20',
    name_th: 'ไทยประกันชีวิต คุ้มธนกิจ 99/20 (Nn)',
    category: 'whole_life',
    category_th: 'ประกันชีวิตตลอดชีพ',
    product_type: 'main_policy',
    age_min: 0, age_max: 75,
    needs: ['protection', 'saving', 'tax', 'debt', 'education'],
    types: ['whole'],
    riders_matched: [],
    income_level: 'any',
    requires_main: false,
    no_health_check: false,
    tax_deduction: 100000,
    min_annual_premium: 5000,
    highlight: 'จ่ายเบี้ย 20 ปี คุ้มครองถึงอายุ 99 ปี ครบสัญญารับเงินคืน 100%',
    icon: '🛡️'
  },
  {
    id: 'TL_LEGACY_FIT_CARE_99_10',
    name: 'Legacy Fit Care 99/10',
    name_th: 'ไทยประกันชีวิต เลกาซี ฟิต แคร์ 99/10',
    category: 'whole_life',
    category_th: 'ประกันชีวิตตลอดชีพ',
    product_type: 'main_policy',
    age_min: 0, age_max: 50,
    needs: ['protection', 'medical', 'tax', 'debt'],
    types: ['whole'],
    riders_matched: ['health'],
    income_level: 'any',
    requires_main: false,
    no_health_check: false,
    tax_deduction: 100000,
    min_annual_premium: 15000,
    highlight: 'จ่ายเบี้ย 10 ปี คุ้มครองถึงอายุ 99 ปี + เปลี่ยนวงเงินเป็นค่ารักษาพยาบาลตอนเกษียณ',
    icon: '🏥'
  },
  {
    id: 'TL_LEGACY_FIT_RETIRE_99_10_LIFE',
    name: 'Legacy Fit Retire 99/10',
    name_th: 'ไทยประกันชีวิต เลกาซี ฟิต รีไทร์ 99/10',
    category: 'endowment',
    category_th: 'ประกันสะสมทรัพย์',
    product_type: 'main_policy',
    age_min: 0, age_max: 50,
    needs: ['saving', 'retirement', 'tax', 'protection'],
    types: ['endow', 'whole'],
    riders_matched: [],
    income_level: 'any',
    requires_main: false,
    no_health_check: false,
    tax_deduction: 100000,
    min_annual_premium: 15000,
    highlight: 'เงินคืนเพิ่มขึ้นทุกปี 15→20→25% ของทุน พร้อมคุ้มครองชีวิตถึงอายุ 99 ปี',
    icon: '🌅'
  },
  {
    id: 'TL_OMYAO_KHUM_THAWEEKUN',
    name: 'อม้วย คุ้มทวีคูณ',
    name_th: 'ไทยประกันชีวิต อม้วย คุ้มทวีคูณ',
    category: 'endowment',
    category_th: 'ประกันสะสมทรัพย์',
    product_type: 'main_policy',
    age_min: 0, age_max: 60,
    needs: ['saving', 'protection', 'tax'],
    types: ['endow', 'whole'],
    riders_matched: [],
    income_level: 'any',
    requires_main: false,
    no_health_check: false,
    tax_deduction: 100000,
    min_annual_premium: 5000,
    highlight: 'รับเงินคืน 1%/ปี ทุกปีตลอดสัญญา + ครบสัญญารับ 110% เบี้ยเริ่มต้นจับต้องได้',
    icon: '💰'
  },

  /* ── 02 ออมทรัพย์ / ลดหย่อนภาษี (Savings/Tax) ──────── */
  {
    id: 'TL_LEGACY_FIT_FIRM_80_8',
    name: 'Legacy Fit Firm 80/8',
    name_th: 'ไทยประกันชีวิต เลกาซี ฟิต เฟิร์ม 80/8',
    category: 'endowment',
    category_th: 'ประกันสะสมทรัพย์ (HNW)',
    product_type: 'main_policy',
    age_min: 0, age_max: 65,
    needs: ['saving', 'tax', 'protection'],
    types: ['endow'],
    riders_matched: [],
    income_level: 'high',
    requires_main: false,
    no_health_check: false,
    tax_deduction: 100000,
    min_annual_premium: 80000,
    highlight: 'รับเงินคืน 8%/ปี × 8 ปี + ผลประโยชน์เสียชีวิตเพิ่มขึ้นทุกปีสูงสุด 800% สำหรับ HNW',
    icon: '📈'
  },
  {
    id: 'TL_MONEY_FIT_FIRM_15_10',
    name: 'Money Fit Firm 15/10',
    name_th: 'ไทยประกันชีวิต มันนี่ ฟิต เฟิร์ม 15/10',
    category: 'endowment',
    category_th: 'ประกันสะสมทรัพย์',
    product_type: 'main_policy',
    age_min: 0, age_max: 60,
    needs: ['saving', 'tax', 'protection'],
    types: ['endow'],
    riders_matched: [],
    income_level: 'any',
    requires_main: false,
    no_health_check: false,
    tax_deduction: 100000,
    min_annual_premium: 15000,
    highlight: 'ออมทรัพย์ 15 ปี รับครบสัญญา 297% + เงินปันผล อัตราเดียวทั้งหญิงชาย',
    icon: '💼'
  },
  {
    id: 'TL_PLAN',
    name: 'TL Plan',
    name_th: 'ไทยประกันชีวิต ทีแอล แพลน',
    category: 'endowment',
    category_th: 'ประกันสะสมทรัพย์',
    product_type: 'main_policy',
    age_min: 0, age_max: 65,
    needs: ['saving', 'tax', 'protection'],
    types: ['endow'],
    riders_matched: [],
    income_level: 'any',
    requires_main: false,
    no_health_check: false,
    tax_deduction: 100000,
    min_annual_premium: 10000,
    highlight: 'สะสมทรัพย์ 4 แบบยืดหยุ่น (15/5, 15/10, 20/10, 20/15) ครบสัญญารับ 150%',
    icon: '📊'
  },

  /* ── 03 สุขภาพ (Health) ──────────────────────────────── */
  {
    id: 'TL_HEALTH_FIT_SABUY',
    name: 'Health Fit Sabuy',
    name_th: 'ไทยประกันชีวิต เฮลท์ ฟิต สบาย',
    category: 'health_package',
    category_th: 'แพ็คเกจสุขภาพ',
    product_type: 'main_policy',
    age_min: 11, age_max: 64,
    needs: ['medical', 'protection', 'accident'],
    types: ['whole'],
    riders_matched: ['health', 'accident'],
    income_level: 'any',
    requires_main: false,
    no_health_check: false,
    tax_deduction: 100000,
    min_annual_premium: 5000,
    highlight: 'แพ็คเกจครบ: ประกันชีวิต + สุขภาพ + อุบัติเหตุ 4 แผน เบี้ยรายเดือนเริ่มต้นไม่แพง',
    icon: '💊'
  },
  {
    id: 'TL_HEALTH_FIT_SHIELD',
    name: 'Health Fit Shield',
    name_th: 'ไทยประกันชีวิต เฮลท์ ฟิต ชีลด์',
    category: 'health',
    category_th: 'ประกันสุขภาพ (ผู้ป่วยใน)',
    product_type: 'rider',
    age_min: 0, age_max: 80,
    needs: ['medical'],
    types: [],
    riders_matched: ['health'],
    income_level: 'any',
    requires_main: true,
    no_health_check: false,
    tax_deduction: 25000,
    min_annual_premium: 5000,
    highlight: 'เหมาจ่ายค่ารักษา สูงสุด 400,000 บาท/ครั้ง 4 แผน คุ้มครองถึงอายุ 99 ปี',
    icon: '🏨'
  },

  /* ── 05 เกษียณ (Retirement) ──────────────────────────── */
  {
    id: 'TL_KASIAN_SOOK',
    name: 'เกษียณสุข',
    name_th: 'ไทยประกันชีวิต เกษียณสุข',
    category: 'annuity',
    category_th: 'ประกันบำนาญ',
    product_type: 'main_policy',
    age_min: 20, age_max: 50,
    needs: ['retirement', 'tax'],
    types: ['annuity'],
    riders_matched: [],
    income_level: 'any',
    requires_main: false,
    no_health_check: true,
    tax_deduction: 200000,
    min_annual_premium: 5000,
    highlight: 'ไม่ตรวจสุขภาพ รับบำนาญ 12%/ปี × 26 ปี ลดหย่อนภาษีบำนาญ 200,000 บาท/ปี',
    icon: '🌺'
  },
  {
    id: 'TL_MONEY_FIT_RETIRE_G',
    name: 'Money Fit Retire G',
    name_th: 'ไทยประกันชีวิต มันนี่ ฟิต รีไทร์ จี',
    category: 'annuity',
    category_th: 'ประกันบำนาญ',
    product_type: 'main_policy',
    age_min: 20, age_max: 55,
    needs: ['retirement', 'tax'],
    types: ['annuity'],
    riders_matched: [],
    income_level: 'any',
    requires_main: false,
    no_health_check: false,
    tax_deduction: 200000,
    min_annual_premium: 10000,
    highlight: 'บำนาญเพิ่มขึ้นทุกระยะ 15→25→35% รับรวมกว่า 610% ตลอดชีวิต',
    icon: '🏡'
  },

  /* ── 07 อุบัติเหตุ (Accident) ────────────────────────── */
  {
    id: 'TL_PA_LOVE_FAMILY',
    name: 'PA Love Family',
    name_th: 'ไทยประกันชีวิต พีเอ เลิฟ แฟมิลี่',
    category: 'accident',
    category_th: 'ประกันอุบัติเหตุ',
    product_type: 'main_policy',
    age_min: 20, age_max: 60,
    needs: ['accident', 'protection'],
    types: [],
    riders_matched: ['accident'],
    income_level: 'any',
    requires_main: false,
    no_health_check: true,
    tax_deduction: 0,
    min_annual_premium: 3000,
    highlight: 'ค่ารักษา 60,000 บาท/ครั้ง + รายได้รายวัน ผลประโยชน์วันหยุดสองเท่าจากปีที่ 3',
    icon: '👨‍👩‍👧'
  },
  {
    id: 'TL_PA_REFUND',
    name: 'PA Refund',
    name_th: 'ไทยประกันชีวิต พีเอ รีฟันด์',
    category: 'accident',
    category_th: 'ประกันอุบัติเหตุ',
    product_type: 'main_policy',
    age_min: 15, age_max: 65,
    needs: ['accident'],
    types: [],
    riders_matched: ['accident'],
    income_level: 'any',
    requires_main: false,
    no_health_check: true,
    tax_deduction: 0,
    min_annual_premium: 3000,
    highlight: 'ประกันอุบัติเหตุ 3 แบบ + คืนเบี้ยประกันถ้าไม่เคลม 3 ปีติดต่อกัน',
    icon: '🔄'
  },
  {
    id: 'TL_SENIOR_BONE_CARE',
    name: 'Senior Bone Care',
    name_th: 'ไทยประกันชีวิต ซีเนียร์ โบน แคร์',
    category: 'accident',
    category_th: 'ประกันอุบัติเหตุ (ผู้สูงอายุ)',
    product_type: 'rider',
    age_min: 50, age_max: 70,
    needs: ['accident', 'medical'],
    types: [],
    riders_matched: ['accident', 'health'],
    income_level: 'any',
    requires_main: true,
    no_health_check: false,
    tax_deduction: 0,
    min_annual_premium: 5000,
    highlight: 'คุ้มครองกระดูกหักและแผลไฟไหม้สำหรับผู้สูงอายุ 50–70 ปี โดยเฉพาะ',
    icon: '🦴'
  },

  /* ── 08 โรคร้ายแรง (Critical Illness) ───────────────── */
  {
    id: 'TL_PROMPT_PAY_108_CI_MULTIPAY',
    name: 'พร้อมเปย์ 108',
    name_th: 'ไทยประกันชีวิต พร้อมเปย์ 108 โรคร้าย',
    category: 'critical_illness',
    category_th: 'โรคร้ายแรง (Multi-pay)',
    product_type: 'rider',
    age_min: 0, age_max: 65,
    needs: ['medical'],
    types: [],
    riders_matched: ['ci', 'health'],
    income_level: 'any',
    requires_main: true,
    no_health_check: false,
    tax_deduction: 25000,
    min_annual_premium: 2000,
    highlight: 'CI 108 โรค 3 ระยะ (25/50/100%) Multi-pay สูงสุด 7 เท่าของทุน รวมอัลไซเมอร์',
    icon: '🩺'
  },
  {
    id: 'TL_ROKRAI_DAI_NGOEN_CHUA',
    name: 'โรคร้ายได้เงินชั่ว',
    name_th: 'ไทยประกันชีวิต โรคร้ายได้เงินชั่ว',
    category: 'critical_illness',
    category_th: 'โรคร้ายแรง (Standalone)',
    product_type: 'main_policy',
    age_min: 16, age_max: 50,
    needs: ['medical'],
    types: [],
    riders_matched: ['ci'],
    income_level: 'any',
    requires_main: false,
    no_health_check: false,
    tax_deduction: 25000,
    min_annual_premium: 5000,
    highlight: 'CI Standalone 10 โรคร้ายแรง 2 ระยะ เบี้ยคงที่ตลอดสัญญา ไม่ต้องซื้อประกันชีวิตหลัก',
    icon: '💉'
  },
  {
    id: 'TL_THAI_LIFE_CI48',
    name: 'ทร.48',
    name_th: 'ไทยประกันชีวิต สัญญาเพิ่มเติมโรคร้ายแรง 48',
    category: 'critical_illness',
    category_th: 'โรคร้ายแรง (พื้นฐาน)',
    product_type: 'rider',
    age_min: 15, age_max: 60,
    needs: ['medical'],
    types: [],
    riders_matched: ['ci'],
    income_level: 'any',
    requires_main: true,
    no_health_check: false,
    tax_deduction: 25000,
    min_annual_premium: 2000,
    highlight: 'CI 48 โรคร้ายแรง เบี้ยถูก คุ้มค่า คุ้มครองถึงอายุ 80 ปี เหมาะงบประมาณจำกัด',
    icon: '🔬'
  },

  /* ── 09 Unit Linked ──────────────────────────────────── */
  {
    id: 'TL_UNIVERSAL_LIFE_90_90',
    name: 'Universal Life 90/90',
    name_th: 'ไทยประกันชีวิต ยูนิเวอร์แซล ไลฟ์ 90/90',
    category: 'unit_linked',
    category_th: 'ประกันควบการลงทุน',
    product_type: 'main_policy',
    age_min: 0, age_max: 70,
    needs: ['saving', 'protection', 'tax'],
    types: ['ulip', 'whole'],
    riders_matched: [],
    income_level: 'medium',
    requires_main: false,
    no_health_check: false,
    tax_deduction: 100000,
    min_annual_premium: 20000,
    highlight: 'รับประกัน Min 4% ปีแรก ปรับเบี้ย-ทุน-ถอนได้ยืดหยุ่น Bonus 2% จากปีที่ 10',
    icon: '📱'
  },

  /* ── 11 Legacy / HNW ─────────────────────────────────── */
  {
    id: 'TL_LEGACY_FIT_99',
    name: 'Legacy Fit 99',
    name_th: 'ไทยประกันชีวิต ไทยไลฟ์ เลกาซี ฟิต 99',
    category: 'legacy',
    category_th: 'ประกันชีวิต HNW / มรดก',
    product_type: 'main_policy',
    age_min: 0, age_max: 70,
    needs: ['protection', 'business', 'tax'],
    types: ['whole'],
    riders_matched: [],
    income_level: 'hnw',
    requires_main: false,
    no_health_check: true,
    tax_deduction: 100000,
    min_annual_premium: 200000,
    highlight: 'ประกันชีวิต HNW วงเงิน 10–999 ล้านบาท Estate Planning ไม่ตรวจสุขภาพทุนไม่เกิน 50 ล้าน',
    icon: '👑'
  }
];

/* =============================================================
   Helpers
============================================================= */
function parseBudgetMin (str) {
  if (!str) return 0;
  if (str.includes('มากกว่า 200,000')) return 200001;
  if (str.includes('100,001'))          return 100001;
  if (str.includes('60,001'))           return 60001;
  if (str.includes('30,001'))           return 30001;
  if (str.includes('10,000'))           return 10000;
  return 0;
}

function parseIncomeMin (str) {
  if (!str) return 0;
  const m = str.match(/^(\d+)/);
  return m ? parseInt(m[1]) : 0;
}

function isHNW (netWorth) {
  return netWorth === 'มากกว่า 50 ล้านบาท' || netWorth === '10 – 50 ล้านบาท';
}

/* =============================================================
   Main — matchProducts(fnaData) → Array of up to 5 matches
============================================================= */
function matchProducts (fnaData) {
  if (!fnaData) return [];

  const p   = fnaData.personal          || {};
  const h   = fnaData.health            || {};
  const occ = fnaData.occupation_finance || {};
  const ins = fnaData.insurance_needs    || {};
  const kyc = fnaData.kyc               || {};

  const age        = parseInt(p.age) || 30;
  const purposes   = ins.purposes  || [];
  const insTypes   = ins.types     || [];
  const riders     = ins.riders    || [];
  const budgetMin  = parseBudgetMin(ins.premium_budget);
  const incomeMin  = parseIncomeMin(occ.annual_income);
  const netWorth   = occ.net_worth   || '';
  const monthlyDebt  = parseFloat(occ.monthly_debt)  || 0;
  const dependents   = parseInt(occ.dependents)       || 0;
  const hasExisting  = kyc.has_existing === 'yes';
  const hnw          = isHNW(netWorth);
  const highIncome   = incomeMin >= 600001;

  const diseases       = h.disease_history || [];
  const familyDiseases = h.family_disease  || [];
  const isSmoker       = h.smoking === 'current' || h.smoking === 'ex';
  const hasHealthRisk  = diseases.length > 0 || familyDiseases.length > 0;

  const results = [];

  for (const prod of PRODUCTS) {
    /* ── Hard eligibility ── */
    if (age < prod.age_min || age > prod.age_max) continue;
    if (prod.income_level === 'hnw' && !hnw) continue;
    // Skip very-high-premium products when budget is clearly insufficient
    if (budgetMin > 0 && prod.min_annual_premium > budgetMin * 4) continue;

    let score = 0;
    const reasons = new Set();

    /* 1. Purpose match — 12 pts each (max 48) */
    const purposeLabel = {
      protection : '✓ ตรงกับเป้าหมายคุ้มครองชีวิต',
      saving     : '✓ ตรงกับเป้าหมายออมเงิน',
      retirement : '✓ ตรงกับเป้าหมายวางแผนเกษียณ',
      medical    : '✓ ตรงกับเป้าหมายด้านสุขภาพ',
      tax        : '✓ ช่วยวางแผนลดหย่อนภาษีได้',
      debt       : '✓ คุ้มครองภาระหนี้สินให้ครอบครัว',
      education  : '✓ เหมาะสำหรับวางแผนทุนการศึกษา',
      business   : '✓ เหมาะสำหรับแผนคุ้มครองธุรกิจ'
    };
    let purposePts = 0;
    for (const pur of purposes) {
      if (prod.needs.includes(pur)) {
        purposePts += 12;
        if (purposeLabel[pur]) reasons.add(purposeLabel[pur]);
      }
    }
    score += Math.min(purposePts, 48);

    /* 2. Rider / add-on match — 15 pts each (max 30) */
    const riderLabel = {
      health   : '✓ มีความคุ้มครองสุขภาพตามที่ต้องการ',
      ci       : '✓ มีความคุ้มครองโรคร้ายแรงตามที่ต้องการ',
      accident : '✓ มีความคุ้มครองอุบัติเหตุตามที่ต้องการ'
    };
    let riderPts = 0;
    for (const r of riders) {
      if (prod.riders_matched.includes(r)) {
        riderPts += 15;
        if (riderLabel[r]) reasons.add(riderLabel[r]);
      }
    }
    score += Math.min(riderPts, 30);

    /* 3. Product-type preference — 10 pts */
    if (insTypes.length > 0 && prod.types.some(t => insTypes.includes(t))) {
      score += 10;
      reasons.add('✓ ตรงกับประเภทประกันที่ต้องการ');
    }

    /* 4. Health / CI risk — 15 pts */
    const isCiOrHealth = ['critical_illness','health','health_package'].includes(prod.category)
                      || prod.riders_matched.includes('ci');
    if (hasHealthRisk && isCiOrHealth) {
      score += 15;
      reasons.add('✓ เหมาะสำหรับผู้มีความเสี่ยงหรือประวัติโรคในครอบครัว');
    }

    /* 5. Tax benefit — 8 pts */
    if (purposes.includes('tax') && prod.tax_deduction > 0) {
      score += 8;
      reasons.add(`✓ ลดหย่อนภาษีได้ถึง ${prod.tax_deduction.toLocaleString()} บาท/ปี`);
    }

    /* 6. Protection need — debt / dependents — 8 pts */
    if ((monthlyDebt > 0 || dependents > 0) && prod.needs.includes('protection')) {
      score += 8;
      if (monthlyDebt > 0) reasons.add('✓ ช่วยปกป้องภาระหนี้สินให้ครอบครัว');
      if (dependents > 0)  reasons.add('✓ สร้างหลักประกันให้ผู้พึ่งพิง');
    }

    /* 7. Income / wealth fit — 10 pts */
    if (prod.income_level === 'high' && highIncome) {
      score += 10;
      reasons.add('✓ เหมาะสำหรับระดับรายได้ของท่าน');
    } else if (prod.income_level === 'hnw' && hnw) {
      score += 10;
      reasons.add('✓ เหมาะสำหรับผู้มีทรัพย์สินสูง');
    }

    /* 8. Age-specific bonus — 5 pts */
    if (age >= 50 && prod.id === 'TL_SENIOR_BONE_CARE') {
      score += 5;
      reasons.add('✓ ออกแบบสำหรับช่วงอายุของท่านโดยเฉพาะ');
    }
    if (age >= 30 && age <= 45 && prod.category === 'annuity') {
      score += 5;
      reasons.add('✓ ช่วงอายุเหมาะสมสำหรับเริ่มวางแผนเกษียณ');
    }

    /* 9. No-health-check bonus — 5 pts for smokers / those with health concerns */
    if ((isSmoker || hasHealthRisk) && prod.no_health_check) {
      score += 5;
      reasons.add('✓ ไม่ต้องตรวจสุขภาพ');
    }

    /* 10. Default baseline — give at least 5 pts to good-fit main policies
           so basic protection products still appear when purposes are empty */
    if (score === 0 && !prod.requires_main && prod.category === 'whole_life') {
      score += 5;
      reasons.add('✓ ประกันชีวิตพื้นฐานที่เหมาะสำหรับทุกคน');
    }

    if (score >= 10) {
      const matchPct = Math.min(100, Math.round(score / 75 * 100));
      const matchLabel =
        matchPct >= 80 ? 'เหมาะอย่างยิ่ง' :
        matchPct >= 55 ? 'เหมาะสม'        : 'น่าสนใจ';

      results.push({
        id            : prod.id,
        name          : prod.name,
        name_th       : prod.name_th,
        category      : prod.category,
        category_th   : prod.category_th,
        product_type  : prod.product_type,
        icon          : prod.icon,
        highlight     : prod.highlight,
        tax_deduction : prod.tax_deduction,
        no_health_check : prod.no_health_check,
        requires_main : prod.requires_main,
        requires_pairing : prod.requires_main && !hasExisting,
        score,
        match_pct     : matchPct,
        match_label   : matchLabel,
        reasons       : [...reasons]
      });
    }
  }

  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

module.exports = { matchProducts };
