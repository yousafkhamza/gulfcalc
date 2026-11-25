/**
 * Apply a rate per year of service in bands.
 * tiers: [{ upTo: 5, rate: 100 }, { upTo: Infinity, rate: 150 }] means
 * 100 for each year up to year 5, then 150 for each year after.
 * Part years count in proportion.
 */
export function tiered(years, tiers) {
  let previous = 0;
  let total = 0;
  const parts = [];
  for (const tier of tiers) {
    const top = Math.min(years, tier.upTo);
    const span = Math.max(0, top - previous);
    const amount = span * tier.rate;
    parts.push({ from: previous, to: Math.max(previous, top), years: span, amount });
    total += amount;
    previous = tier.upTo;
    if (years <= tier.upTo) break;
  }
  while (parts.length < tiers.length) parts.push({ from: previous, to: previous, years: 0, amount: 0 });
  return { total, parts };
}
