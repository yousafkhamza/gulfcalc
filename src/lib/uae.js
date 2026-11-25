// UAE end-of-service rules.
import { addDays, calendarDiff, parseDate, serviceSpan } from './dates.js';
import { tiered } from './tiers.js';

/** Daily basic wage. Most employers and MOHRE examples divide by 30; some use 365 days a year. */
export function dailyWage(basic, basis = 30) {
  return basis === 365 ? (basic * 12) / 365 : basic / 30;
}

/**
 * Private sector (mainland) and most free zones.
 * Federal Decree-Law No. 33 of 2021, Article 51:
 * 21 days of basic wage per year for the first 5 years, 30 days per year after,
 * nothing under 1 year, unpaid absence not counted, total capped at 2 years' wage.
 */
export function uaeGratuity({ basic, start, end, unpaidDays = 0, dayBasis = 30 }) {
  const span = serviceSpan(start, end);
  if (!span) return { error: 'dates' };
  const unpaid = Math.max(0, unpaidDays || 0);
  const years = Math.max(0, span.years - unpaid / 365);
  const daily = dailyWage(basic, dayBasis);
  const eligible = years >= 1;
  const t = tiered(years, [
    { upTo: 5, rate: 21 * daily },
    { upTo: Infinity, rate: 30 * daily },
  ]);
  const cap = basic * 24;
  const raw = eligible ? t.total : 0;
  return {
    span,
    unpaid,
    years,
    daily,
    eligible,
    first: eligible ? t.parts[0].amount : 0,
    after: eligible ? t.parts[1].amount : 0,
    cap,
    capped: raw > cap,
    total: Math.min(raw, cap),
  };
}

/**
 * Federal government, non-UAE-national full-time employees.
 * Federal Decree-Law No. 49 of 2022, Article 41:
 * 21 days of basic salary per year for the first 5 years, 30 days per year after,
 * nothing under 1 continuous year, notice period and unused leave count as service,
 * and any part of a month counts as a full month. No cap is set by the article.
 */
export function federalGovGratuity({ basic, start, end, noticeDays = 0, unusedLeaveDays = 0 }) {
  const span = serviceSpan(start, end);
  if (!span) return { error: 'dates' };
  const extra = Math.max(0, noticeDays || 0) + Math.max(0, unusedLeaveDays || 0);
  const diff = calendarDiff(start, addDays(end, 1 + extra));
  const months = diff.y * 12 + diff.m + (diff.d > 0 ? 1 : 0);
  const years = months / 12;
  const daily = basic / 30;
  const eligible = span.y >= 1;
  const t = tiered(years, [
    { upTo: 5, rate: 21 * daily },
    { upTo: Infinity, rate: 30 * daily },
  ]);
  return {
    span,
    extra,
    months,
    years,
    daily,
    eligible,
    first: eligible ? t.parts[0].amount : 0,
    after: eligible ? t.parts[1].amount : 0,
    total: eligible ? t.total : 0,
  };
}

export const DEWS_START = '2020-02-01';

/**
 * DIFC: gratuity stopped accruing on 31 January 2020 and DEWS took over.
 * Service before that date: 21 days per year (30 after 5 years) of basic wage, paid at exit.
 * From 1 February 2020: employer pays 5.83% of monthly basic wage (8.33% once service passes 5 years)
 * into DEWS, which is invested. annualReturn is an optional assumption for the estimate.
 */
export function difcDews({ basic, start, end, annualReturn = 0 }) {
  const span = serviceSpan(start, end);
  if (!span) return { error: 'dates' };
  const dews = parseDate(DEWS_START);
  const daily = (basic * 12) / 365;
  const eligible = span.years >= 1;

  let legacyYears = 0;
  if (start < dews) {
    const legacyEnd = end < dews ? end : addDays(dews, -1);
    legacyYears = serviceSpan(start, legacyEnd).years;
  }
  const legacy = eligible
    ? tiered(legacyYears, [
        { upTo: 5, rate: 21 * daily },
        { upTo: Infinity, rate: 30 * daily },
      ]).total
    : 0;

  let months = 0;
  if (end >= dews) {
    const from = start > dews ? start : dews;
    months = serviceSpan(from, end).months;
  }
  const monthlyReturn = Math.max(0, annualReturn || 0) / 100 / 12;
  const whole = Math.floor(months);
  const fraction = months - whole;
  const steps = whole + (fraction > 1e-9 ? 1 : 0);
  let contributions = 0;
  let balance = 0;
  let higherRateMonths = 0;
  for (let i = 0; i < steps; i += 1) {
    const share = i < whole ? 1 : fraction;
    const tenure = legacyYears + i / 12;
    const rate = tenure < 5 ? 0.0583 : 0.0833;
    if (rate > 0.06) higherRateMonths += share;
    const amount = basic * rate * share;
    contributions += amount;
    balance = balance * (1 + monthlyReturn) + amount;
  }
  return {
    span,
    eligible,
    daily,
    legacyYears,
    legacy,
    months,
    higherRateMonths,
    contributions,
    growth: balance - contributions,
    balance,
    total: legacy + balance,
  };
}
