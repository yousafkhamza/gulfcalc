# gulfcalc

Free salary and end-of-service calculators for the UAE and the GCC, in English and Arabic.

**Live:** https://yousafkhamza.github.io/gulfcalc/

Everything runs in the browser. The site has no backend, no database and no sign-up, and the numbers people type never leave their device. It is a static site built with plain Node.js (no npm dependencies) and deployed to GitHub Pages by GitHub Actions.

## Calculators

**UAE end of service**
- Gratuity, private sector (Decree-Law 33/2021)
- Free zone gratuity: JAFZA, DMCC, DAFZA, DSO, RAKEZ and others
- DIFC: pre-2020 gratuity plus DEWS contributions
- Federal government gratuity for non-nationals (Decree-Law 49/2022)
- Final settlement

**UAE pay, leave and notice**
- Leave salary and leave encashment
- Overtime
- Notice period and pay in lieu

**Money**
- VAT (5%)
- Loan / car EMI with flat vs reducing rate
- Mortgage and Dubai buying costs
- Salary converter (AED, SAR, QAR, OMR, BHD, KWD)

**GCC end of service**
- Saudi Arabia, Qatar, Oman, Bahrain (SIO system), Kuwait

Each result shows its working and the law article it follows. Formulas and sources are listed in [docs/RULES.md](docs/RULES.md).

## Features

- English and Arabic (right to left) versions of every page, linked with `hreflang`
- Shareable result links (inputs are stored in the URL, never on a server)
- Print or save the result as PDF
- Works offline (service worker) and can be installed as an app
- Light and dark themes
- Strict Content-Security-Policy, no third-party scripts unless ads are switched on
- SEO: one static HTML page per calculator and language, sitemap, canonical URLs, FAQ and breadcrumb structured data

## Project layout

```
src/lib/            calculation functions (pure, unit tested)
src/calculators.js  form fields and result layout for each calculator
src/render.js       result rendering and number formatting (shared by build and browser)
src/content/        page text in English and Arabic
src/templates.js    HTML templates
src/assets/         CSS, browser script, icon
build.mjs           writes the site to dist/
scripts/check.mjs   checks every built page: links, SEO tags, leaked values
test/               unit tests (node:test)
docs/               legal sources and the custom domain / AdSense guide
```

## Development

Needs Node.js 22 or later. There is nothing to install.

```sh
npm test          # unit tests
npm run build     # build to dist/
npm run check     # check the built pages
npm run ci        # all three
```

To preview locally, build with a local URL so paths start at `/`, then serve `dist/`:

```sh
SITE_URL=http://localhost:8080 npm run build
npx http-server dist -p 8080
```

## Deployment

Pushing to `main` runs tests, builds, checks and deploys to GitHub Pages. Pull requests run the same checks without deploying.

One-time setup: *Settings → Pages → Build and deployment → Source: **GitHub Actions***.

## Custom domain and ads

The steps for moving to your own domain and setting up Google AdSense are in [docs/ADSENSE.md](docs/ADSENSE.md). It only takes repository variables and DNS records; no code changes.

## Disclaimer

Results are estimates, not legal or financial advice. Contracts, company policies and court decisions can lead to different figures.

## License

[MIT](LICENSE) © Yousaf K Hamza
