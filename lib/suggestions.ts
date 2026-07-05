import { formatEUR } from "@/lib/format";
import type { EnrichedPosition, Suggestion } from "@/types/portfolio";

const OVER_UNDER_THRESHOLD_PP = 2; // percentage points
const SECTOR_CONCENTRATION_THRESHOLD_PCT = 25;
const BIG_MOVER_THRESHOLD_PCT = 3;

function formatPct(value: number): string {
  return value.toLocaleString("de-DE", { maximumFractionDigits: 1 });
}

/**
 * Pure function: takes live-enriched positions and total value, returns
 * suggestion text. No hardcoded strings elsewhere — everything here
 * recomputes from current data.
 */
export function computeSuggestions(
  positions: EnrichedPosition[],
  totalValue: number,
): Suggestion[] {
  const suggestions: Suggestion[] = [];

  for (const p of positions) {
    const diff = p.allocationPct - p.targetPct;

    if (diff > OVER_UNDER_THRESHOLD_PP) {
      const targetValue = (p.targetPct / 100) * totalValue;
      const sellAmount = p.valueEUR - targetValue;
      suggestions.push({
        type: "overweight",
        title: `${p.name} übergewichtet`,
        text: `${p.ticker} ist ${formatPct(p.allocationPct)} % des Portfolios, Ziel ${p.targetPct} %. Ein Verkauf von ~${formatEUR(sellAmount)} würde rebalancieren.`,
        tickers: [p.ticker],
      });
    } else if (diff < -OVER_UNDER_THRESHOLD_PP) {
      suggestions.push({
        type: "underweight",
        title: `${p.name} untergewichtet`,
        text: `${p.ticker} ist ${formatPct(p.allocationPct)} % des Portfolios, Ziel ${p.targetPct} %. Ein Zukauf würde rebalancieren.`,
        tickers: [p.ticker],
      });
    }
  }

  const bySector = new Map<string, EnrichedPosition[]>();
  for (const p of positions) {
    const list = bySector.get(p.sector) ?? [];
    list.push(p);
    bySector.set(p.sector, list);
  }
  for (const [sector, list] of bySector) {
    if (list.length < 2) continue;
    const sectorPct = list.reduce((sum, p) => sum + p.allocationPct, 0);
    if (sectorPct > SECTOR_CONCENTRATION_THRESHOLD_PCT) {
      suggestions.push({
        type: "sector-concentration",
        title: `${sector}-Klumpen`,
        text: `${list.map((p) => p.ticker).join(" + ")} = ${formatPct(sectorPct)} % in einem Sektor. Streuung erhöhen.`,
        tickers: list.map((p) => p.ticker),
      });
    }
  }

  const movers = positions
    .filter((p) => p.live && p.dayChangePct !== null && Math.abs(p.dayChangePct) > BIG_MOVER_THRESHOLD_PCT)
    .sort((a, b) => Math.abs(b.dayChangePct!) - Math.abs(a.dayChangePct!));

  if (movers.length > 0) {
    const m = movers[0];
    const direction = m.dayChangePct! < 0 ? "größter Tagesverlust" : "größter Tagesgewinn";
    suggestions.push({
      type: "big-mover",
      title: `Starker Beweger: ${m.ticker}`,
      text: `${m.name} heute ${m.dayChangePct! > 0 ? "+" : ""}${formatPct(m.dayChangePct!)} % — ${direction} im Portfolio. Nachrichten prüfen.`,
      tickers: [m.ticker],
    });
  }

  return suggestions;
}
