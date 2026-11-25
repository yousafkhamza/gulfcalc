import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { calendarDiff, parseDate, serviceSpan } from '../src/lib/dates.js';
import { difcDews, federalGovGratuity, uaeGratuity } from '../src/lib/uae.js';

const d = parseDate;
const near = (actual, expected, tolerance = 0.01) =>
  assert.ok(Math.abs(actual - expected) <= tolerance, `expected ${expected}, got ${actual}`);

describe('dates', () => {
  it('rejects impossible dates', () => {
    assert.equal(parseDate('2023-02-29'), null);
    assert.equal(parseDate('2024-13-01'), null);
    assert.equal(parseDate('not a date'), null);
    assert.ok(parseDate('2024-02-29'));
  });

  it('counts whole years with both ends included', () => {
    const span = serviceSpan(d('2021-01-01'), d('2023-12-31'));
    assert.deepEqual([span.y, span.m, span.d], [3, 0, 0]);
    assert.equal(span.years, 3);
    assert.equal(span.totalDays, 1095);
  });

  it('borrows days from the previous month', () => {
    assert.deepEqual(calendarDiff(d('2024-01-31'), d('2024-03-01')), { y: 0, m: 1, d: 1 });
  });

  it('returns null when the end is before the start', () => {
    assert.equal(serviceSpan(d('2024-01-02'), d('2024-01-01')), null);
  });
});

describe('UAE private-sector gratuity', () => {
  it('pays 21 days a year for 3 years', () => {
    const r = uaeGratuity({ basic: 9000, start: d('2021-01-01'), end: d('2023-12-31') });
    assert.equal(r.eligible, true);
    near(r.daily, 300);
    near(r.total, 3 * 21 * 300);
  });

  it('switches to 30 days after 5 years', () => {
    // 2016-01-01 to 2023-12-31 = 8 whole years.
    const r = uaeGratuity({ basic: 9000, start: d('2016-01-01'), end: d('2023-12-31') });
    near(r.first, 5 * 21 * 300);
    near(r.after, 3 * 30 * 300);
    near(r.total, 31500 + 27000);
  });

  it('pays nothing under one year', () => {
    const r = uaeGratuity({ basic: 9000, start: d('2023-01-01'), end: d('2023-06-30') });
    assert.equal(r.eligible, false);
    assert.equal(r.total, 0);
  });

  it('removes unpaid leave from service', () => {
    // 1 year and 9 days, minus 20 unpaid days, falls under 1 year.
    const r = uaeGratuity({ basic: 9000, start: d('2021-01-01'), end: d('2022-01-09'), unpaidDays: 20 });
    assert.equal(r.eligible, false);
    assert.equal(r.total, 0);
  });

  it('caps the total at 2 years of basic salary', () => {
    const r = uaeGratuity({ basic: 1000, start: d('1990-01-01'), end: d('2019-12-31') });
    assert.equal(r.capped, true);
    assert.equal(r.total, 24000);
  });

  it('supports the 365-day daily wage', () => {
    const r = uaeGratuity({ basic: 3650, start: d('2021-01-01'), end: d('2023-12-31'), dayBasis: 365 });
    near(r.daily, 120);
    near(r.total, 3 * 21 * 120);
  });

  it('reports bad dates', () => {
    assert.equal(uaeGratuity({ basic: 1, start: null, end: d('2024-01-01') }).error, 'dates');
  });
});

describe('UAE federal government gratuity', () => {
  it('pays 21 days a year for exactly 5 years', () => {
    const r = federalGovGratuity({ basic: 9000, start: d('2020-01-01'), end: d('2024-12-31') });
    assert.equal(r.months, 60);
    near(r.total, 5 * 21 * 300);
  });

  it('adds notice days and rounds part months up', () => {
    const r = federalGovGratuity({ basic: 9000, start: d('2020-01-01'), end: d('2024-12-31'), noticeDays: 10 });
    assert.equal(r.months, 61);
    near(r.total, 31500 + (1 / 12) * 30 * 300);
  });

  it('needs one continuous year of actual service', () => {
    const r = federalGovGratuity({ basic: 9000, start: d('2024-01-01'), end: d('2024-11-30'), noticeDays: 60 });
    assert.equal(r.eligible, false);
    assert.equal(r.total, 0);
  });
});

describe('DIFC DEWS', () => {
  it('splits pre-2020 gratuity and DEWS contributions', () => {
    const r = difcDews({ basic: 10000, start: d('2018-02-01'), end: d('2022-01-31') });
    near(r.legacyYears, 2);
    near(r.legacy, 2 * 21 * ((10000 * 12) / 365));
    near(r.months, 24);
    near(r.contributions, 24 * 583);
    near(r.total, r.legacy + r.contributions);
  });

  it('uses 8.33% after 5 years of total service', () => {
    const r = difcDews({ basic: 10000, start: d('2015-02-01'), end: d('2021-01-31') });
    near(r.legacyYears, 5);
    near(r.months, 12);
    near(r.contributions, 12 * 833);
  });

  it('only DEWS for someone who joined after 2020', () => {
    const r = difcDews({ basic: 10000, start: d('2022-01-01'), end: d('2022-12-31') });
    assert.equal(r.legacy, 0);
    near(r.contributions, 12 * 583);
  });

  it('adds growth when a return is assumed', () => {
    const r = difcDews({ basic: 10000, start: d('2022-01-01'), end: d('2023-12-31'), annualReturn: 6 });
    assert.ok(r.growth > 0);
    assert.ok(r.balance > r.contributions);
  });
});
