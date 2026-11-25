# Legal rules and sources

Every formula on the site, where it lives in the code, and the law it comes from. Rules last checked: **25 November 2026** (`RULES_CHECKED` in `src/config.js`).

| Calculator | Rule | Code | Source |
|---|---|---|---|
| UAE gratuity (mainland and free zones) | 21 days of basic per year for 5 years, 30 days after; none under 1 year; unpaid leave excluded; cap 24 months of basic | `uaeGratuity` in `src/lib/uae.js` | Federal Decree-Law 33/2021, Art. 51–53 |
| UAE federal government | 21/30 days of basic; nothing under 1 continuous year; notice period and unused leave count as service; part month = full month; no cap | `federalGovGratuity` | Federal Decree-Law 49/2022, Art. 41–42 (in force 2 Jan 2023) |
| DIFC | Gratuity for service to 31 Jan 2020 (21/30 days, daily = basic × 12 ÷ 365); DEWS from 1 Feb 2020 at 5.83% of monthly basic, 8.33% after 5 years | `difcDews` | DIFC Employment Law 2/2019; DEWS regulations |
| Saudi Arabia | ½ month per year for 5 years, 1 month after; resignation: 0 under 2 years, ⅓ for 2–5, ⅔ for 5–10, full at 10+ | `gccEndOfService('saudi')` in `src/lib/gcc.js` | Saudi Labor Law Art. 84, 85, 87 |
| Qatar | 21 days of basic (3 weeks) per year after 1 year | `gccEndOfService('qatar')` | Law 14/2004 Art. 54 |
| Oman | 1 month of basic per year for non-Omanis | `gccEndOfService('oman')` | Royal Decree 53/2023; Social Protection Law (RD 52/2023) savings fund replacing it for future service |
| Kuwait | 15/26 of a month per year for 5 years, 1 month after; cap 18 months; resignation: 0 under 3 years, ½ for 3–5, ⅔ for 5–10, full at 10+ | `gccEndOfService('kuwait')` | Law 6/2010 Art. 51, 53, 55, 67 |
| Bahrain | Before 1 Mar 2024: ½ month per year for 3 years, 1 month after (employer pays). From 1 Mar 2024: 4.2% / 8.4% monthly to SIO | `bahrainEndOfService` | Law 36/2012 Art. 116; Edict 109/2023 |
| UAE leave | 2 days/month after 6 months, 30 days/year after 1 year; leave pay = basic + housing; unused leave at exit = basic. Day value ÷ 30 (law), or × 12 ÷ 260 / ÷ 312 when the company counts leave in working days | `leaveEntitlement`, `leaveSalary`, `leaveEncashment`, `leaveDayRate` in `src/lib/pay.js` | Decree-Law 33/2021 Art. 29 |
| UAE overtime | Hourly = basic ÷ 30 ÷ 8; +25%; +50% for 10 pm–4 am, rest days and public holidays | `overtime` | Art. 17–19, 28 |
| UAE notice | 30–90 days; pay in lieu on full wage | `noticePeriod` | Art. 43 |
| UAE VAT | 5% | `vat` in `src/lib/money.js` | Decree-Law 8/2017 |
| Mortgage | Minimum down payment 20% expats / 15% nationals (first home ≤ AED 5M), 30% / 25% above; Dubai DLD 4% + AED 580; mortgage registration 0.25% + AED 290 | `mortgage` | UAE Central Bank mortgage regulations; Dubai Land Department |

## Updating a rule

1. Change the function in `src/lib/` and update or add a test in `test/` with a hand-worked example.
2. Update the matching page text in `src/content/pages.js` (guide, FAQ and `law`) and the notes in `src/calculators.js`, in both English and Arabic.
3. Update this table and `RULES_CHECKED` in `src/config.js`. The date appears on every calculator page.
4. Open a pull request. CI runs the tests, builds the site and checks every page.
