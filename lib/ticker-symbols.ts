export interface TickerSymbolInfo {
  finnhubSymbol: string;
  currency: "USD" | "EUR" | "DKK";
  // Non-US exchanges are often unreliable/unavailable on Finnhub's free tier.
  // Flagging this lets the UI show a clean fallback instead of treating it
  // as a bug when the quote comes back empty.
  knownUnreliable?: boolean;
}

export const tickerSymbols: Record<string, TickerSymbolInfo> = {
  // Portfolio positions
  IWDA: { finnhubSymbol: "IWDA.AS", currency: "EUR", knownUnreliable: true },
  VUSA: { finnhubSymbol: "VUSA.AS", currency: "EUR", knownUnreliable: true },
  NVDA: { finnhubSymbol: "NVDA", currency: "USD" },
  MSFT: { finnhubSymbol: "MSFT", currency: "USD" },
  LLY: { finnhubSymbol: "LLY", currency: "USD" },
  WMT: { finnhubSymbol: "WMT", currency: "USD" },
  BSX: { finnhubSymbol: "BSX", currency: "USD" },
  MPWR: { finnhubSymbol: "MPWR", currency: "USD" },

  // Watchlist-only tickers
  ASML: { finnhubSymbol: "ASML.AS", currency: "EUR", knownUnreliable: true },
  NOVO: { finnhubSymbol: "NOVO-B.CO", currency: "DKK", knownUnreliable: true },
  "BRK.B": { finnhubSymbol: "BRK.B", currency: "USD" },
  ADBE: { finnhubSymbol: "ADBE", currency: "USD" },
  AIR: { finnhubSymbol: "AIR.PA", currency: "EUR", knownUnreliable: true },
};

export function getSymbolInfo(ticker: string): TickerSymbolInfo | undefined {
  return tickerSymbols[ticker];
}
