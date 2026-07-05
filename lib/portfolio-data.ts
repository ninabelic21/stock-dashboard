import type { Position, WatchlistItem } from "@/types/portfolio";

// Real holdings — shares/cost/target are facts about the actual portfolio,
// not sample data. Only prices are ever fetched live.
export const positions: Position[] = [
  { ticker: "IWDA", name: "iShares Core MSCI World", sector: "ETF · Welt", shares: 312, costEUR: 24100, targetPct: 40 },
  { ticker: "VUSA", name: "Vanguard S&P 500", sector: "ETF · USA", shares: 152, costEUR: 11900, targetPct: 20 },
  { ticker: "NVDA", name: "NVIDIA", sector: "Halbleiter", shares: 78, costEUR: 5200, targetPct: 8 },
  { ticker: "MSFT", name: "Microsoft", sector: "Software", shares: 17, costEUR: 6100, targetPct: 8 },
  { ticker: "LLY", name: "Eli Lilly", sector: "Pharma", shares: 8, costEUR: 6300, targetPct: 8 },
  { ticker: "WMT", name: "Walmart", sector: "Einzelhandel", shares: 44, costEUR: 3600, targetPct: 6 },
  { ticker: "BSX", name: "Boston Scientific", sector: "Medizintechnik", shares: 42, costEUR: 3200, targetPct: 5 },
  { ticker: "MPWR", name: "Monolithic Power", sector: "Halbleiter", shares: 4, costEUR: 3400, targetPct: 5 },
];

export const watchlist: WatchlistItem[] = [
  { ticker: "ASML", name: "ASML Holding" },
  { ticker: "NOVO", name: "Novo Nordisk" },
  { ticker: "BRK.B", name: "Berkshire Hathaway" },
  { ticker: "ADBE", name: "Adobe" },
  { ticker: "AIR", name: "Airbus" },
];

export function findPosition(ticker: string): Position | undefined {
  return positions.find((p) => p.ticker === ticker);
}

export function findWatchlistItem(ticker: string): WatchlistItem | undefined {
  return watchlist.find((w) => w.ticker === ticker);
}
