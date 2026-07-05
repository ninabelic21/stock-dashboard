import type { QuoteResult } from "@/types/portfolio";

const FINNHUB_BASE = "https://finnhub.io/api/v1/quote";

/**
 * Fetches a live quote for a single Finnhub symbol.
 *
 * Finnhub returns HTTP 200 with all-zero fields for symbols it has no data
 * for (common for non-US exchange suffixes on the free tier) — that's
 * treated as a failure here, not just a non-2xx status.
 */
export async function fetchQuote(
  finnhubSymbol: string,
  currency: string,
): Promise<QuoteResult> {
  const apiKey = process.env.FINNHUB_API_KEY;
  if (!apiKey) {
    return { ok: false, reason: "missing-api-key" };
  }

  try {
    const url = `${FINNHUB_BASE}?symbol=${encodeURIComponent(finnhubSymbol)}&token=${apiKey}`;
    const res = await fetch(url, { next: { revalidate: 60 } });

    if (!res.ok) {
      return { ok: false, reason: `http-${res.status}` };
    }

    const data = (await res.json()) as { c?: number; d?: number; dp?: number };

    if (!data.c || data.c === 0) {
      return { ok: false, reason: "no-data" };
    }

    return {
      ok: true,
      price: data.c,
      changePct: data.dp ?? 0,
      currency,
    };
  } catch {
    return { ok: false, reason: "network-error" };
  }
}
