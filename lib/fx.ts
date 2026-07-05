// Approximate, last-resort-only fallback if the live FX call fails.
// Never used unless the network request itself is unavailable.
const FALLBACK_USD_TO_EUR = 0.92;

/**
 * Fetches a live exchange rate via the Frankfurter API (free, no key required).
 * FX moves slowly relative to stock quotes, so this caches longer than quotes.
 */
export async function fetchFxRate(from: string, to: string): Promise<number> {
  if (from === to) return 1;

  try {
    const url = `https://api.frankfurter.app/latest?from=${from}&to=${to}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`http-${res.status}`);

    const data = (await res.json()) as { rates?: Record<string, number> };
    const rate = data.rates?.[to];
    if (!rate) throw new Error("no-rate");

    return rate;
  } catch {
    if (from === "USD" && to === "EUR") return FALLBACK_USD_TO_EUR;
    return 1;
  }
}
