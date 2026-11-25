// Browser entry point: live calculators, home search, theme switch, offline support.
import { CALCS } from './calculators.js';
import { coerce, renderResult } from './render.js';

const lang = document.documentElement.lang === 'ar' ? 'ar' : 'en';

function store(key, value) {
  try {
    if (value === undefined) return localStorage.getItem(key);
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    // Storage can be blocked (private mode); the site works without it.
  }
  return null;
}

// Theme: system -> light -> dark -> system.
const toggle = document.getElementById('theme-toggle');
if (toggle) {
  toggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === null ? 'light' : current === 'light' ? 'dark' : null;
    if (next) document.documentElement.setAttribute('data-theme', next);
    else document.documentElement.removeAttribute('data-theme');
    store('gc-theme', next);
  });
}

// Calculator pages.
const calcId = document.body.dataset.calc;
const spec = calcId ? CALCS[calcId] : null;
const form = document.getElementById('calc-form');
const result = document.getElementById('result');

if (spec && form && result) {
  const params = new URLSearchParams(window.location.search);
  const today = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  // Fields marked `today` (last working day, notice date) start at today's date.
  const fillToday = () => {
    for (const field of spec.fields) {
      const el = form.elements.namedItem(field.id);
      if (el && field.today) el.value = today();
    }
  };

  fillToday();
  for (const field of spec.fields) {
    const el = form.elements.namedItem(field.id);
    if (el && params.has(field.id)) el.value = params.get(field.id);
  }

  // Open an optional section when a shared link changed one of its fields.
  for (const details of form.querySelectorAll('details.more')) {
    const changed = spec.fields.some(
      (f) => f.group === details.dataset.group && params.has(f.id) && params.get(f.id) !== String(f.default),
    );
    if (changed) details.open = true;
  }

  // Show or hide fields that only apply to some choices.
  const syncVisibility = () => {
    for (const wrap of form.querySelectorAll('[data-show-field]')) {
      const control = form.elements.namedItem(wrap.dataset.showField);
      wrap.hidden = !(control && wrap.dataset.showValues.split(' ').includes(control.value));
    }
  };

  // Quick picks: set the value and mark the matching button.
  const syncPicks = () => {
    for (const pick of form.querySelectorAll('.pick')) {
      const input = document.getElementById(pick.dataset.for);
      pick.setAttribute('aria-pressed', String(!!input && Number(input.value) === Number(pick.dataset.value)));
    }
  };
  form.addEventListener('click', (event) => {
    const pick = event.target.closest('.pick');
    if (!pick) return;
    const input = document.getElementById(pick.dataset.for);
    if (!input) return;
    input.value = pick.dataset.value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });

  const readRaw = () => {
    const raw = {};
    for (const field of spec.fields) {
      const el = form.elements.namedItem(field.id);
      raw[field.id] = el ? el.value : String(field.default);
    }
    return raw;
  };

  const run = () => {
    syncVisibility();
    syncPicks();
    result.innerHTML = renderResult(spec, coerce(spec, readRaw()), lang);
  };

  form.addEventListener('input', run);
  form.addEventListener('change', run);
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    run();
  });
  run();

  const actions = document.getElementById('actions');
  if (actions) actions.hidden = false;

  const copy = document.getElementById('copy-link');
  if (copy) {
    const label = copy.textContent;
    copy.addEventListener('click', async () => {
      const link = new URL(window.location.href);
      link.search = new URLSearchParams(readRaw()).toString();
      history.replaceState(null, '', link);
      try {
        await navigator.clipboard.writeText(link.toString());
        copy.textContent = copy.dataset.done;
      } catch {
        copy.textContent = copy.dataset.fail;
      }
      setTimeout(() => {
        copy.textContent = label;
      }, 2500);
    });
  }

  const print = document.getElementById('print');
  if (print) print.addEventListener('click', () => window.print());

  const reset = document.getElementById('reset');
  if (reset) {
    reset.addEventListener('click', () => {
      form.reset();
      fillToday();
      for (const details of form.querySelectorAll('details.more')) details.open = false;
      history.replaceState(null, '', window.location.pathname);
      run();
    });
  }
}

// Home page search.
const searchWrap = document.getElementById('search-wrap');
const search = document.getElementById('q');
if (searchWrap && search) {
  searchWrap.hidden = false;
  const empty = document.getElementById('no-results');
  search.addEventListener('input', () => {
    const terms = search.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
    let shown = 0;
    for (const group of document.querySelectorAll('.group')) {
      let inGroup = 0;
      for (const card of group.querySelectorAll('.card')) {
        const text = `${card.dataset.search} ${card.textContent.toLowerCase()}`;
        const match = terms.every((t) => text.includes(t));
        card.parentElement.hidden = !match;
        if (match) inGroup += 1;
      }
      group.hidden = inGroup === 0;
      shown += inGroup;
    }
    if (empty) empty.hidden = shown > 0;
  });
}

// Manual AdSense units, when the build included any.
const units = document.querySelectorAll('ins.adsbygoogle');
if (units.length) {
  window.adsbygoogle = window.adsbygoogle || [];
  units.forEach(() => window.adsbygoogle.push({}));
}

// Offline support.
if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
  const base = new URL('../../', import.meta.url);
  navigator.serviceWorker.register(new URL('sw.js', base), { scope: base.pathname }).catch(() => {});
}
