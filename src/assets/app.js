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
  for (const field of spec.fields) {
    const el = form.elements.namedItem(field.id);
    if (el && params.has(field.id)) el.value = params.get(field.id);
  }

  const readRaw = () => {
    const raw = {};
    for (const field of spec.fields) {
      const el = form.elements.namedItem(field.id);
      raw[field.id] = el ? el.value : String(field.default);
    }
    return raw;
  };

  const run = () => {
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
