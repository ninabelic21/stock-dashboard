import type { NewsItem } from "@/types/portfolio";

// Static, manually-curated per-ticker headlines — matches the original
// dashboard's design (news is edited by hand / by prompt, not live-fetched).
export const newsData: Record<string, NewsItem[]> = {
  NVDA: [
    { date: "02.07.", source: "Beispiel-Quelle", title: "Nvidia stellt neue Chip-Generation für Rechenzentren vor" },
    { date: "30.06.", source: "Beispiel-Quelle", title: "Analysten heben Kursziele nach starkem Quartal an" },
  ],
  MSFT: [
    { date: "29.06.", source: "Beispiel-Quelle", title: "Microsoft erweitert KI-Angebot für Unternehmenskunden" },
  ],
  LLY: [
    { date: "01.07.", source: "Beispiel-Quelle", title: "Eli Lilly meldet Studiendaten zu neuem Medikament" },
  ],
  MPWR: [
    { date: "03.07.", source: "Beispiel-Quelle", title: "Monolithic Power fällt nach vorsichtigem Ausblick" },
  ],
};

export function getNewsFor(ticker: string): NewsItem[] {
  return newsData[ticker] ?? [];
}
