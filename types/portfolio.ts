export interface Position {
  ticker: string;
  name: string;
  sector: string;
  shares: number;
  costEUR: number;
  targetPct: number;
}

export interface WatchlistItem {
  ticker: string;
  name: string;
}

export interface NewsItem {
  date: string;
  source: string;
  title: string;
}

export type QuoteResult =
  | { ok: true; price: number; changePct: number; currency: string }
  | { ok: false; reason: string };

export interface EnrichedPosition extends Position {
  live: boolean;
  priceEUR: number;
  valueEUR: number;
  costPerShareEUR: number;
  gainLossEUR: number;
  dayChangePct: number | null;
  allocationPct: number;
}

export interface EnrichedWatchlistItem extends WatchlistItem {
  live: boolean;
  priceEUR: number | null;
  dayChangePct: number | null;
}

export type SuggestionType =
  | "overweight"
  | "underweight"
  | "sector-concentration"
  | "big-mover";

export interface Suggestion {
  type: SuggestionType;
  title: string;
  text: string;
  tickers: string[];
}
