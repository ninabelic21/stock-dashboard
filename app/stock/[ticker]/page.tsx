import { notFound } from "next/navigation";
import { StockDetailView } from "@/components/StockDetailView";
import {
  findPosition,
  findWatchlistItem,
  positions as staticPositions,
} from "@/lib/portfolio-data";
import { getEnrichedPositions, getEnrichedWatchlist, computeTotalValue } from "@/lib/portfolio-calcs";
import { computeSuggestions } from "@/lib/suggestions";
import { getNewsFor } from "@/lib/news-data";

export default async function StockPage({
  params,
}: {
  params: Promise<{ ticker: string }>;
}) {
  const { ticker } = await params;
  const news = getNewsFor(ticker);

  const staticPosition = findPosition(ticker);
  if (staticPosition) {
    const positions = await getEnrichedPositions(staticPositions);
    const enriched = positions.find((p) => p.ticker === ticker)!;
    const totalValue = computeTotalValue(positions);
    const suggestions = computeSuggestions(positions, totalValue).filter((s) =>
      s.tickers.includes(ticker),
    );

    return (
      <StockDetailView
        ticker={enriched.ticker}
        name={enriched.name}
        sector={enriched.sector}
        priceEUR={enriched.priceEUR}
        dayChangePct={enriched.dayChangePct}
        live={enriched.live}
        position={enriched}
        news={news}
        suggestions={suggestions}
      />
    );
  }

  const watchlistItem = findWatchlistItem(ticker);
  if (watchlistItem) {
    const [enriched] = await getEnrichedWatchlist([watchlistItem]);
    return (
      <StockDetailView
        ticker={enriched.ticker}
        name={enriched.name}
        sector="Watchlist"
        priceEUR={enriched.priceEUR}
        dayChangePct={enriched.dayChangePct}
        live={enriched.live}
        news={news}
        suggestions={[]}
      />
    );
  }

  notFound();
}
