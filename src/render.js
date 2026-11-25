// Shared by the static build (first render) and the browser (live updates).
import { parseDate } from './lib/dates.js';

export const CURRENCIES = {
  AED: { decimals: 2, ar: 'د.إ' },
  SAR: { decimals: 2, ar: 'ر.س' },
  QAR: { decimals: 2, ar: 'ر.ق' },
  OMR: { decimals: 3, ar: 'ر.ع' },
  BHD: { decimals: 3, ar: 'د.ب' },
  KWD: { decimals: 3, ar: 'د.ك' },
};

const LOCALE = { en: 'en-AE', ar: 'ar-AE-u-nu-latn' };

/** Pick the text for a language from "text" or { en, ar }. */
export function tr(value, lang) {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  return value[lang] ?? value.en ?? '';
}

export function esc(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function fmtNumber(n, lang, digits = 2) {
  const safe = Number.isFinite(n) ? n : 0;
  return new Intl.NumberFormat(LOCALE[lang] ?? LOCALE.en, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(safe);
}

export function currencyLabel(code, lang) {
  return lang === 'ar' ? (CURRENCIES[code]?.ar ?? code) : code;
}

export function fmtMoney(n, code, lang) {
  const digits = CURRENCIES[code]?.decimals ?? 2;
  const number = fmtNumber(n, lang, digits);
  return lang === 'ar' ? `${number} ${currencyLabel(code, lang)}` : `${code} ${number}`;
}

export function fmtDate(date, lang, withWeekday = true) {
  if (!date) return '';
  const options = { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' };
  if (withWeekday) options.weekday = 'long';
  return new Intl.DateTimeFormat(lang === 'ar' ? 'ar-AE-u-nu-latn' : 'en-GB', options).format(date);
}

/** Format one result value: { money } | { text } | { date } | { num, digits, unit } | { pct }. */
export function fmtValue(value, code, lang) {
  if (!value) return '';
  if ('money' in value) return esc(fmtMoney(value.money, value.currency ?? code, lang));
  if ('text' in value) return esc(tr(value.text, lang));
  if ('date' in value) return esc(fmtDate(value.date, lang));
  if ('pct' in value) return esc(`${fmtNumber(value.pct, lang, value.digits ?? 2)}%`);
  if ('num' in value) {
    const unit = value.unit ? ` ${tr(value.unit, lang)}` : '';
    return esc(`${fmtNumber(value.num, lang, value.digits ?? 2)}${unit}`);
  }
  return '';
}

function bigValue(value, code, lang) {
  if (value && 'money' in value) {
    const c = value.currency ?? code;
    const digits = CURRENCIES[c]?.decimals ?? 2;
    const number = esc(fmtNumber(value.money, lang, digits));
    const cur = `<span class="cur">${esc(currencyLabel(c, lang))}</span>`;
    return lang === 'ar' ? `${number} ${cur}` : `${cur} ${number}`;
  }
  return fmtValue(value, code, lang);
}

/** Turn raw form strings into typed values using the field definitions. */
export function coerce(spec, raw) {
  const values = {};
  for (const field of spec.fields) {
    const input = raw[field.id] ?? String(field.default ?? '');
    if (field.type === 'number') {
      let n = parseFloat(String(input).replace(/,/g, ''));
      if (!Number.isFinite(n)) n = 0;
      if (field.min !== undefined) n = Math.max(field.min, n);
      if (field.max !== undefined) n = Math.min(field.max, n);
      values[field.id] = n;
    } else if (field.type === 'date') {
      values[field.id] = parseDate(String(input));
    } else {
      const allowed = (field.options ?? []).map((o) => o.value);
      values[field.id] = allowed.includes(String(input)) ? String(input) : String(field.default);
    }
  }
  return values;
}

export function defaults(spec) {
  const raw = {};
  for (const field of spec.fields) raw[field.id] = String(field.default);
  return raw;
}

export const ERRORS = {
  dates: {
    en: 'Check the dates: the end date must be on or after the start date.',
    ar: 'راجع التواريخ: يجب أن يكون تاريخ النهاية في يوم البداية أو بعده.',
  },
  generic: {
    en: 'Something in the form could not be calculated. Check the numbers and try again.',
    ar: 'تعذّر الحساب. راجع الأرقام وحاول مرة أخرى.',
  },
};

/** Render the result panel for a calculator. */
export function renderResult(spec, values, lang) {
  let out;
  try {
    out = spec.compute(values);
  } catch {
    out = { error: 'generic' };
  }
  if (!out || out.error) {
    const message = ERRORS[out?.error] ?? ERRORS.generic;
    return `<div class="result is-error"><p>${esc(tr(message, lang))}</p></div>`;
  }
  const code = typeof spec.currency === 'function' ? spec.currency(values) : spec.currency;
  let html = '<div class="result">';
  html += `<p class="result-label">${esc(tr(out.label, lang))}</p>`;
  html += `<p class="result-big">${bigValue(out.big, code, lang)}</p>`;
  if (out.badge) html += `<p class="badge badge-${esc(out.badge.tone)}">${esc(tr(out.badge.text, lang))}</p>`;
  if (out.rows?.length) {
    html += '<dl class="rows">';
    for (const row of out.rows) {
      const cls = row.strong ? ' class="strong"' : '';
      html += `<div${cls}><dt>${esc(tr(row.label, lang))}</dt><dd>${fmtValue(row.value, code, lang)}</dd></div>`;
    }
    html += '</dl>';
  }
  if (out.table) {
    html += '<div class="table-wrap"><table><thead><tr>';
    for (const head of out.table.head) html += `<th scope="col">${esc(tr(head, lang))}</th>`;
    html += '</tr></thead><tbody>';
    for (const r of out.table.rows) {
      html += '<tr>';
      for (const cell of r) html += `<td>${fmtValue(cell, code, lang)}</td>`;
      html += '</tr>';
    }
    html += '</tbody></table></div>';
  }
  if (out.notes?.length) {
    html += '<ul class="notes">';
    for (const note of out.notes) html += `<li>${esc(tr(note, lang))}</li>`;
    html += '</ul>';
  }
  html += '</div>';
  return html;
}
