import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { parseDate } from '../src/lib/dates.js';
import { bahrainEndOfService, gccEndOfService, resignShare, RULES } from '../src/lib/gcc.js';

const d = parseDate;
const near = (actual, expected, tolerance = 0.01) =>
  assert.ok(Math.abs(actual - expected) <= tolerance, `expected ${expected}, got ${actual}`);

const THREE_YEARS = { start: d('2021-01-01'), end: d('2023-12-31') };
const ONE_YEAR = { start: d('2023-01-01'), end: d('2023-12-31') };

describe('Saudi Arabia', () => {
  it('pays half a month a year when the employer ends the contract', () => {
    near(gccEndOfService('saudi', { wage: 10000, ...THREE_YEARS }).total, 15000);
  });

  it('pays one third after resigning with 3 years', () => {
    near(gccEndOfService('saudi', { wage: 10000, ...THREE_YEARS, reason: 'resigned' }).total, 5000);
  });

  it('pays nothing after resigning under 2 years', () => {
    assert.equal(gccEndOfService('saudi', { wage: 10000, ...ONE_YEAR, reason: 'resigned' }).total, 0);
  });

  it('pays a full month a year after 5 years', () => {
    // 2014-01-01 to 2023-12-31 = 10 whole years: 5 × 0.5 + 5 × 1 = 7.5 months, resigning at 10 years = full.
    const r = gccEndOfService('saudi', { wage: 10000, start: d('2014-01-01'), end: d('2023-12-31'), reason: 'resigned' });
    near(r.total, 75000);
  });

  it('resignation shares follow Article 85', () => {
    assert.equal(resignShare(RULES.saudi, 1.9), 0);
    assert.equal(resignShare(RULES.saudi, 2), 1 / 3);
    assert.equal(resignShare(RULES.saudi, 7), 2 / 3);
    assert.equal(resignShare(RULES.saudi, 10), 1);
  });
});

describe('Kuwait', () => {
  it('pays 15 days (of 26) a year for 3 years', () => {
    near(gccEndOfService('kuwait', { wage: 10400, ...THREE_YEARS }).total, 18000);
  });

  it('halves it after resigning with 3 years', () => {
    near(gccEndOfService('kuwait', { wage: 10400, ...THREE_YEARS, reason: 'resigned' }).total, 9000);
  });

  it('caps at 18 months of wage', () => {
    const r = gccEndOfService('kuwait', { wage: 1000, start: d('1990-01-01'), end: d('2019-12-31') });
    assert.equal(r.capped, true);
    assert.equal(r.total, 18000);
  });

  it('pays nothing under one year', () => {
    assert.equal(gccEndOfService('kuwait', { wage: 1000, start: d('2023-01-01'), end: d('2023-06-30') }).total, 0);
  });
});

describe('Qatar', () => {
  it('pays 21 days a year', () => {
    near(gccEndOfService('qatar', { wage: 9000, ...THREE_YEARS }).total, 3 * 21 * 300);
  });

  it('ignores resignation', () => {
    near(gccEndOfService('qatar', { wage: 9000, ...THREE_YEARS, reason: 'resigned' }).total, 18900);
  });
});

describe('Oman', () => {
  it('pays a month a year', () => {
    near(gccEndOfService('oman', { wage: 1000, ...THREE_YEARS }).total, 3000);
  });
});

describe('Bahrain', () => {
  it('splits employer and SIO periods', () => {
    const r = bahrainEndOfService({ wage: 1000, start: d('2021-03-01'), end: d('2025-02-28') });
    near(r.legacyYears, 3);
    near(r.legacy, 1500);
    near(r.months, 12);
    near(r.sio, 12 * 84);
    near(r.total, 2508);
  });

  it('uses 4.2% for new joiners', () => {
    const r = bahrainEndOfService({ wage: 1000, start: d('2024-03-01'), end: d('2025-02-28') });
    assert.equal(r.legacy, 0);
    near(r.sio, 12 * 42);
  });
});
