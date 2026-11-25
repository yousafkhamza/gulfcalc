// Date helpers. All dates are UTC midnight so time zones and DST never shift a day.

const DAY_MS = 86400000;

/** Parse "YYYY-MM-DD" into a UTC Date, or null when the text is not a real calendar date. */
export function parseDate(text) {
  if (typeof text !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(text)) return null;
  const [y, m, d] = text.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  if (date.getUTCFullYear() !== y || date.getUTCMonth() !== m - 1 || date.getUTCDate() !== d) return null;
  return date;
}

export function toISO(date) {
  return date.toISOString().slice(0, 10);
}

export function addDays(date, days) {
  return new Date(date.getTime() + days * DAY_MS);
}

/** Number of calendar days from a to b, counting both ends. */
export function daysInclusive(a, b) {
  return Math.round((b.getTime() - a.getTime()) / DAY_MS) + 1;
}

/** Add whole months; the day is clamped to the end of a shorter month (31 Jan + 1 month = 28/29 Feb). */
export function addMonths(date, months) {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + months;
  const lastDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  return new Date(Date.UTC(year, month, Math.min(date.getUTCDate(), lastDay)));
}

/** Whole years, months and days from a up to (not including) b. */
export function calendarDiff(a, b) {
  let months = (b.getUTCFullYear() - a.getUTCFullYear()) * 12 + (b.getUTCMonth() - a.getUTCMonth());
  let anchor = addMonths(a, months);
  while (months > 0 && anchor > b) {
    months -= 1;
    anchor = addMonths(a, months);
  }
  const d = Math.round((b.getTime() - anchor.getTime()) / DAY_MS);
  return { y: Math.floor(months / 12), m: months % 12, d };
}

/**
 * Length of service from start to end, both days included.
 * `years` is fractional: whole years + months/12 + days/365.
 * Returns null when a date is missing or end is before start.
 */
export function serviceSpan(start, end) {
  if (!start || !end || end < start) return null;
  const diff = calendarDiff(start, addDays(end, 1));
  return {
    ...diff,
    totalDays: daysInclusive(start, end),
    years: diff.y + diff.m / 12 + diff.d / 365,
    months: diff.y * 12 + diff.m + diff.d / 30,
  };
}
