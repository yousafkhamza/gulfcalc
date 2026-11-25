import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { parseDate } from '../src/lib/dates.js';
import { amortisation, convertSalary, equivalentRate, flatLoan, loanEmi, mortgage, vat } from '../src/lib/money.js';
import { finalSettlement, leaveEntitlement, leaveSalary, noticePeriod, overtime } from '../src/lib/pay.js';

const near = (actual, expected, tolerance = 0.01) =>
  assert.ok(Math.abs(actual - expected) <= tolerance, `expected ${expected}, got ${actual}`);

describe('VAT', () => {
  it('adds 5%', () => {
    const r = vat({ amount: 100, mode: 'add' });
    near(r.vat, 5);
    near(r.gross, 105);
  });
  it('removes 5%', () => {
    const r = vat({ amount: 105, mode: 'remove' });
    near(r.net, 100);
    near(r.vat, 5);
  });
});

describe('loans', () => {
  it('matches the standard EMI', () => {
    near(loanEmi(100000, 5, 60).emi, 1887.12);
  });
  it('handles a zero rate', () => {
    near(loanEmi(1200, 0, 12).emi, 100);
  });
  it('works out a flat-rate loan', () => {
    const r = flatLoan(100000, 3, 60);
    near(r.interest, 15000);
    near(r.emi, 1916.67);
    assert.ok(r.effectiveRate > 5.4 && r.effectiveRate < 5.8, `effective ${r.effectiveRate}`);
  });
  it('finds the rate back from an EMI', () => {
    near(equivalentRate(100000, loanEmi(100000, 5, 60).emi, 60), 5, 0.001);
  });
  it('amortises to zero', () => {
    const years = amortisation(100000, 5, 60);
    assert.equal(years.length, 5);
    near(years.at(-1).balance, 0);
    near(years.reduce((a, y) => a + y.principal, 0), 100000);
  });
});

describe('mortgage', () => {
  it('works out Dubai fees', () => {
    const r = mortgage({ price: 1000000, downPct: 20, rate: 4, years: 25, buyer: 'expat', agentPct: 2 });
    assert.equal(r.loan, 800000);
    near(r.fees.dld, 40580);
    near(r.fees.registration, 2290);
    near(r.fees.trustee, 4200);
    near(r.fees.agent, 21000);
    near(r.fees.bank, 8400);
    assert.equal(r.belowMinimum, false);
  });
  it('flags a down payment below the minimum', () => {
    assert.equal(mortgage({ price: 1000000, downPct: 10, rate: 4, years: 25 }).belowMinimum, true);
    assert.equal(mortgage({ price: 6000000, downPct: 25, rate: 4, years: 25 }).minDownPct, 30);
    assert.equal(mortgage({ price: 1000000, downPct: 15, rate: 4, years: 25, buyer: 'national' }).belowMinimum, false);
  });
});

describe('salary', () => {
  it('converts monthly pay', () => {
    const r = convertSalary({ amount: 10000, period: 'month', daysPerWeek: 5, hoursPerDay: 8 });
    near(r.yearly, 120000);
    near(r.weekly, 2307.69);
    near(r.daily, 461.54);
    near(r.hourly, 57.69);
  });
  it('converts hourly pay back', () => {
    near(convertSalary({ amount: 50, period: 'hour', daysPerWeek: 5, hoursPerDay: 8 }).yearly, 50 * 8 * 5 * 52);
  });
});

describe('pay, leave and notice', () => {
  it('leave entitlement follows Article 29', () => {
    assert.equal(leaveEntitlement(5), 0);
    assert.equal(leaveEntitlement(8), 16);
    assert.equal(leaveEntitlement(12), 30);
  });
  it('leave salary includes housing, encashment does not', () => {
    near(leaveSalary({ basic: 6000, housing: 3000, days: 30, mode: 'leave' }).total, 9000);
    near(leaveSalary({ basic: 6000, housing: 3000, days: 10, mode: 'encash' }).total, 2000);
  });
  it('overtime rates', () => {
    const r = overtime({ basic: 6000, normal: 10, night: 4 });
    near(r.hourly, 25);
    near(r.parts.normal, 312.5);
    near(r.parts.night, 150);
    near(r.total, 462.5);
  });
  it('notice period counts the first day', () => {
    const r = noticePeriod({ noticeDate: parseDate('2026-12-01'), days: 30, monthly: 12000 });
    assert.equal(r.lastDay.toISOString().slice(0, 10), '2026-12-30');
    near(r.payInLieu, 12000);
  });
  it('final settlement adds everything', () => {
    const r = finalSettlement({
      basic: 9000,
      monthly: 15000,
      start: parseDate('2021-01-01'),
      end: parseDate('2023-12-31'),
      unusedLeaveDays: 10,
      salaryDays: 15,
      noticeDays: 0,
      other: 1000,
      deductions: 500,
    });
    near(r.gratuity.total, 18900);
    near(r.leave, 3000);
    near(r.salary, 7500);
    near(r.total, 18900 + 3000 + 7500 + 1000 - 500);
  });
});
