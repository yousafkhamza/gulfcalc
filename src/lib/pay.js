// UAE pay, leave, notice and settlement helpers.
import { addDays, serviceSpan } from './dates.js';
import { uaeGratuity } from './uae.js';

/** Annual leave days for a year of service (Decree-Law 33/2021, Article 29). */
export function leaveEntitlement(serviceMonths) {
  const months = Math.max(0, serviceMonths || 0);
  if (months < 6) return 0;
  if (months < 12) return 2 * Math.floor(months);
  return 30;
}

/**
 * How a company counts leave days, as the number of days one month of pay is spread over.
 * calendar: the law's 30 calendar days a year, pay ÷ 30.
 * work5 / work6: leave counted in working days (e.g. 22–24 a year), pay × 12 ÷ 260 or ÷ 312.
 */
export const LEAVE_BASIS = { calendar: 30, work5: 260 / 12, work6: 312 / 12 };

/**
 * 'auto' picks the counting method from the contract: 30 or more days a year is almost always
 * calendar days (the law's measure); fewer (22, 24, 25, 26…) is almost always working days.
 */
export function resolveLeaveBasis(basis, annualDays) {
  if (basis in LEAVE_BASIS) return basis;
  return (annualDays ?? 30) >= 30 ? 'calendar' : 'work5';
}

export function leaveDayRate(monthly, basis = 'calendar') {
  return monthly / (LEAVE_BASIS[basis] ?? LEAVE_BASIS.calendar);
}

/** Calendar days of time off that a contract's leave covers (5 working days ≈ 7 calendar days). */
export function calendarEquivalent(days, basis = 'calendar') {
  const factor = basis === 'work5' ? 7 / 5 : basis === 'work6' ? 7 / 6 : 1;
  return Math.max(0, days || 0) * factor;
}

/**
 * Compare a company's leave with the law. Article 29 sets a minimum; contracts may give more,
 * and many count leave in working days (22, 24, 25…) instead of 30 calendar days.
 * earned: days the worker has built up so far in the first year, or the full year after that.
 */
export function contractLeave({ annualDays, basis = 'calendar', serviceMonths = 12 }) {
  const days = Math.max(0, annualDays || 0);
  const months = Math.max(0, serviceMonths || 0);
  const lawDays = leaveEntitlement(months);
  const equivalent = calendarEquivalent(days, basis);
  // Calendar days per contract day: 1 for calendar days, 1.4 for a 5-day week, 7/6 for a 6-day week.
  const factor = calendarEquivalent(1, basis);
  // The worker gets whichever is better: the contract, or the legal minimum expressed in contract days.
  let earned;
  if (months < 6) earned = 0;
  else if (months < 12) earned = Math.max((days * Math.floor(months)) / 12, (2 * Math.floor(months)) / factor);
  else earned = Math.max(days, 30 / factor);
  return {
    annualDays: days,
    equivalent,
    lawDays,
    belowLaw: equivalent < 30,
    earned,
  };
}

/** Pay for unused leave days paid out when the job ends: basic wage only (Article 29). */
export function leaveEncashment({ basic, days, basis = 'calendar' }) {
  const n = Math.max(0, days || 0);
  const perDay = leaveDayRate(basic, basis);
  return { perDay, days: n, total: perDay * n };
}

/**
 * Leave pay. While on leave the worker is paid basic wage plus housing allowance;
 * unused days paid out at the end of service use the basic wage only.
 */
export function leaveSalary({ basic, housing = 0, days, mode = 'leave', basis = 'calendar' }) {
  const monthly = mode === 'encash' ? basic : basic + Math.max(0, housing);
  const perDay = leaveDayRate(monthly, basis);
  const n = Math.max(0, days || 0);
  return { perDay, days: n, total: perDay * n };
}

/**
 * Overtime (Decree-Law 33/2021, Article 19): hourly basic wage + 25%;
 * 10 pm to 4 am, rest days and public holidays + 50% (when no substitute day off is given).
 * Hourly basic wage = basic / 30 / 8.
 */
export function overtime({ basic, normal = 0, night = 0, rest = 0, holiday = 0 }) {
  const hourly = basic / 30 / 8;
  const parts = {
    normal: Math.max(0, normal) * hourly * 1.25,
    night: Math.max(0, night) * hourly * 1.5,
    rest: Math.max(0, rest) * hourly * 1.5,
    holiday: Math.max(0, holiday) * hourly * 1.5,
  };
  const hours = Math.max(0, normal) + Math.max(0, night) + Math.max(0, rest) + Math.max(0, holiday);
  return { hourly, parts, hours, total: parts.normal + parts.night + parts.rest + parts.holiday };
}

/** Notice period: the day notice is given counts as day 1. Pay in lieu uses the full monthly wage. */
export function noticePeriod({ noticeDate, days, monthly = 0 }) {
  if (!noticeDate) return { error: 'dates' };
  const n = Math.max(1, Math.round(days || 0));
  return { lastDay: addDays(noticeDate, n - 1), days: n, perDay: monthly / 30, payInLieu: (monthly / 30) * n };
}

/** Final settlement: gratuity + unused leave + unpaid salary + notice pay + other dues - deductions. */
export function finalSettlement({
  basic,
  monthly,
  start,
  end,
  unpaidLeaveDays = 0,
  unusedLeaveDays = 0,
  salaryDays = 0,
  noticeDays = 0,
  other = 0,
  deductions = 0,
  dayBasis = 30,
  leaveBasis = 'calendar',
}) {
  const gratuity = uaeGratuity({ basic, start, end, unpaidDays: unpaidLeaveDays, dayBasis });
  if (gratuity.error) return gratuity;
  const leave = leaveEncashment({ basic, days: unusedLeaveDays, basis: leaveBasis }).total;
  const salary = (monthly / 30) * Math.max(0, salaryDays);
  const notice = (monthly / 30) * Math.max(0, noticeDays);
  const extra = Math.max(0, other);
  const minus = Math.max(0, deductions);
  return {
    gratuity,
    leave,
    salary,
    notice,
    other: extra,
    deductions: minus,
    total: Math.max(0, gratuity.total + leave + salary + notice + extra - minus),
  };
}

/** Months of service between two dates, used by the leave calculator. */
export function serviceMonths(start, end) {
  const span = serviceSpan(start, end);
  return span ? span.months : 0;
}
