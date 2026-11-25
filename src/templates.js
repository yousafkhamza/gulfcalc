// HTML templates. Every function returns a string; nothing here runs in the browser.
import { CALCS } from './calculators.js';
import { coerce, defaults, esc, fmtDate, renderResult, tr } from './render.js';
import { UI } from './content/ui.js';
import { GROUP_ORDER, PAGES, pageByCalc } from './content/pages.js';
import { parseDate } from './lib/dates.js';

/** Small inline script that applies the saved theme before first paint (its hash goes in the CSP). */
export const THEME_BOOT =
  "(function(){try{var t=localStorage.getItem('gc-theme');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t);}catch(e){}})();";

function jsonLd(data) {
  // Escape "<" so the JSON can never close the script element.
  return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;
}

function head(ctx, { lang, title, description, path, alternates, structured = [], noindex = false }) {
  const { cfg } = ctx;
  const canonical = ctx.abs(lang, path);
  const links = alternates
    ? [
        `<link rel="alternate" hreflang="en" href="${esc(ctx.abs('en', path))}">`,
        `<link rel="alternate" hreflang="ar" href="${esc(ctx.abs('ar', path))}">`,
        `<link rel="alternate" hreflang="x-default" href="${esc(ctx.abs('en', path))}">`,
      ].join('\n')
    : '';
  const ads = cfg.ADS_ENABLED
    ? `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${esc(cfg.ADSENSE_CLIENT)}" crossorigin="anonymous"></script>`
    : '';
  const csp = ctx.csp ? `<meta http-equiv="Content-Security-Policy" content="${esc(ctx.csp)}">` : '';
  const verify = cfg.GOOGLE_SITE_VERIFICATION
    ? `<meta name="google-site-verification" content="${esc(cfg.GOOGLE_SITE_VERIFICATION)}">`
    : '';
  const fonts =
    lang === 'ar'
      ? 'family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=Sora:wght@600;700'
      : 'family=IBM+Plex+Sans:wght@400;500;600&family=Sora:wght@600;700';
  return `<!doctype html>
<html lang="${lang}" dir="${UI[lang].dir}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
${csp}
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
${noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${esc(canonical)}">`}
${links}
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(cfg.SITE_NAME)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(canonical)}">
<meta property="og:locale" content="${lang === 'ar' ? 'ar_AE' : 'en_AE'}">
<meta name="twitter:card" content="summary">
<meta name="theme-color" content="#0B6E5F" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0C1412" media="(prefers-color-scheme: dark)">
${verify}
<link rel="icon" href="${ctx.asset('icon.svg')}" type="image/svg+xml">
<link rel="manifest" href="${ctx.root}manifest.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?${fonts}&display=swap">
<link rel="stylesheet" href="${ctx.asset('styles.css')}">
<script>${THEME_BOOT}</script>
<script type="module" src="${ctx.asset('js/app.js')}"></script>
${ads}
${structured.map(jsonLd).join('\n')}
</head>`;
}

function header(ctx, lang, path) {
  const ui = UI[lang];
  const other = lang === 'ar' ? 'en' : 'ar';
  return `<a class="skip" href="#main">${esc(ui.skip)}</a>
<header class="site-header">
  <div class="wrap bar">
    <a class="logo" href="${ctx.url(lang, '')}" aria-label="${esc(ctx.cfg.SITE_NAME)}">
      <span class="logo-mark" aria-hidden="true">${lang === 'ar' ? 'خ' : 'gc'}</span><span>${esc(ctx.cfg.SITE_NAME)}</span>
    </a>
    <nav class="top-nav" aria-label="${lang === 'ar' ? 'القائمة الرئيسية' : 'Main'}">
      <a href="${ctx.url(lang, '')}#calculators">${esc(ui.nav.all)}</a>
      <a href="${ctx.url(lang, 'about/')}">${esc(ui.nav.about)}</a>
      ${path === null ? '' : `<a class="lang-switch" href="${ctx.url(other, path)}" hreflang="${other}" lang="${other}">${esc(ui.otherLang)}</a>`}
      <button type="button" class="theme-toggle" id="theme-toggle" aria-label="${esc(ui.theme)}" title="${esc(ui.theme)}"><span aria-hidden="true"></span></button>
    </nav>
  </div>
</header>`;
}

function footer(ctx, lang) {
  const f = UI[lang].footer;
  const year = ctx.cfg.RULES_CHECKED.slice(0, 4);
  return `<footer class="site-footer">
  <div class="wrap foot">
    <nav class="foot-links" aria-label="${lang === 'ar' ? 'روابط التذييل' : 'Footer'}">
      <a href="${ctx.url(lang, 'about/')}">${esc(f.about)}</a>
      <a href="${ctx.url(lang, 'privacy/')}">${esc(f.privacy)}</a>
      <a href="${ctx.url(lang, 'terms/')}">${esc(f.terms)}</a>
      <a href="${ctx.url(lang, 'contact/')}">${esc(f.contact)}</a>
      <a href="${esc(ctx.cfg.REPO_URL)}" rel="noopener">${esc(f.source)}</a>
    </nav>
    <p class="foot-note">${esc(f.note)}</p>
    <p class="foot-note">© ${year} ${esc(ctx.cfg.SITE_NAME)} · <a href="${esc(ctx.cfg.AUTHOR_URL)}" rel="noopener">${esc(ctx.cfg.AUTHOR)}</a></p>
  </div>
</footer>`;
}

function shell(ctx, opts, main) {
  return `${head(ctx, opts)}
<body${opts.calc ? ` data-calc="${esc(opts.calc)}"` : ''}>
${header(ctx, opts.lang, opts.alternates ? opts.path : null)}
<main id="main" class="wrap main">
${main}
</main>
${footer(ctx, opts.lang)}
</body>
</html>
`;
}

function adSlot(ctx, name) {
  const { cfg } = ctx;
  const slot = cfg.AD_SLOTS[name];
  if (!cfg.ADS_ENABLED || !slot) return '';
  return `<div class="ad" data-ad="${esc(name)}"><ins class="adsbygoogle" style="display:block" data-ad-client="${esc(cfg.ADSENSE_CLIENT)}" data-ad-slot="${esc(slot)}" data-ad-format="auto" data-full-width-responsive="true"></ins></div>`;
}

function fieldHTML(field, lang) {
  const id = `f-${field.id}`;
  const hint = field.hint ? `<span class="hint" id="${id}-hint">${esc(tr(field.hint, lang))}</span>` : '';
  const described = field.hint ? ` aria-describedby="${id}-hint"` : '';
  let control;
  if (field.type === 'select') {
    const options = field.options
      .map((o) => `<option value="${esc(o.value)}"${String(o.value) === String(field.default) ? ' selected' : ''}>${esc(tr(o.label, lang))}</option>`)
      .join('');
    control = `<select id="${id}" name="${esc(field.id)}"${described}>${options}</select>`;
  } else if (field.type === 'date') {
    control = `<input id="${id}" name="${esc(field.id)}" type="date" value="${esc(field.default)}" required${described}>`;
  } else {
    const attrs = [
      field.min !== undefined ? `min="${field.min}"` : '',
      field.max !== undefined ? `max="${field.max}"` : '',
      `step="${field.step ?? 'any'}"`,
    ]
      .filter(Boolean)
      .join(' ');
    control = `<input id="${id}" name="${esc(field.id)}" type="number" inputmode="decimal" ${attrs} value="${esc(field.default)}"${described}>`;
  }
  return `<div class="field"><label for="${id}">${esc(tr(field.label, lang))}</label>${control}${hint}</div>`;
}

function checkedChip(ctx, lang) {
  const date = fmtDate(parseDate(ctx.cfg.RULES_CHECKED), lang, false);
  return `<p class="meta"><span class="chip">${esc(UI[lang].calc.checked)}: ${esc(date)}</span></p>`;
}

export function calcPage(ctx, page, lang) {
  const ui = UI[lang];
  const spec = CALCS[page.calc];
  if (!spec) throw new Error(`No calculator "${page.calc}" for page ${page.slug}`);
  const title = tr(page.title, lang);
  const fields = spec.fields.map((f) => fieldHTML(f, lang)).join('\n');
  const result = renderResult(spec, coerce(spec, defaults(spec)), lang);
  const related = page.related
    .map((id) => pageByCalc(id))
    .filter(Boolean)
    .map((p) => `<li><a href="${ctx.url(lang, p.slug)}">${esc(tr(p.title, lang))}</a></li>`)
    .join('');
  const guide = page.guide
    .map((s) => `<section><h3>${esc(tr(s.h, lang))}</h3>${s.p.map((p) => `<p>${esc(tr(p, lang))}</p>`).join('')}</section>`)
    .join('\n');
  const faq = page.faq
    .map((f) => `<details><summary>${esc(tr(f.q, lang))}</summary><p>${esc(tr(f.a, lang))}</p></details>`)
    .join('\n');

  const structured = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: title,
      url: ctx.abs(lang, page.slug),
      description: tr(page.description, lang),
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'Any',
      inLanguage: lang,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'AED' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: page.faq.map((f) => ({
        '@type': 'Question',
        name: tr(f.q, lang),
        acceptedAnswer: { '@type': 'Answer', text: tr(f.a, lang) },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: ui.crumbsHome, item: ctx.abs(lang, '') },
        { '@type': 'ListItem', position: 2, name: title, item: ctx.abs(lang, page.slug) },
      ],
    },
  ];

  const main = `<nav class="crumbs" aria-label="${lang === 'ar' ? 'مسار التنقل' : 'Breadcrumb'}"><a href="${ctx.url(lang, '')}">${esc(ui.crumbsHome)}</a><span aria-hidden="true"> › </span><span>${esc(title)}</span></nav>
<header class="page-head">
  <h1>${esc(title)}</h1>
  <p class="lede">${esc(tr(page.intro, lang))}</p>
  ${checkedChip(ctx, lang)}
</header>
<div class="calc">
  <section class="calc-main" aria-labelledby="inputs-h">
    <div class="panel">
      <h2 id="inputs-h" class="panel-title">${esc(ui.calc.inputs)}</h2>
      <form id="calc-form" class="form" novalidate>
${fields}
      </form>
    </div>
    <div id="result" class="result-slot" aria-live="polite">${result}</div>
    <noscript><p class="hint">${esc(ui.calc.noscript)}</p></noscript>
    <div class="actions" id="actions" hidden>
      <button type="button" class="btn primary" id="copy-link" data-done="${esc(ui.calc.copied)}" data-fail="${esc(ui.calc.copyFail)}">${esc(ui.calc.copy)}</button>
      <button type="button" class="btn" id="print">${esc(ui.calc.print)}</button>
      <button type="button" class="btn ghost" id="reset">${esc(ui.calc.reset)}</button>
    </div>
    ${adSlot(ctx, 'inContent')}
  </section>
  <aside class="calc-side">
    <div class="box">
      <h2>${esc(ui.calc.how)}</h2>
      <ul>${page.how.map((h) => `<li>${esc(tr(h, lang))}</li>`).join('')}</ul>
    </div>
    <div class="box">
      <h2>${esc(ui.calc.related)}</h2>
      <ul class="links">${related}</ul>
    </div>
    ${adSlot(ctx, 'sidebar')}
  </aside>
</div>
<article class="guide">
  <h2>${esc(ui.calc.guide)}</h2>
  ${guide}
  <h2>${esc(ui.calc.faq)}</h2>
  <div class="faq">${faq}</div>
  <p class="law"><strong>${esc(ui.calc.law)}:</strong> ${esc(tr(page.law, lang))}</p>
  <p class="disclaimer">${esc(ui.calc.disclaimer)}</p>
</article>`;

  return shell(
    ctx,
    {
      lang,
      title: `${tr(page.metaTitle, lang)} | ${ctx.cfg.SITE_NAME}`,
      description: tr(page.description, lang),
      path: page.slug,
      alternates: true,
      structured,
      calc: page.calc,
    },
    main,
  );
}

export function homePage(ctx, lang) {
  const ui = UI[lang];
  const groups = GROUP_ORDER.map((group) => {
    const cards = PAGES.filter((p) => p.group === group)
      .map((p) => {
        const search = `${tr(p.title, 'en')} ${tr(p.title, 'ar')} ${tr(p.keywords, 'en')} ${tr(p.keywords, 'ar')}`.toLowerCase();
        return `<li><a class="card" href="${ctx.url(lang, p.slug)}" data-search="${esc(search)}"><h3>${esc(tr(p.title, lang))}</h3><p>${esc(tr(p.card, lang))}</p></a></li>`;
      })
      .join('');
    return `<section class="group" data-group="${esc(group)}"><h2>${esc(ui.groups[group])}</h2><ul class="cards">${cards}</ul></section>`;
  }).join('\n');

  const why = ui.home.why.map(([h, p]) => `<div><h3>${esc(h)}</h3><p>${esc(p)}</p></div>`).join('');

  const main = `<section class="hero">
  <h1>${esc(ui.home.title)}</h1>
  <p class="lede">${esc(ui.home.lede)}</p>
  <div class="search" id="search-wrap" hidden>
    <label for="q" class="sr-only">${esc(ui.home.search)}</label>
    <input id="q" type="search" placeholder="${esc(ui.home.searchPlaceholder)}" autocomplete="off">
  </div>
</section>
<div id="calculators" class="groups">
${groups}
<p class="hint" id="no-results" hidden>${esc(ui.home.noResults)}</p>
</div>
<section class="why">${why}</section>
${adSlot(ctx, 'home')}`;

  return shell(
    ctx,
    {
      lang,
      title: `${ui.home.title} | ${ctx.cfg.SITE_NAME}`,
      description: ui.home.lede,
      path: '',
      alternates: true,
      structured: [
        {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: ctx.cfg.SITE_NAME,
          url: ctx.abs(lang, ''),
          inLanguage: lang,
          description: ui.tagline,
        },
      ],
    },
    main,
  );
}

export function staticPage(ctx, page, lang) {
  const title = tr(page.title, lang);
  const body = page.sections
    .map((s) => `<section><h2>${esc(tr(s.h, lang))}</h2>${s.p.map((p) => `<p>${esc(tr(p, lang))}</p>`).join('')}</section>`)
    .join('\n');
  const main = `<header class="page-head"><h1>${esc(title)}</h1></header>
<article class="guide prose">
${body}
</article>`;
  return shell(
    ctx,
    { lang, title: `${title} | ${ctx.cfg.SITE_NAME}`, description: tr(page.description, lang), path: page.slug, alternates: true },
    main,
  );
}

export function notFoundPage(ctx) {
  const lang = 'en';
  const nf = UI.en.notFound;
  const nfAr = UI.ar.notFound;
  const main = `<header class="page-head">
  <h1>${esc(nf.title)}</h1>
  <p class="lede">${esc(nf.body)}</p>
  <p class="lede" lang="ar" dir="rtl">${esc(nfAr.body)}</p>
  <p class="actions"><a class="btn primary" href="${ctx.url('en', '')}">${esc(nf.back)}</a> <a class="btn" href="${ctx.url('ar', '')}" lang="ar">${esc(nfAr.back)}</a></p>
</header>`;
  return shell(ctx, { lang, title: `${nf.title} | ${ctx.cfg.SITE_NAME}`, description: nf.body, path: '', alternates: false, noindex: true }, main);
}
