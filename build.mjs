// Static site build. No dependencies: `node build.mjs` writes the site to dist/.
import { createHash } from 'node:crypto';
import { cpSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import * as cfg from './src/config.js';
import { PAGES } from './src/content/pages.js';
import { staticPages } from './src/content/static.js';
import { UI } from './src/content/ui.js';
import { parseDate } from './src/lib/dates.js';
import { fmtDate } from './src/render.js';
import { calcPage, homePage, notFoundPage, staticPage, THEME_BOOT } from './src/templates.js';

const root = dirname(fileURLToPath(import.meta.url));
const src = join(root, 'src');
const out = join(root, 'dist');
const LANGS = ['en', 'ar'];

function write(path, content) {
  const file = join(out, path);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content);
  return file;
}

function listFiles(dir) {
  const files = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) files.push(...listFiles(full));
    else files.push(full);
  }
  return files;
}

const sha256 = (text, enc = 'hex') => createHash('sha256').update(text).digest(enc);

// 1. Clean output and copy browser assets.
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
cpSync(join(src, 'assets'), join(out, 'assets'), { recursive: true });
mkdirSync(join(out, 'assets', 'js'), { recursive: true });
cpSync(join(src, 'lib'), join(out, 'assets', 'js', 'lib'), { recursive: true });
cpSync(join(src, 'calculators.js'), join(out, 'assets', 'js', 'calculators.js'));
cpSync(join(src, 'render.js'), join(out, 'assets', 'js', 'render.js'));
// app.js lives in src/assets and must sit next to calculators.js.
cpSync(join(src, 'assets', 'app.js'), join(out, 'assets', 'js', 'app.js'));
rmSync(join(out, 'assets', 'app.js'));

const assetFiles = listFiles(join(out, 'assets'));
const version = sha256(assetFiles.map((f) => readFileSync(f)).join('\n')).slice(0, 10);

// 2. Build context shared by all templates.
const BASE = cfg.BASE_PATH;
const ORIGIN = new URL(cfg.SITE_URL).origin;
const url = (lang, path) => `${BASE}${lang === 'ar' ? 'ar/' : ''}${path}`;
const csp = cfg.ADS_ENABLED
  ? '' // AdSense loads scripts and frames from many Google domains; a static meta CSP would break it.
  : [
      "default-src 'self'",
      `script-src 'self' 'sha256-${sha256(THEME_BOOT, 'base64')}'`,
      "style-src 'self' https://fonts.googleapis.com",
      'font-src https://fonts.gstatic.com',
      "img-src 'self' data:",
      "connect-src 'self'",
      "manifest-src 'self'",
      "worker-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      'upgrade-insecure-requests',
    ].join('; ');

const ctx = {
  cfg,
  csp,
  root: BASE,
  url,
  abs: (lang, path) => `${ORIGIN}${url(lang, path)}`,
  asset: (path) => `${BASE}assets/${path}?v=${version}`,
};

// 3. Pages.
const checkedDate = parseDate(cfg.RULES_CHECKED);
const statics = staticPages({
  repoUrl: cfg.REPO_URL,
  checked: { en: fmtDate(checkedDate, 'en', false), ar: fmtDate(checkedDate, 'ar', false) },
});
const indexable = [];
for (const lang of LANGS) {
  const prefix = lang === 'ar' ? 'ar/' : '';
  write(`${prefix}index.html`, homePage(ctx, lang));
  if (lang === 'en') indexable.push('');
  for (const page of PAGES) {
    write(`${prefix}${page.slug}index.html`, calcPage(ctx, page, lang));
    if (lang === 'en') indexable.push(page.slug);
  }
  for (const page of statics) {
    write(`${prefix}${page.slug}index.html`, staticPage(ctx, page, lang));
    if (lang === 'en') indexable.push(page.slug);
  }
}
write('404.html', notFoundPage(ctx));

// 4. Sitemap, robots, manifest, ads.txt.
const sitemapUrls = indexable
  .flatMap((path) =>
    LANGS.map(
      (lang) => `  <url>
    <loc>${ctx.abs(lang, path)}</loc>
    <lastmod>${cfg.RULES_CHECKED}</lastmod>
    <xhtml:link rel="alternate" hreflang="en" href="${ctx.abs('en', path)}"/>
    <xhtml:link rel="alternate" hreflang="ar" href="${ctx.abs('ar', path)}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${ctx.abs('en', path)}"/>
  </url>`,
    ),
  )
  .join('\n');
write(
  'sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${sitemapUrls}
</urlset>
`,
);
write('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${cfg.SITE_URL}/sitemap.xml\n`);

write(
  'manifest.webmanifest',
  JSON.stringify(
    {
      name: `${cfg.SITE_NAME}: ${UI.en.tagline}`,
      short_name: cfg.SITE_NAME,
      description: UI.en.tagline,
      lang: 'en',
      start_url: BASE,
      scope: BASE,
      display: 'standalone',
      background_color: '#F5F8F7',
      theme_color: '#0B6E5F',
      icons: [{ src: `${BASE}assets/icon.svg`, sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' }],
    },
    null,
    2,
  ),
);

if (cfg.ADSENSE_CLIENT) {
  write('ads.txt', `google.com, ${cfg.ADSENSE_CLIENT.replace(/^ca-/, '')}, DIRECT, f08c47fec0942fa0\n`);
}
write('.nojekyll', '');

// 5. Service worker: precache assets and the two home pages; other pages are cached as visited.
const precache = [
  BASE,
  `${BASE}ar/`,
  ...listFiles(join(out, 'assets')).map((f) => `${BASE}${f.slice(out.length + 1).split('\\').join('/')}`),
];
write(
  'sw.js',
  `// Generated by build.mjs
const CACHE = 'gulfcalc-${version}';
const PRECACHE = ${JSON.stringify(precache)};

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('gulfcalc-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  if (request.mode === 'navigate') {
    // Pages: network first so content stays fresh, cache when offline.
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          if (response.ok) caches.open(CACHE).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request).then((hit) => hit || caches.match(${JSON.stringify(BASE)}))),
    );
    return;
  }
  // Assets: cache first; the cache name changes on every release.
  event.respondWith(
    caches.match(request, { ignoreSearch: true }).then(
      (hit) =>
        hit ||
        fetch(request).then((response) => {
          const copy = response.clone();
          if (response.ok) caches.open(CACHE).then((cache) => cache.put(request, copy));
          return response;
        }),
    ),
  );
});
`,
);

const htmlCount = listFiles(out).filter((f) => f.endsWith('.html')).length;
console.log(`Built ${htmlCount} pages to dist/ for ${cfg.SITE_URL} (ads ${cfg.ADS_ENABLED ? 'on' : 'off'}, version ${version})`);
