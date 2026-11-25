// Post-build quality gate: run after `npm run build`. Exits non-zero on any problem.
// Checks every page for broken internal links, required SEO tags, one <h1>,
// matching hreflang pages, and leaked template values such as "undefined" or "NaN".
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { BASE_PATH } from '../src/config.js';

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
const pages = walk(dist).filter((f) => f.endsWith('.html'));

function resolveInternal(href) {
  const path = decodeURI(href.split('#')[0].split('?')[0]);
  if (!path.startsWith(BASE_PATH)) return null;
  let rel = path.slice(BASE_PATH.length);
  if (rel === '' || rel.endsWith('/')) rel += 'index.html';
  return join(dist, rel);
}

for (const file of pages) {
  const name = file.slice(dist.length + 1);
  const html = readFileSync(file, 'utf8');
  const visible = html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ');

  for (const bad of ['undefined', 'NaN', '[object Object]', 'Infinity']) {
    if (visible.includes(bad)) problems.push(`${name}: page text contains "${bad}"`);
  }
  if (!/<html lang="(en|ar)" dir="(ltr|rtl)">/.test(html)) problems.push(`${name}: missing lang/dir on <html>`);
  if (!/<title>[^<]{10,}<\/title>/.test(html)) problems.push(`${name}: missing or short <title>`);
  if (!/<meta name="description" content="[^"]{30,}">/.test(html)) problems.push(`${name}: missing or short meta description`);
  if (!name.startsWith('404') && !/<link rel="canonical" href="https?:\/\/[^"]+">/.test(html)) problems.push(`${name}: missing canonical link`);
  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) problems.push(`${name}: expected 1 <h1>, found ${h1}`);
  if (/\sstyle="/.test(html) && !html.includes('adsbygoogle')) problems.push(`${name}: inline style attribute (blocked by CSP)`);

  for (const match of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    const target = resolveInternal(match[1].replace(/&amp;/g, '&'));
    if (target && !existsSync(target)) problems.push(`${name}: broken link ${match[1]}`);
  }

  for (const match of html.matchAll(/<link rel="alternate" hreflang="(?:en|ar)" href="([^"]+)">/g)) {
    const target = resolveInternal(new URL(match[1]).pathname);
    if (target && !existsSync(target)) problems.push(`${name}: hreflang page missing ${match[1]}`);
  }

  for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      JSON.parse(match[1]);
    } catch {
      problems.push(`${name}: invalid JSON-LD`);
    }
  }
}

for (const required of ['sitemap.xml', 'robots.txt', 'manifest.webmanifest', 'sw.js', '404.html', 'index.html', 'ar/index.html']) {
  if (!existsSync(join(dist, required))) problems.push(`missing ${required}`);
}

if (problems.length) {
  console.error(`${problems.length} problem(s) found:\n- ${problems.join('\n- ')}`);
  process.exit(1);
}
console.log(`Checked ${pages.length} pages: no problems.`);
