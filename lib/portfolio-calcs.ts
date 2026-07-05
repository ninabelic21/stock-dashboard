import { fetchQuote } from "@/lib/finnhub";
import { fetchFxRate } from "@/lib/fx";
import { getSymbolInfo } from "@/lib/ticker-symbols";
import type {
  EnrichedPosition,
  EnrichedWatchlistItem,
  Position,
  QuoteResult,
  WatchlistItem,
} from "@/types/portfolio";

async function getFxRates(): Promise<Record<string, number>> {
  const [usdToEur, dkkToEur] = await Promise.all([
    fetchFxRate("USD", "EUR"),
    fetchFxRate("DKK", "EUR"),
  ]);
  return { USD: usdToEur, DKK: dkkToEur, EUR: 1 };
}

async function quoteFor(ticker: string): Promise<QuoteResult> {
  const info = getSymbolInfo(ticker);
  if (!info) return { ok: false, reason: "unknown-ticker" };
  return fetchQuote(info.finnhubSymbol, info.currency);
}

function toEUR(price: number, currency: string, fxRates: Record<string, number>): number {
  const rate = fxRates[currency] ?? 1;
  return price * rate;
}

export async function getEnrichedPositions(
  positions: Position[],
): Promise<EnrichedPosition[]> {
  const [quotes, fxRates] = await Promise.all([
    Promise.allSettled(positions.map((p) => quoteFor(p.ticker))),
    getFxRates(),
  ]);

  const partial = positions.map((position, i) => {
    const result = quotes[i];
    const quote: QuoteResult =
      result.status === "fulfilled" ? result.value : { ok: false, reason: "rejected" };

    const costPerShareEUR = position.costEUR / position.shares;

    if (quote.ok) {
      const priceEUR = toEUR(quote.price, quote.currency, fxRates);
      const valueEUR = priceEUR * position.shares;
      return {
        ...position,
        live: true,
        priceEUR,
        valueEUR,
        costPerShareEUR,
        gainLossEUR: valueEUR - position.costEUR,
        dayChangePct: quote.changePct,
      };
    }

    // Fallback: show cost basis as value, no fake day-change.
    return {
      ...position,
      live: false,
      priceEUR: costPerShareEUR,
      valueEUR: position.costEUR,
      costPerShareEUR,
      gainLossEUR: 0,
      dayChangePct: null,
    };
  });

  const totalValue = partial.reduce((sum, p) => sum + p.valueEUR, 0);

  return partial.map((p) => ({
    ...p,
    allocationPct: totalValue > 0 ? (p.valueEUR / totalValue) * 100 : 0,
  }));
}

export async function getEnrichedWatchlist(
  watchlist: WatchlistItem[],
): Promise<EnrichedWatchlistItem[]> {
  const [quotes, fxRates] = await Promise.all([
    Promise.allSettled(watchlist.map((w) => quoteFor(w.ticker))),
    getFxRates(),
  ]);

  return watchlist.map((item, i) => {
    const result = quotes[i];
    const quote: QuoteResult =
      result.status === "fulfilled" ? result.value : { ok: false, reason: "rejected" };

    if (quote.ok) {
      return {
        ...item,
        live: true,
        priceEUR: toEUR(quote.price, quote.currency, fxRates),
        dayChangePct: quote.changePct,
      };
    }

    return { ...item, live: false, priceEUR: null, dayChangePct: null };
  });
}

export function computeTotalValue(positions: EnrichedPosition[]): number {
  return positions.reduce((sum, p) => sum + p.valueEUR, 0);
}

export function computeTotalGainLoss(positions: EnrichedPosition[]): number {
  return positions.reduce((sum, p) => sum + p.gainLossEUR, 0);
}

export function computeDayChangeEUR(positions: EnrichedPosition[]): number {
  return positions.reduce((sum, p) => {
    if (p.dayChangePct === null) return sum;
    // day change in EUR ≈ today's value * (dayChangePct / (100 + dayChangePct))
    const yesterdayValue = p.valueEUR / (1 + p.dayChangePct / 100);
    return sum + (p.valueEUR - yesterdayValue);
  }, 0);
}

export function computeSectorAllocation(
  positions: EnrichedPosition[],
): { sector: string; pct: number }[] {
  const totalValue = computeTotalValue(positions);
  const bySector = new Map<string, number>();
  for (const p of positions) {
    bySector.set(p.sector, (bySector.get(p.sector) ?? 0) + p.valueEUR);
  }
  return Array.from(bySector.entries())
    .map(([sector, value]) => ({
      sector,
      pct: totalValue > 0 ? (value / totalValue) * 100 : 0,
    }))
    .sort((a, b) => b.pct - a.pct);
}
