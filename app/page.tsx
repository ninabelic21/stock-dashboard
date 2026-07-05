import { TopBar } from "@/components/TopBar";
import { TotalValueHeader } from "@/components/TotalValueHeader";
import { MoversStrip } from "@/components/MoversStrip";
import { PositionsTable } from "@/components/PositionsTable";
import { SectorAllocation } from "@/components/SectorAllocation";
import { SuggestionsPanel } from "@/components/SuggestionsPanel";
import { positions as staticPositions } from "@/lib/portfolio-data";
import {
  computeDayChangeEUR,
  computeSectorAllocation,
  computeTotalValue,
  getEnrichedPositions,
} from "@/lib/portfolio-calcs";
import { computeSuggestions } from "@/lib/suggestions";
import { generateSparkline } from "@/lib/chart-data";

export default async function DashboardPage() {
  const positions = await getEnrichedPositions(staticPositions);

  const totalValue = computeTotalValue(positions);
  const dayChangeEUR = computeDayChangeEUR(positions);
  const dayChangePct = totalValue > 0 ? (dayChangeEUR / (totalValue - dayChangeEUR)) * 100 : 0;

  const monthSeries = generateSparkline("portfolio-1M", 24);
  const monthChangePct =
    ((monthSeries.at(-1)!.value - monthSeries[0].value) / monthSeries[0].value) * 100;

  const sectors = computeSectorAllocation(positions);
  const suggestions = computeSuggestions(positions, totalValue);

  return (
    <div>
      <TopBar active="portfolio" />
      <TotalValueHeader
        totalValue={totalValue}
        dayChangeEUR={dayChangeEUR}
        dayChangePct={dayChangePct}
        monthChangePct={monthChangePct}
      />
      <MoversStrip positions={positions} />

      <div className="mt-6 grid grid-cols-1 gap-6 px-6 pb-10 lg:grid-cols-[1fr_320px]">
        <PositionsTable positions={positions} />
        <div className="space-y-6">
          <SectorAllocation sectors={sectors} />
          <SuggestionsPanel suggestions={suggestions} />
        </div>
      </div>
    </div>
  );
}
