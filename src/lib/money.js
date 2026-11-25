// VAT, loans, mortgage and salary conversion.

export const UAE_VAT_RATE = 5;

export function vat({ amount, mode = 'add', rate = UAE_VAT_RATE }) {
  const a = Math.max(0, amount || 0);
  if (mode === 'remove') {
    const net = a / (1 + rate / 100);
    return { net, vat: a - net, gross: a };
  }
  const tax = (a * rate) / 100;
  return { net: a, vat: tax, gross: a + tax };
}

/** Reducing-balance EMI. annualRate in percent, n in months. */
export function loanEmi(principal, annualRate, n) {
  const p = Math.max(0, principal || 0);
  const months = Math.max(1, Math.round(n || 0));
  const i = Math.max(0, annualRate || 0) / 1200;
  const emi = i === 0 ? p / months : (p * i * (1 + i) ** months) / ((1 + i) ** months - 1);
  return { emi, months, total: emi * months, interest: emi * months - p };
}

/** Flat-rate loan: interest is charged on the original amount for the whole term. */
export function flatLoan(principal, flatRate, n) {
  const p = Math.max(0, principal || 0);
  const months = Math.max(1, Math.round(n || 0));
  const interest = (p * Math.max(0, flatRate || 0) * months) / 1200;
  const emi = (p + interest) / months;
  return { emi, months, total: p + interest, interest, effectiveRate: equivalentRate(p, emi, months) };
}

/** The reducing-balance rate that gives the same EMI (what a flat rate really costs). */
export function equivalentRate(principal, emi, n) {
  if (principal <= 0 || emi * n <= principal) return 0;
  let lo = 0;
  let hi = 200;
  for (let k = 0; k < 80; k += 1) {
    const mid = (lo + hi) / 2;
    if (loanEmi(principal, mid, n).emi < emi) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

/** Year-by-year amortisation for a reducing-balance loan. */
export function amortisation(principal, annualRate, n) {
  const { emi, months } = loanEmi(principal, annualRate, n);
  const i = Math.max(0, annualRate || 0) / 1200;
  let balance = Math.max(0, principal || 0);
  const years = [];
  let row = null;
  for (let m = 1; m <= months; m += 1) {
    const interest = balance * i;
    const principalPart = Math.min(balance, emi - interest);
    balance = Math.max(0, balance - principalPart);
    if (!row || (m - 1) % 12 === 0) {
      row = { year: Math.ceil(m / 12), principal: 0, interest: 0, balance: 0 };
      years.push(row);
    }
    row.principal += principalPart;
    row.interest += interest;
    row.balance = balance;
  }
  return years;
}

/**
 * UAE home purchase with a mortgage. Fees are typical Dubai figures and can be edited by the user:
 * DLD transfer 4% + AED 580, mortgage registration 0.25% of loan + AED 290,
 * trustee AED 4,000 (AED 2,000 under AED 500k) + VAT, agent fee + VAT, bank fee 1% of loan + VAT,
 * valuation about AED 3,000.
 */
export function mortgage({ price, downPct, rate, years, buyer = 'expat', agentPct = 2 }) {
  const p = Math.max(0, price || 0);
  const down = (p * Math.min(100, Math.max(0, downPct || 0))) / 100;
  const loan = p - down;
  const { emi, total, interest } = loanEmi(loan, rate, Math.max(1, years || 0) * 12);
  const firstHomeUnder5m = p <= 5_000_000;
  const minDownPct = buyer === 'national' ? (firstHomeUnder5m ? 15 : 25) : firstHomeUnder5m ? 20 : 30;
  const fees = {
    dld: p * 0.04 + 580,
    registration: loan > 0 ? loan * 0.0025 + 290 : 0,
    trustee: (p >= 500_000 ? 4000 : 2000) * 1.05,
    agent: ((p * Math.max(0, agentPct || 0)) / 100) * 1.05,
    bank: loan > 0 ? loan * 0.01 * 1.05 : 0,
    valuation: loan > 0 ? 3000 : 0,
  };
  const feeTotal = Object.values(fees).reduce((a, b) => a + b, 0);
  return {
    down,
    loan,
    emi,
    total,
    interest,
    minDownPct,
    belowMinimum: (downPct || 0) < minDownPct,
    fees,
    feeTotal,
    upfront: down + feeTotal,
  };
}

/** Convert pay between hourly, daily, weekly, monthly and yearly. */
export function convertSalary({ amount, period = 'month', daysPerWeek = 5, hoursPerDay = 8 }) {
  const a = Math.max(0, amount || 0);
  const dpw = Math.min(7, Math.max(1, daysPerWeek || 5));
  const hpd = Math.min(24, Math.max(1, hoursPerDay || 8));
  const perYear = {
    hour: 52 * dpw * hpd,
    day: 52 * dpw,
    week: 52,
    month: 12,
    year: 1,
  };
  const yearly = a * (perYear[period] ?? 12);
  return {
    yearly,
    monthly: yearly / 12,
    weekly: yearly / 52,
    daily: yearly / (52 * dpw),
    hourly: yearly / (52 * dpw * hpd),
  };
}
