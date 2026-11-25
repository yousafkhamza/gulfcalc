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
 * Leave pay. While on leave the worker is paid basic wage plus housing allowance;
 * unused days paid out at the end of service use the basic wage only.
 */
export function leaveSalary({ basic, housing = 0, days, mode = 'leave' }) {
  const perDay = mode === 'encash' ? basic / 30 : (basic + Math.max(0, housing)) / 30;
  return { perDay, days: Math.max(0, days || 0), total: perDay * Math.max(0, days || 0) };
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
}) {
  const gratuity = uaeGratuity({ basic, start, end, unpaidDays: unpaidLeaveDays, dayBasis });
  if (gratuity.error) return gratuity;
  const leave = (basic / 30) * Math.max(0, unusedLeaveDays);
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
