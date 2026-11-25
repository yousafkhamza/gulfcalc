// End-of-service rules for the other GCC countries (private sector, expatriate workers).
import { addDays, parseDate, serviceSpan } from './dates.js';
import { tiered } from './tiers.js';

/**
 * tiers: months of wage per year of service, by band.
 * resign: [minimumYears, share] pairs. With fewer years than the first pair, a resigning worker gets 0.
 */
export const RULES = {
  // Saudi Labor Law, Articles 84 and 85.
  saudi: {
    currency: 'SAR',
    tiers: [{ upTo: 5, months: 0.5 }, { upTo: Infinity, months: 1 }],
    minYears: 0,
    capMonths: null,
    resign: [[2, 1 / 3], [5, 2 / 3], [10, 1]],
  },
  // Qatar Law No. 14 of 2004, Article 54: at least 3 weeks' basic wage per year after 1 year.
  qatar: {
    currency: 'QAR',
    tiers: [{ upTo: Infinity, months: 21 / 30 }],
    minYears: 1,
    capMonths: null,
    resign: null,
  },
  // Oman Labour Law (Royal Decree 53/2023): one month's basic wage per year for non-Omanis.
  oman: {
    currency: 'OMR',
    tiers: [{ upTo: Infinity, months: 1 }],
    minYears: 1,
    capMonths: null,
    resign: null,
  },
  // Kuwait Law No. 6 of 2010, Articles 51 and 53 (monthly-paid). 15 days = 15/26 of a month (Art. 67).
  kuwait: {
    currency: 'KWD',
    tiers: [{ upTo: 5, months: 15 / 26 }, { upTo: Infinity, months: 1 }],
    minYears: 1,
    capMonths: 18,
    resign: [[3, 1 / 2], [5, 2 / 3], [10, 1]],
  },
  // Bahrain Law No. 36 of 2012, Article 116; paid through SIO from 1 March 2024 (Edict 109 of 2023).
  bahrain: {
    currency: 'BHD',
    tiers: [{ upTo: 3, months: 0.5 }, { upTo: Infinity, months: 1 }],
    minYears: 0,
    capMonths: null,
    resign: null,
    sioStart: '2024-03-01',
  },
};

export function resignShare(rule, years) {
  if (!rule.resign) return 1;
  let share = 0;
  for (const [min, value] of rule.resign) if (years >= min) share = value;
  return share;
}

/** Saudi Arabia, Qatar, Oman, Kuwait. reason: 'ended' (employer ended or contract expired) or 'resigned'. */
export function gccEndOfService(country, { wage, start, end, reason = 'ended' }) {
  const rule = RULES[country];
  if (!rule) throw new Error(`Unknown country: ${country}`);
  const span = serviceSpan(start, end);
  if (!span) return { error: 'dates' };
  const years = span.years;
  const eligible = years >= rule.minYears;
  const t = tiered(
    years,
    rule.tiers.map((tier) => ({ upTo: tier.upTo, rate: tier.months * wage })),
  );
  const gross = eligible ? t.total : 0;
  const cap = rule.capMonths ? rule.capMonths * wage : null;
  const capped = cap !== null && gross > cap;
  const full = capped ? cap : gross;
  const share = reason === 'resigned' ? resignShare(rule, years) : 1;
  return {
    span,
    years,
    eligible,
    parts: t.parts,
    gross,
    cap,
    capped,
    full,
    share,
    total: full * share,
  };
}

/**
 * Bahrain: service before 1 March 2024 is paid by the employer under Article 116
 * (half a month per year for 3 years, then a month per year, on the last wage).
 * From 1 March 2024 the employer pays SIO 4.2% of the monthly wage (8.4% after 3 years' service)
 * and SIO pays the worker.
 */
export function bahrainEndOfService({ wage, start, end }) {
  const rule = RULES.bahrain;
  const span = serviceSpan(start, end);
  if (!span) return { error: 'dates' };
  const sio = parseDate(rule.sioStart);

  let legacyYears = 0;
  if (start < sio) {
    const legacyEnd = end < sio ? end : addDays(sio, -1);
    legacyYears = serviceSpan(start, legacyEnd).years;
  }
  const legacy = tiered(
    legacyYears,
    rule.tiers.map((tier) => ({ upTo: tier.upTo, rate: tier.months * wage })),
  ).total;

  let months = 0;
  if (end >= sio) {
    const from = start > sio ? start : sio;
    months = serviceSpan(from, end).months;
  }
  const whole = Math.floor(months);
  const fraction = months - whole;
  const steps = whole + (fraction > 1e-9 ? 1 : 0);
  let sioAmount = 0;
  for (let i = 0; i < steps; i += 1) {
    const share = i < whole ? 1 : fraction;
    const tenure = legacyYears + i / 12;
    sioAmount += wage * (tenure < 3 ? 0.042 : 0.084) * share;
  }
  return { span, years: span.years, legacyYears, legacy, months, sio: sioAmount, total: legacy + sioAmount };
}
