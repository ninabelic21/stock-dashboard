import Link from "next/link";
import { TopBar } from "@/components/TopBar";
import { watchlist } from "@/lib/portfolio-data";
import { getEnrichedWatchlist } from "@/lib/portfolio-calcs";
import { formatEURPrecise, formatPct } from "@/lib/format";

export default async function WatchlistPage() {
  const items = await getEnrichedWatchlist(watchlist);

  return (
    <div>
      <TopBar active="watchlist" />
      <div className="mx-auto max-w-2xl px-6 py-6">
        <h1 className="mb-4 text-sm font-medium text-neutral-200">Watchlist</h1>

        <div className="divide-y divide-neutral-800 rounded-xl border border-neutral-800 bg-neutral-900">
          {items.map((item) => (
            <Link
              key={item.ticker}
              href={`/stock/${item.ticker}`}
              className="flex items-center justify-between px-4 py-3 transition hover:bg-neutral-800/50"
            >
              <div>
                <div className="text-sm font-medium text-neutral-100">{item.ticker}</div>
                <div className="text-xs text-neutral-500">{item.name}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-neutral-100">
                  {item.priceEUR !== null ? formatEURPrecise(item.priceEUR) : "—"}
                </div>
                <div
                  className={`text-xs ${
                    item.dayChangePct === null
                      ? "text-neutral-600"
                      : item.dayChangePct >= 0
                        ? "text-emerald-400"
                        : "text-red-400"
                  }`}
                >
                  {item.dayChangePct === null ? "Live-Daten nicht verfügbar" : formatPct(item.dayChangePct, true)}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
