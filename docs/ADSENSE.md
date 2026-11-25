# Custom domain and Google AdSense

The site runs on `https://yousafkhamza.github.io/gulfcalc/` with no ads. Follow these steps when you buy a domain and want to show ads. You don't need to change any code: everything below is GitHub settings, DNS records and repository variables.

> **Why a domain first:** AdSense does not accept `*.github.io` addresses, and `ads.txt` has to be served from the root of a domain you own (`https://yourdomain.com/ads.txt`). A project site on github.io can't do either.

## Settings this repo reads

All of these are **repository variables**, not secrets: *Settings → Secrets and variables → Actions → Variables tab → New repository variable*. The build reads them on every run. Leave any of them unset to keep the default.

| Variable | Example | What it does |
|---|---|---|
| `SITE_URL` | `https://yourdomain.com` | Public address. Canonical links, sitemap, hreflang and asset paths all follow it. Default: `https://yousafkhamza.github.io/gulfcalc` |
| `ADSENSE_CLIENT` | `ca-pub-1234567890123456` | Your AdSense publisher ID. When set, the build writes `ads.txt`. |
| `ADS_ENABLED` | `true` | Adds the AdSense script to every page. Only works when `ADSENSE_CLIENT` is also set. |
| `ADSENSE_SLOT_IN_CONTENT` | `1234567890` | Optional manual ad unit shown under each calculator result. |
| `ADSENSE_SLOT_SIDEBAR` | `1234567890` | Optional manual ad unit in the calculator side panel. |
| `ADSENSE_SLOT_HOME` | `1234567890` | Optional manual ad unit at the bottom of the home page. |
| `GOOGLE_SITE_VERIFICATION` | `abc123…` | Optional. Only needed if you verify Search Console with the HTML tag method rather than DNS. |

After you change a variable, redeploy: *Actions → CI and deploy → Run workflow* (branch `main`).

---

## Step 1: Buy the domain

- Use any registrar. Cloudflare Registrar and Namecheap both sell at cost or close to it.
- A short `.com` is best for trust and search. A `.ae` domain needs a UAE trade licence or Emirates ID through an accredited registrar.
- Turn on **auto-renew** and **WHOIS privacy**.

## Step 2: Verify the domain with GitHub

This stops anyone else from pointing the domain at their own GitHub Pages site.

1. Go to your **account** settings (not the repo): *github.com → your avatar → Settings → Pages → Add a domain*.
2. Enter `yourdomain.com`. GitHub shows a TXT record like `_github-pages-challenge-yousafkhamza.yourdomain.com`.
3. Add that TXT record at your DNS provider, wait a few minutes, then click **Verify**.

## Step 3: Point DNS at GitHub Pages

Add these records at your DNS provider:

| Type | Name | Value |
|---|---|---|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| AAAA | `@` | `2606:50c0:8000::153` |
| AAAA | `@` | `2606:50c0:8001::153` |
| AAAA | `@` | `2606:50c0:8002::153` |
| AAAA | `@` | `2606:50c0:8003::153` |
| CNAME | `www` | `yousafkhamza.github.io` |

If the domain is on Cloudflare, set these records to **DNS only** (grey cloud). The orange proxy stops GitHub from issuing the HTTPS certificate.

Check the records from a terminal:

```sh
dig yourdomain.com +short        # should list the four 185.199.x.153 addresses
dig www.yourdomain.com +short    # should show yousafkhamza.github.io
```

## Step 4: Connect the domain to this repo

1. *Repo → Settings → Pages → Custom domain*, enter `yourdomain.com`, then **Save**.
2. Wait for the DNS check to pass, then tick **Enforce HTTPS**. The certificate can take up to an hour.
3. Add the repository variable `SITE_URL` = `https://yourdomain.com` (no trailing slash).
4. Redeploy (*Actions → CI and deploy → Run workflow*).

Check that it worked:

- `https://yourdomain.com/` loads, and so does `https://yourdomain.com/ar/`.
- View the page source: `<link rel="canonical">` shows the new domain.
- `https://yourdomain.com/sitemap.xml` lists the new domain.
- The old `https://yousafkhamza.github.io/gulfcalc/` address redirects to the new domain (GitHub does this automatically).

> The site is deployed by GitHub Actions, so no `CNAME` file is needed in the repo. The custom domain lives in the Pages settings.

## Step 5: Add the site to Google Search Console

1. Go to <https://search.google.com/search-console> and add a **Domain** property for `yourdomain.com`.
2. Verify with the DNS TXT record Google gives you.
3. *Sitemaps* → submit `https://yourdomain.com/sitemap.xml`.
4. Check *Pages* after a few days to see what has been indexed.

Wait until most pages are indexed and the site gets some visitors from search, usually **2 to 6 weeks**. Applying to AdSense with an empty, brand-new site is the most common reason for rejection.

## Step 6: Check the site is ready for AdSense

The site already has most of what AdSense reviewers look for. Check each item before you apply:

- [ ] You are 18 or older and the site is on your own domain (steps 1–4).
- [ ] Privacy policy at `/privacy/` mentions Google AdSense cookies. **It does already.**
- [ ] About (`/about/`) and Contact (`/contact/`) pages exist. **They do already.**
- [ ] Every calculator page has original guide text and an FAQ, in English and Arabic.
- [ ] Every link works. CI runs `npm run check` on each build, so a broken link fails the build.
- [ ] The site works on mobile.
- [ ] No "coming soon" or empty pages.

## Step 7: Apply to AdSense

1. Sign up at <https://adsense.google.com> with the Google account you want to be paid through.
2. Add your site: `yourdomain.com`.
3. Copy your publisher ID (`ca-pub-` followed by 16 digits).
4. Add repository variables `ADSENSE_CLIENT` = your `ca-pub-…` ID and `ADS_ENABLED` = `true`, then redeploy.
   - The AdSense script is now on every page (Google needs this to review the site). No ads show until you are approved.
   - `https://yourdomain.com/ads.txt` now exists. Open it to check it shows `google.com, pub-…, DIRECT, f08c47fec0942fa0`.
5. In AdSense, go to *Sites → yourdomain.com*, confirm the code is placed and that ads.txt is found, then click **Request review**.

> **Security note:** while `ADS_ENABLED` is off, every page carries a strict Content-Security-Policy. AdSense loads scripts and frames from many Google domains, so the build drops that policy when ads are on. Calculations still run entirely in the browser.

## Step 8: Set up the consent message

Google requires a certified consent banner for visitors from the EEA, the UK and Switzerland.

1. AdSense → *Privacy & messaging → European regulations* → **Create**.
2. Choose your site, use the default options, and add a link to `https://yourdomain.com/privacy/`.
3. **Publish**. Google shows the banner itself; nothing changes in this repo.

## Step 9: After approval, turn on ads

**Simplest option: Auto ads.** In AdSense, go to *Ads → By site → yourdomain.com* and switch on **Auto ads**. Google picks where to place them. Under *Ad settings*, turn off **Anchor ads** and **Vignette ads** if you find them too intrusive for a calculator site.

**Optional: fixed ad units in the reserved slots.** In AdSense, go to *Ads → By ad unit → Display ads*, create up to three responsive units, and put their `data-ad-slot` numbers in:

- `ADSENSE_SLOT_IN_CONTENT`: shown below each calculator result
- `ADSENSE_SLOT_SIDEBAR`: shown in the calculator side panel
- `ADSENSE_SLOT_HOME`: shown at the bottom of the home page

Redeploy. Slots without an ID are not rendered, so there are never empty boxes.

The slots are kept away from buttons and form fields on purpose. AdSense penalises layouts that cause accidental clicks.

## Step 10: Get paid

- Add your tax information in *Payments → Settings*.
- At USD 10 in earnings Google posts a PIN to your address to verify it. Enter it in AdSense.
- Payment is sent each month once your balance reaches USD 100.

---

## If the application is rejected

| Reason Google gives | What to do |
|---|---|
| Low value content | Add more original guide text to the calculator pages (`src/content/pages.js`), wait for it to be indexed, then apply again. |
| Site down or unavailable | Check the domain loads over HTTPS and that `ads.txt` is reachable. |
| Policy violations | Read the email, fix the page it names, then request review again. |
| Navigation problems | Run `npm run check` locally and fix any broken links it reports. |

You can apply again as soon as you've fixed the problem. There's no waiting period.

## Turning ads off again

Set `ADS_ENABLED` to `false` (or delete it) and redeploy. The AdSense script and ad slots disappear, and the strict Content-Security-Policy comes back. `ads.txt` stays as long as `ADSENSE_CLIENT` is set, which is harmless.
