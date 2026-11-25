// Stress tests: every calculator with random, extreme and malformed input, every combination of
// dropdown options, and rules that must always hold (monotonic, capped, round trips).
// A fixed seed keeps runs reproducible; change SEED to explore other inputs.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { CALCS } from '../src/calculators.js';
import { addDays, parseDate, toISO } from '../src/lib/dates.js';
import { gccEndOfService } from '../src/lib/gcc.js';
import { convertSalary, flatLoan, loanEmi, vat } from '../src/lib/money.js';
import { contractLeave, leaveDayRate } from '../src/lib/pay.js';
import { federalGovGratuity, uaeGratuity } from '../src/lib/uae.js';
import { coerce, defaults, renderResult } from '../src/render.js';

const SEED = 20261125;
const ROUNDS = 400;
const BAD = ['undefined', 'NaN', '[object Object]', 'Infinity', '∞'];

function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const random = rng(SEED);
const pick = (list) => list[Math.floor(random() * list.length)];
const between = (lo, hi) => lo + random() * (hi - lo);
const randomDate = (fromYear, toYear) => {
  const start = Date.UTC(fromYear, 0, 1);
  const end = Date.UTC(toYear, 11, 31);
  return toISO(new Date(start + Math.floor(random() * ((end - start) / 86400000)) * 86400000));
};

function randomNumber(field) {
  const typical = Number(field.default) || 100;
  return String(
    pick([
      '',
      '0',
      '-1',
      '-99999',
      'abc',
      '1e309',
      '999999999999999',
      '12,345.5',
      '0.0001',
      field.min ?? 0,
      field.max ?? 1e9,
      field.default,
      Math.round(between(0, typical * 3) * 100) / 100,
      Math.round(between(0, typical * 3) * 100) / 100,
      Math.round(between(0, typical * 3) * 100) / 100,
    ]),
  );
}

function randomDateText() {
  return pick([
    '',
    'not-a-date',
    '2023-02-29',
    '2024-02-29',
    '0099-01-01',
    '1900-01-01',
    '2100-12-31',
    '2026-11-30',
    randomDate(1985, 2035),
    randomDate(1985, 2035),
    randomDate(2015, 2027),
    randomDate(2015, 2027),
  ]);
}

function randomRaw(spec) {
  const raw = {};
  for (const f of spec.fields) {
    if (f.type === 'number') raw[f.id] = randomNumber(f);
    else if (f.type === 'date') raw[f.id] = randomDateText();
    else raw[f.id] = random() < 0.1 ? 'bogus' : pick(f.options).value;
  }
  return raw;
}

/** Every money value in a result must be a finite number. */
function checkOutput(id, out, context) {
  if (out.error) return;
  const values = [out.big, ...(out.rows ?? []).map((r) => r.value), ...(out.table?.rows ?? []).flat()];
  for (const v of values) {
    if (!v) continue;
    for (const key of ['money', 'num', 'pct']) {
      if (key in v) assert.ok(Number.isFinite(v[key]), `${id}: ${key} is ${v[key]} for ${context}`);
    }
    if ('date' in v) assert.ok(v.date instanceof Date && !Number.isNaN(v.date.getTime()), `${id}: invalid date for ${context}`);
  }
  if (out.big && 'money' in out.big) assert.ok(out.big.money >= 0, `${id}: negative total ${out.big.money} for ${context}`);
}

describe('every calculator survives random and hostile input', () => {
  for (const [id, spec] of Object.entries(CALCS)) {
    it(`${id}: ${ROUNDS} random inputs in both languages`, () => {
      for (let i = 0; i < ROUNDS; i += 1) {
        const raw = randomRaw(spec);
        const context = JSON.stringify(raw);
        const values = coerce(spec, raw);
        let out;
        assert.doesNotThrow(() => {
          out = spec.compute(values);
        }, `${id} threw for ${context}`);
        checkOutput(id, out, context);
        const html = renderResult(spec, values, i % 2 ? 'ar' : 'en');
        assert.ok(html.includes('result-big') || html.includes('is-error'), `${id}: empty result for ${context}`);
        for (const bad of BAD) assert.ok(!html.includes(bad), `${id}: "${bad}" in output for ${context}`);
        assert.ok(!/<script/i.test(html), `${id}: unescaped markup for ${context}`);
      }
    });

    it(`${id}: every combination of dropdown options`, () => {
      const selects = spec.fields.filter((f) => f.type === 'select');
      let combos = [{}];
      for (const s of selects) combos = combos.flatMap((c) => s.options.map((o) => ({ ...c, [s.id]: o.value })));
      for (const combo of combos) {
        const raw = { ...defaults(spec), ...combo };
        const out = spec.compute(coerce(spec, raw));
        assert.ok(!out.error, `${id}: example values gave an error with ${JSON.stringify(combo)}`);
        checkOutput(id, out, JSON.stringify(combo));
        for (const lang of ['en', 'ar']) {
          const html = renderResult(spec, coerce(spec, raw), lang);
          for (const bad of BAD) assert.ok(!html.includes(bad), `${id}/${lang}: "${bad}" with ${JSON.stringify(combo)}`);
        }
      }
    });

    it(`${id}: an end date before the start date is reported, never calculated`, () => {
      const dates = spec.fields.filter((f) => f.type === 'date');
      if (dates.length < 2) return;
      for (let i = 0; i < 50; i += 1) {
        const a = randomDate(1990, 2030);
        const b = toISO(addDays(parseDate(a), -1 - Math.floor(random() * 3000)));
        const raw = { ...defaults(spec), [dates[0].id]: a, [dates[1].id]: b };
        assert.equal(spec.compute(coerce(spec, raw)).error, 'dates', `${id}: ${a} → ${b}`);
      }
    });
  }
});

describe('rules that must always hold', () => {
  const randomService = () => {
    const start = parseDate(randomDate(1995, 2024));
    const end = addDays(start, Math.floor(between(0, 365 * 30)));
    return { start, end };
  };

  it('UAE: never above the 2-year cap, never negative, and longer service never pays less', () => {
    for (let i = 0; i < ROUNDS; i += 1) {
      const basic = Math.round(between(1000, 80000));
      const { start, end } = randomService();
      const r = uaeGratuity({ basic, start, end });
      assert.ok(r.total >= 0 && r.total <= basic * 24 + 1e-6, `cap broken: ${r.total} for ${basic}`);
      const later = uaeGratuity({ basic, start, end: addDays(end, 1 + Math.floor(between(0, 400))) });
      assert.ok(later.total >= r.total - 1e-6, 'longer service paid less');
      const richer = uaeGratuity({ basic: basic + 500, start, end });
      assert.ok(richer.total >= r.total - 1e-6, 'higher salary paid less');
      const unpaid = uaeGratuity({ basic, start, end, unpaidDays: Math.floor(between(1, 200)) });
      assert.ok(unpaid.total <= r.total + 1e-6, 'unpaid leave increased gratuity');
    }
  });

  it('UAE federal government: notice and unused leave never reduce gratuity', () => {
    for (let i = 0; i < ROUNDS; i += 1) {
      const basic = Math.round(between(3000, 60000));
      const { start, end } = randomService();
      const base = federalGovGratuity({ basic, start, end });
      const more = federalGovGratuity({ basic, start, end, noticeDays: 30, unusedLeaveDays: Math.floor(between(0, 60)) });
      assert.ok(more.total >= base.total - 1e-6);
      assert.ok(Number.isInteger(more.months), 'part months must round up to whole months');
    }
  });

  it('GCC: resigning never pays more than being let go; Kuwait never above 18 months', () => {
    for (let i = 0; i < ROUNDS; i += 1) {
      const wage = Math.round(between(200, 50000));
      const { start, end } = randomService();
      for (const country of ['saudi', 'qatar', 'oman', 'kuwait']) {
        const ended = gccEndOfService(country, { wage, start, end, reason: 'ended' });
        const resigned = gccEndOfService(country, { wage, start, end, reason: 'resigned' });
        assert.ok(resigned.total <= ended.total + 1e-6, `${country}: resigning paid more`);
        assert.ok(ended.total >= 0);
      }
      assert.ok(gccEndOfService('kuwait', { wage, start, end }).total <= wage * 18 + 1e-6, 'Kuwait cap broken');
    }
  });

  it('loans: you always repay at least the principal; a flat rate always costs more than the same reducing rate', () => {
    for (let i = 0; i < ROUNDS; i += 1) {
      const p = Math.round(between(1000, 2000000));
      const rate = Math.round(between(0.1, 25) * 100) / 100;
      const n = Math.floor(between(6, 360));
      const reducing = loanEmi(p, rate, n);
      const flat = flatLoan(p, rate, n);
      assert.ok(reducing.total >= p - 1e-6);
      assert.ok(flat.interest >= reducing.interest - 1e-6, 'flat cheaper than reducing');
      assert.ok(flat.effectiveRate >= rate - 1e-6, 'effective rate below the flat rate');
    }
  });

  it('VAT and salary conversions round-trip', () => {
    for (let i = 0; i < ROUNDS; i += 1) {
      const amount = Math.round(between(0, 1e7) * 100) / 100;
      const added = vat({ amount, mode: 'add' });
      const back = vat({ amount: added.gross, mode: 'remove' });
      assert.ok(Math.abs(back.net - amount) < 1e-6);
      const days = pick([5, 5.5, 6]);
      const hours = pick([7, 8, 9]);
      const monthly = convertSalary({ amount, period: 'month', daysPerWeek: days, hoursPerDay: hours });
      const again = convertSalary({ amount: monthly.hourly, period: 'hour', daysPerWeek: days, hoursPerDay: hours });
      assert.ok(Math.abs(again.monthly - amount) < 1e-4);
    }
  });

  it('leave: a working day is always worth more than a calendar day, and earned leave never falls below the law', () => {
    for (let i = 0; i < ROUNDS; i += 1) {
      const pay = between(1000, 100000);
      assert.ok(leaveDayRate(pay, 'work5') > leaveDayRate(pay, 'calendar'));
      assert.ok(leaveDayRate(pay, 'work6') > leaveDayRate(pay, 'calendar'));
      const basis = pick(['calendar', 'work5', 'work6']);
      const annualDays = Math.round(between(0, 45));
      const months = Math.floor(between(0, 120));
      const c = contractLeave({ annualDays, basis, serviceMonths: months });
      const factor = basis === 'work5' ? 7 / 5 : basis === 'work6' ? 7 / 6 : 1;
      // Earned days, converted to calendar days, must cover the legal minimum for the service.
      const lawMinimum = months < 6 ? 0 : months < 12 ? 2 * Math.floor(months) : 30;
      assert.ok(c.earned * factor >= lawMinimum - 1e-6, `below law: ${JSON.stringify({ annualDays, basis, months, c })}`);
    }
  });
});
