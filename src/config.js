// Build-time settings. Everything can be overridden with environment variables
// (set as GitHub repository variables, see docs/ADSENSE.md), so no code change is needed
// when the site moves to a custom domain or AdSense is approved.

const env = (typeof process !== 'undefined' && process.env) || {};
const clean = (value) => (typeof value === 'string' ? value.trim() : '');

export const SITE_NAME = 'gulfcalc';
export const AUTHOR = 'Yousaf K Hamza';
export const AUTHOR_URL = 'https://yousafkhamza.github.io';
export const REPO_URL = 'https://github.com/yousafkhamza/gulfcalc';

/** Date the legal rules were last checked against the laws. Update when you re-check. */
export const RULES_CHECKED = '2026-11-25';

/** Public URL of the site, without a trailing slash. */
export const SITE_URL = (clean(env.SITE_URL) || 'https://yousafkhamza.github.io/gulfcalc').replace(/\/+$/, '');

/** Path the site is served from: "/gulfcalc/" on github.io, "/" on a custom domain. */
export const BASE_PATH = new URL(`${SITE_URL}/`).pathname;

/** AdSense publisher ID, for example "ca-pub-1234567890123456". */
export const ADSENSE_CLIENT = clean(env.ADSENSE_CLIENT);

/** Ads load only when explicitly enabled and the publisher ID looks valid. */
export const ADS_ENABLED = clean(env.ADS_ENABLED) === 'true' && /^ca-pub-\d{10,20}$/.test(ADSENSE_CLIENT);

/** Optional manual ad unit IDs. Leave empty to rely on AdSense Auto ads. */
export const AD_SLOTS = {
  inContent: clean(env.ADSENSE_SLOT_IN_CONTENT),
  sidebar: clean(env.ADSENSE_SLOT_SIDEBAR),
  home: clean(env.ADSENSE_SLOT_HOME),
};

/** Optional Google Search Console HTML-tag verification code (the content="" value). */
export const GOOGLE_SITE_VERIFICATION = clean(env.GOOGLE_SITE_VERIFICATION);
