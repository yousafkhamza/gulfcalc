// Checks the calculator definitions and content: every calculator renders in both languages,
// and every piece of text has an English and an Arabic version.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { CALCS } from '../src/calculators.js';
import { PAGES } from '../src/content/pages.js';
import { staticPages } from '../src/content/static.js';
import { UI } from '../src/content/ui.js';
import { coerce, defaults, renderResult } from '../src/render.js';

function missingTranslations(value, path, out) {
  if (Array.isArray(value)) {
    value.forEach((v, i) => missingTranslations(v, `${path}[${i}]`, out));
  } else if (value && typeof value === 'object') {
    if ('en' in value || 'ar' in value) {
      if (typeof value.en !== 'string' || !value.en.trim()) out.push(`${path}.en`);
      if (typeof value.ar !== 'string' || !value.ar.trim()) out.push(`${path}.ar`);
    }
    for (const [k, v] of Object.entries(value)) if (k !== 'en' && k !== 'ar') missingTranslations(v, `${path}.${k}`, out);
  }
  return out;
}

describe('calculators', () => {
  for (const [id, spec] of Object.entries(CALCS)) {
    for (const lang of ['en', 'ar']) {
      it(`${id} renders its example result in ${lang}`, () => {
        const html = renderResult(spec, coerce(spec, defaults(spec)), lang);
        assert.ok(html.includes('result-big'), `${id}/${lang} did not produce a result: ${html}`);
        for (const bad of ['undefined', 'NaN', '[object Object]', 'Infinity']) {
          assert.ok(!html.includes(bad), `${id}/${lang} contains "${bad}"`);
        }
      });
    }

    it(`${id} shows a clear error for bad dates`, () => {
      const raw = defaults(spec);
      const dateFields = spec.fields.filter((f) => f.type === 'date');
      if (dateFields.length < 2) return;
      raw[dateFields[0].id] = '2030-01-01';
      raw[dateFields[1].id] = '2020-01-01';
      const html = renderResult(spec, coerce(spec, raw), 'en');
      assert.ok(html.includes('is-error'), `${id} accepted an end date before the start date`);
    });

    it(`${id} survives empty and negative numbers`, () => {
      const raw = defaults(spec);
      for (const f of spec.fields) if (f.type === 'number') raw[f.id] = '-5';
      const html = renderResult(spec, coerce(spec, raw), 'en');
      assert.ok(!html.includes('NaN'));
    });

    it(`${id} has every label in both languages`, () => {
      assert.deepEqual(missingTranslations(spec.fields, id, []), []);
    });
  }
});

describe('content', () => {
  it('every calculator has exactly one page', () => {
    const ids = PAGES.map((p) => p.calc).sort();
    assert.deepEqual(ids, Object.keys(CALCS).sort());
  });

  it('slugs are unique and end with a slash', () => {
    const slugs = PAGES.map((p) => p.slug);
    assert.equal(new Set(slugs).size, slugs.length);
    for (const s of slugs) assert.match(s, /^[a-z0-9-]+(\/[a-z0-9-]+)*\/$/);
  });

  it('related links point to real calculators', () => {
    for (const p of PAGES) for (const r of p.related) assert.ok(CALCS[r], `${p.slug} links to unknown ${r}`);
  });

  it('page text exists in English and Arabic', () => {
    assert.deepEqual(missingTranslations(PAGES, 'PAGES', []), []);
    const statics = staticPages({ repoUrl: 'https://example.com', checked: { en: '1 Jan 2026', ar: '1 يناير 2026' } });
    assert.deepEqual(missingTranslations(statics, 'static', []), []);
  });

  it('interface text has the same keys in both languages', () => {
    const keys = (o, p = '') =>
      Object.entries(o).flatMap(([k, v]) => (v && typeof v === 'object' && !Array.isArray(v) ? keys(v, `${p}${k}.`) : [`${p}${k}`]));
    assert.deepEqual(keys(UI.ar).sort(), keys(UI.en).sort());
  });

  it('meta descriptions fit in search results', () => {
    const statics = staticPages({ repoUrl: 'https://example.com', checked: { en: '1 Jan 2026', ar: '1 يناير 2026' } });
    for (const p of [...PAGES, ...statics]) {
      for (const lang of ['en', 'ar']) {
        const len = p.description[lang].length;
        assert.ok(len >= 50 && len <= 220, `${p.slug} ${lang} description is ${len} characters`);
      }
    }
    for (const lang of ['en', 'ar']) {
      assert.ok(UI[lang].home.lede.length >= 50, `home ${lang} description is too short`);
      assert.ok(UI[lang].notFound.body.length >= 30, `404 ${lang} description is too short`);
    }
  });
});
