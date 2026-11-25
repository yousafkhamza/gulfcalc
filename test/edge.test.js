// Edge cases: boundaries, month ends, leap years, formatting and input handling.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { CALCS } from '../src/calculators.js';
import { addMonths, calendarDiff, parseDate, serviceSpan } from '../src/lib/dates.js';
import { gccEndOfService, resignShare, RULES } from '../src/lib/gcc.js';
import { tiered } from '../src/lib/tiers.js';
import { uaeGratuity } from '../src/lib/uae.js';
import { coerce, esc, fmtMoney, renderResult, tr } from '../src/render.js';

const d = parseDate;
const near = (actual, expected, tolerance = 0.01) =>
  assert.ok(Math.abs(actual - expected) <= tolerance, `expected ${expected}, got ${actual}`);

describe('month arithmetic', () => {
  it('clamps to the end of shorter months', () => {
    assert.equal(addMonths(d('2024-01-31'), 1).toISOString().slice(0, 10), '2024-02-29');
    assert.equal(addMonths(d('2023-01-31'), 1).toISOString().slice(0, 10), '2023-02-28');
    assert.equal(addMonths(d('2024-03-31'), -1).toISOString().slice(0, 10), '2024-02-29');
    assert.equal(addMonths(d('2024-11-15'), 3).toISOString().slice(0, 10), '2025-02-15');
  });

  it('handles month-end starts', () => {
    assert.deepEqual(calendarDiff(d('2024-01-31'), d('2024-03-01')), { y: 0, m: 1, d: 1 });
    // A month from the 31st ends on the last day of a shorter month.
    assert.deepEqual(calendarDiff(d('2024-01-31'), d('2024-02-29')), { y: 0, m: 1, d: 0 });
    assert.deepEqual(calendarDiff(d('2023-05-31'), d('2023-06-30')), { y: 0, m: 1, d: 0 });
    assert.deepEqual(calendarDiff(d('2023-05-31'), d('2023-06-29')), { y: 0, m: 0, d: 29 });
  });

  it('counts across a leap day as a whole year', () => {
    const span = serviceSpan(d('2024-01-01'), d('2024-12-31'));
    assert.deepEqual([span.y, span.m, span.d], [1, 0, 0]);
    assert.equal(span.totalDays, 366);
  });

  it('treats a single day as one day of service', () => {
    const span = serviceSpan(d('2024-05-10'), d('2024-05-10'));
    assert.deepEqual([span.y, span.m, span.d], [0, 0, 1]);
    assert.equal(span.totalDays, 1);
  });

  it('handles a 29 February joining date', () => {
    const span = serviceSpan(d('2020-02-29'), d('2021-02-26'));
    assert.equal(span.y, 0);
    const full = serviceSpan(d('2020-02-29'), d('2021-02-28'));
    assert.equal(full.y, 1);
  });
});

describe('tier boundaries', () => {
  it('splits exactly at the boundary', () => {
    const t = tiered(5, [{ upTo: 5, rate: 10 }, { upTo: Infinity, rate: 20 }]);
    assert.equal(t.total, 50);
    assert.equal(t.parts[1].amount, 0);
  });
  it('returns zero for zero years', () => {
    assert.equal(tiered(0, [{ upTo: 5, rate: 10 }]).total, 0);
  });
  it('always returns one part per tier', () => {
    assert.equal(tiered(1, [{ upTo: 5, rate: 1 }, { upTo: 10, rate: 2 }, { upTo: Infinity, rate: 3 }]).parts.length, 3);
  });
});

describe('eligibility boundaries', () => {
  it('UAE: exactly one year qualifies', () => {
    const r = uaeGratuity({ basic: 3000, start: d('2023-01-01'), end: d('2023-12-31') });
    assert.equal(r.eligible, true);
    near(r.total, 21 * 100);
  });
  it('UAE: one day short does not', () => {
    assert.equal(uaeGratuity({ basic: 3000, start: d('2023-01-01'), end: d('2023-12-30') }).eligible, false);
  });
  it('Saudi resignation shares at exact boundaries', () => {
    assert.equal(resignShare(RULES.saudi, 5), 2 / 3);
    assert.equal(resignShare(RULES.saudi, 9.99), 2 / 3);
  });
  it('Kuwait resignation shares at exact boundaries', () => {
    assert.equal(resignShare(RULES.kuwait, 2.99), 0);
    assert.equal(resignShare(RULES.kuwait, 3), 1 / 2);
    assert.equal(resignShare(RULES.kuwait, 5), 2 / 3);
    assert.equal(resignShare(RULES.kuwait, 10), 1);
  });
  it('countries without resignation rules pay in full', () => {
    assert.equal(resignShare(RULES.qatar, 2), 1);
    assert.equal(resignShare(RULES.oman, 2), 1);
  });
  it('Saudi has no minimum service when the employer ends the contract', () => {
    const r = gccEndOfService('saudi', { wage: 12000, start: d('2024-01-01'), end: d('2024-06-30') });
    assert.equal(r.eligible, true);
    near(r.total, 0.5 * 12000 * 0.5);
  });
  it('unknown country throws', () => {
    assert.throws(() => gccEndOfService('mars', { wage: 1, start: d('2020-01-01'), end: d('2021-01-01') }));
  });
});

describe('formatting', () => {
  it('formats AED in English with the code first', () => {
    assert.equal(fmtMoney(1234.5, 'AED', 'en'), 'AED 1,234.50');
  });
  it('uses 3 decimals for OMR, BHD and KWD', () => {
    assert.equal(fmtMoney(1.5, 'KWD', 'en'), 'KWD 1.500');
    assert.equal(fmtMoney(1.5, 'OMR', 'en'), 'OMR 1.500');
    assert.equal(fmtMoney(1.5, 'BHD', 'en'), 'BHD 1.500');
  });
  it('puts the Arabic currency after the number, with Western digits', () => {
    const s = fmtMoney(1234.5, 'AED', 'ar');
    assert.ok(s.endsWith('د.إ'), s);
    assert.ok(/1.234.50|1,234.50|1٬234٫50/.test(s), s);
    assert.ok(!/[٠-٩]/.test(s), `Arabic-Indic digits in ${s}`);
  });
  it('never prints NaN for bad numbers', () => {
    assert.ok(!fmtMoney(NaN, 'AED', 'en').includes('NaN'));
    assert.ok(!fmtMoney(Infinity, 'AED', 'en').includes('∞'));
  });
  it('tr falls back to English and handles plain strings', () => {
    assert.equal(tr({ en: 'Hi', ar: 'مرحبا' }, 'ar'), 'مرحبا');
    assert.equal(tr({ en: 'Hi' }, 'ar'), 'Hi');
    assert.equal(tr('plain', 'ar'), 'plain');
    assert.equal(tr(null, 'en'), '');
  });
  it('escapes HTML', () => {
    assert.equal(esc('<a href="x">&\'</a>'), '&lt;a href=&quot;x&quot;&gt;&amp;&#39;&lt;/a&gt;');
  });
});

describe('form input handling', () => {
  const spec = CALCS['uae-gratuity'];

  it('clamps numbers to the field minimum', () => {
    assert.equal(coerce(spec, { basic: '-500' }).basic, 0);
  });
  it('accepts thousands separators', () => {
    assert.equal(coerce(spec, { basic: '12,500' }).basic, 12500);
  });
  it('treats empty or text as zero', () => {
    assert.equal(coerce(spec, { basic: '' }).basic, 0);
    assert.equal(coerce(spec, { basic: 'abc' }).basic, 0);
  });
  it('falls back to the default for unknown select values', () => {
    assert.equal(coerce(spec, { dayBasis: '999' }).dayBasis, '30');
  });
  it('turns invalid dates into an error message, not a crash', () => {
    const html = renderResult(spec, coerce(spec, { start: '2024-02-30', end: '2025-01-01' }), 'en');
    assert.ok(html.includes('is-error'));
  });
  it('escapes values that come from the URL', () => {
    const html = renderResult(spec, coerce(spec, { basic: '<script>' }), 'en');
    assert.ok(!html.includes('<script>'));
  });
  it('fills defaults for fields missing from the URL', () => {
    const v = coerce(spec, {});
    assert.equal(v.basic, 8000);
    assert.ok(v.start instanceof Date);
  });
  it('a calculator that throws shows a friendly error', () => {
    const broken = { currency: 'AED', fields: [], compute: () => { throw new Error('boom'); } };
    assert.ok(renderResult(broken, {}, 'en').includes('is-error'));
  });
});
