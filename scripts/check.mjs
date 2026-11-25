// Post-build quality gate: run after `npm run build`. Exits non-zero on any problem.
//
// Pages:   broken internal links and #anchors, SEO tags, one <h1>, hreflang pairs, valid JSON-LD,
//          leaked values ("undefined", "NaN"…), duplicate ids, labels and aria-describedby that
//          point nowhere, calculator forms that don't match their definition.
// Security: CSP present when ads are off (and absent when on), inline scripts allowed by CSP hash,
//          no inline style attributes under CSP.
// Browser: every shipped script passes a syntax check, every module import resolves, and the
//          built calculator bundle renders every calculator in both languages.
// Files:   service worker precache, sitemap, robots.txt, manifest, ads.txt.
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { ADS_ENABLED, ADSENSE_CLIENT, AD_SLOTS, BASE_PATH, SITE_URL } from '../src/config.js';

const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
if (!existsSync(dist)) {
  console.error('dist/ not found. Run `npm run build` first.');
  process.exit(1);
}

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

const problems = [];
const fail = (message) => problems.push(message);
const rel = (file) => file.slice(dist.length + 1).split('\\').join('/');
const files = walk(dist);
const pages = files.filter((f) => f.endsWith('.html'));
const ORIGIN = new URL(SITE_URL).origin;

/** Map a site path (starting with BASE_PATH) to a file in dist, or null for external links. */
function fileFor(pathname) {
  const path = decodeURI(pathname);
  if (!path.startsWith(BASE_PATH)) return null;
  let local = path.slice(BASE_PATH.length);
  if (local === '' || local.endsWith('/')) local += 'index.html';
  return join(dist, local);
}

const idsCache = new Map();
function idsIn(file) {
  if (!idsCache.has(file)) {
    const html = readFileSync(file, 'utf8');
    idsCache.set(file, new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
  }
  return idsCache.get(file);
}

// Calculator definitions from the built bundle (the exact code browsers download).
const bundle = join(dist, 'assets', 'js');
const { CALCS } = await import(pathToFileURL(join(bundle, 'calculators.js')).href);
const { coerce, defaults, renderResult } = await import(pathToFileURL(join(bundle, 'render.js')).href);

// ---------- Pages ----------
for (const file of pages) {
  const name = rel(file);
  const html = readFileSync(file, 'utf8');
  const visible = html
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ');

  for (const bad of ['undefined', 'NaN', '[object Object]', 'Infinity', '${']) {
    if (visible.includes(bad)) fail(`${name}: page text contains "${bad}"`);
  }
  if (!/<html lang="(en|ar)" dir="(ltr|rtl)">/.test(html)) fail(`${name}: missing lang/dir on <html>`);
  const lang = html.match(/<html lang="(en|ar)"/)?.[1];
  if (lang === 'ar' && !html.includes('dir="rtl"')) fail(`${name}: Arabic page is not right-to-left`);
  if (!/<title>[^<]{10,}<\/title>/.test(html)) fail(`${name}: missing or short <title>`);
  if (!/<meta name="description" content="[^"]{30,}">/.test(html)) fail(`${name}: missing or short meta description`);

  const isNotFound = name === '404.html';
  const canonical = html.match(/<link rel="canonical" href="([^"]+)">/)?.[1];
  if (isNotFound) {
    if (canonical) fail(`${name}: 404 page should not have a canonical link`);
    if (!html.includes('<meta name="robots" content="noindex">')) fail(`${name}: 404 page should be noindex`);
  } else if (!canonical) {
    fail(`${name}: missing canonical link`);
  } else {
    const expected = `${ORIGIN}${BASE_PATH}${name.replace(/index\.html$/, '')}`;
    if (canonical !== expected) fail(`${name}: canonical is ${canonical}, expected ${expected}`);
  }

  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) fail(`${name}: expected 1 <h1>, found ${h1}`);

  // Security policy.
  const csp = html.match(/<meta http-equiv="Content-Security-Policy" content="([^"]+)">/)?.[1];
  const adScript = html.includes('pagead2.googlesyndication.com/pagead/js/adsbygoogle.js');
  if (ADS_ENABLED) {
    if (!adScript) fail(`${name}: ads are enabled but the AdSense script is missing`);
    if (csp) fail(`${name}: CSP would block AdSense`);
  } else {
    if (adScript) fail(`${name}: AdSense script present while ads are disabled`);
    if (!csp) fail(`${name}: missing Content-Security-Policy`);
  }
  if (csp) {
    for (const m of html.matchAll(/<script>([\s\S]*?)<\/script>/g)) {
      const hash = createHash('sha256').update(m[1]).digest('base64');
      if (!csp.includes(`'sha256-${hash}'`)) fail(`${name}: inline script is not allowed by the CSP hash`);
    }
    if (/\sstyle="/.test(html)) fail(`${name}: inline style attribute is blocked by the CSP`);
  }

  // Ids, labels, aria references.
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (dupes.length) fail(`${name}: duplicate ids ${[...new Set(dupes)].join(', ')}`);
  const idSet = new Set(ids);
  for (const m of html.matchAll(/<label for="([^"]+)"/g)) {
    if (!idSet.has(m[1])) fail(`${name}: label points to missing #${m[1]}`);
  }
  for (const m of html.matchAll(/aria-(?:describedby|labelledby)="([^"]+)"/g)) {
    for (const id of m[1].split(/\s+/)) if (!idSet.has(id)) fail(`${name}: aria reference to missing #${id}`);
  }

  // Links and anchors.
  for (const m of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    const raw = m[1].replace(/&amp;/g, '&');
    if (raw.startsWith('#')) {
      if (raw.length > 1 && !idSet.has(raw.slice(1))) fail(`${name}: anchor ${raw} has no target`);
      continue;
    }
    let url;
    try {
      url = new URL(raw, `${ORIGIN}${BASE_PATH}${name}`);
    } catch {
      fail(`${name}: invalid URL ${raw}`);
      continue;
    }
    if (url.origin !== ORIGIN) continue;
    const target = fileFor(url.pathname);
    if (!target) {
      fail(`${name}: link outside the site path ${raw}`);
      continue;
    }
    if (!existsSync(target)) fail(`${name}: broken link ${raw}`);
    else if (url.hash.length > 1 && target.endsWith('.html') && !idsIn(target).has(url.hash.slice(1))) {
      fail(`${name}: ${raw} points to a missing anchor`);
    }
  }

  // hreflang alternates must exist and point back.
  for (const m of html.matchAll(/<link rel="alternate" hreflang="(en|ar|x-default)" href="([^"]+)">/g)) {
    const url = new URL(m[2]);
    const target = url.origin === ORIGIN ? fileFor(url.pathname) : null;
    if (!target || !existsSync(target)) fail(`${name}: hreflang ${m[1]} page missing ${m[2]}`);
  }
  if (!isNotFound && !/hreflang="ar"/.test(html)) fail(`${name}: missing hreflang alternates`);

  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      JSON.parse(m[1]);
    } catch {
      fail(`${name}: invalid JSON-LD`);
    }
  }

  // Calculator pages: the form must match the calculator definition.
  const calcId = html.match(/<body data-calc="([^"]+)"/)?.[1];
  if (calcId) {
    const spec = CALCS[calcId];
    if (!spec) {
      fail(`${name}: unknown calculator "${calcId}"`);
    } else {
      for (const id of ['calc-form', 'result', 'actions', 'copy-link', 'print', 'reset']) {
        if (!idSet.has(id)) fail(`${name}: calculator page is missing #${id}`);
      }
      const names = [...html.matchAll(/<(?:input|select) id="f-[^"]+" name="([^"]+)"/g)].map((m) => m[1]);
      const expected = spec.fields.map((f) => f.id);
      if (names.join(',') !== expected.join(',')) fail(`${name}: form fields [${names}] do not match [${expected}]`);
      if (!html.includes('class="result-big"')) fail(`${name}: no example result rendered`);
    }
  }
}

// ---------- Browser scripts ----------
const scripts = files.filter((f) => f.endsWith('.js'));
for (const file of scripts) {
  const check = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
  if (check.status !== 0) fail(`${rel(file)}: syntax error\n${check.stderr.trim()}`);
  const source = readFileSync(file, 'utf8');
  // Only real import/export statements: nothing between the keyword and `from` may be a quote.
  for (const m of source.matchAll(/^\s*(?:import|export)\s[^;'"`]*?\sfrom\s+'([^']+)'/gm)) {
    const spec = m[1];
    if (!spec.startsWith('./') && !spec.startsWith('../')) {
      fail(`${rel(file)}: bare import "${spec}" will not load in a browser`);
    } else if (!existsSync(resolve(dirname(file), spec))) {
      fail(`${rel(file)}: import "${spec}" not found`);
    }
  }
}
for (const required of ['assets/js/app.js', 'assets/js/calculators.js', 'assets/js/render.js', 'assets/styles.css', 'assets/icon.svg']) {
  if (!existsSync(join(dist, required))) fail(`missing ${required}`);
}

// The bundle browsers download must render every calculator in both languages.
for (const [id, spec] of Object.entries(CALCS)) {
  for (const lang of ['en', 'ar']) {
    const html = renderResult(spec, coerce(spec, defaults(spec)), lang);
    if (!html.includes('result-big')) fail(`bundle: ${id}/${lang} renders no result`);
    for (const bad of ['undefined', 'NaN', '[object Object]', 'Infinity']) {
      if (html.includes(bad)) fail(`bundle: ${id}/${lang} result contains "${bad}"`);
    }
  }
}

// ---------- Site files ----------
for (const required of ['sitemap.xml', 'robots.txt', 'manifest.webmanifest', 'sw.js', '404.html', 'index.html', 'ar/index.html', '.nojekyll']) {
  if (!existsSync(join(dist, required))) fail(`missing ${required}`);
}

const sw = readFileSync(join(dist, 'sw.js'), 'utf8');
const precache = JSON.parse(sw.match(/const PRECACHE = (\[.*\]);/)?.[1] ?? '[]');
if (!precache.length) fail('sw.js: empty precache list');
for (const path of precache) {
  const target = fileFor(path);
  if (!target || !existsSync(target)) fail(`sw.js: precached ${path} does not exist`);
}

const sitemap = readFileSync(join(dist, 'sitemap.xml'), 'utf8');
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const indexablePages = pages.filter((f) => !rel(f).startsWith('404')).length;
if (locs.length !== indexablePages) fail(`sitemap.xml: ${locs.length} URLs for ${indexablePages} pages`);
for (const loc of locs) {
  const url = new URL(loc);
  const target = url.origin === ORIGIN ? fileFor(url.pathname) : null;
  if (!target || !existsSync(target)) fail(`sitemap.xml: ${loc} does not exist`);
}

const robots = readFileSync(join(dist, 'robots.txt'), 'utf8');
if (!robots.includes(`Sitemap: ${SITE_URL}/sitemap.xml`)) fail('robots.txt: wrong sitemap URL');

try {
  const manifest = JSON.parse(readFileSync(join(dist, 'manifest.webmanifest'), 'utf8'));
  if (manifest.start_url !== BASE_PATH || manifest.scope !== BASE_PATH) fail('manifest: start_url/scope do not match the site path');
  for (const icon of manifest.icons ?? []) {
    const target = fileFor(icon.src);
    if (!target || !existsSync(target)) fail(`manifest: icon ${icon.src} missing`);
  }
} catch {
  fail('manifest.webmanifest: invalid JSON');
}

const adsTxt = join(dist, 'ads.txt');
if (ADSENSE_CLIENT) {
  if (!existsSync(adsTxt)) fail('ads.txt missing although ADSENSE_CLIENT is set');
  else if (!/^google\.com, pub-\d{10,20}, DIRECT, f08c47fec0942fa0\n$/.test(readFileSync(adsTxt, 'utf8'))) fail('ads.txt: wrong format');
} else if (existsSync(adsTxt)) {
  fail('ads.txt present without ADSENSE_CLIENT');
}
if (ADS_ENABLED && AD_SLOTS.inContent) {
  const sample = readFileSync(join(dist, 'uae', 'gratuity-calculator', 'index.html'), 'utf8');
  if (!sample.includes(`data-ad-slot="${AD_SLOTS.inContent}"`)) fail('ads: in-content slot not rendered');
}

if (problems.length) {
  console.error(`${problems.length} problem(s) found:\n- ${problems.join('\n- ')}`);
  process.exit(1);
}
console.log(`Checked ${pages.length} pages, ${scripts.length} scripts and site files for ${SITE_URL} (ads ${ADS_ENABLED ? 'on' : 'off'}): no problems.`);
