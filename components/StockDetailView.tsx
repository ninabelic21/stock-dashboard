import Link from "next/link";
import { NewsList } from "@/components/NewsList";
import { SuggestionsPanel } from "@/components/SuggestionsPanel";
import { generateSparkline } from "@/lib/chart-data";
import { Sparkline } from "@/components/Sparkline";
import { formatEUR, formatEURPrecise, formatPct } from "@/lib/format";
import type { EnrichedPosition, NewsItem, Suggestion } from "@/types/portfolio";

export function StockDetailView({
  ticker,
  name,
  sector,
  priceEUR,
  dayChangePct,
  live,
  position,
  news,
  suggestions,
}: {
  ticker: string;
  name: string;
  sector: string;
  priceEUR: number | null;
  dayChangePct: number | null;
  live: boolean;
  position?: EnrichedPosition;
  news: NewsItem[];
  suggestions: Suggestion[];
}) {
  const chartData = generateSparkline(ticker);

  return (
    <div className="mx-auto max-w-4xl px-6 py-6">
      <Link href="/" className="mb-6 inline-block text-sm text-neutral-400 hover:text-neutral-200">
        ← Zurück zum Portfolio
      </Link>

      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-neutral-900 text-sm font-semibold text-emerald-400">
          {ticker}
        </div>
        <div>
          <h1 className="text-xl font-semibold text-neutral-50">{name}</h1>
          <p className="text-sm text-neutral-500">{sector}</p>
        </div>
      </div>

      <div className="mt-6 flex items-baseline gap-3">
        <span className="text-3xl font-semibold text-neutral-50">
          {priceEUR !== null ? formatEURPrecise(priceEUR) : "—"}
        </span>
        {dayChangePct !== null && (
          <span className={dayChangePct >= 0 ? "text-emerald-400" : "text-red-400"}>
            {formatPct(dayChangePct, true)}
          </span>
        )}
        <span className="text-sm text-neutral-500">heute</span>
        {!live && (
          <span className="rounded-full bg-amber-400/15 px-2 py-0.5 text-xs text-amber-500">
            Live-Daten nicht verfügbar
          </span>
        )}
      </div>

      <div className="mt-6">
        <Sparkline data={chartData} />
      </div>

      {position && (
        <div className="mt-6 grid grid-cols-2 gap-y-4 border-t border-neutral-800 pt-6 sm:grid-cols-5">
          <Stat label="WERT" value={formatEUR(position.valueEUR)} />
          <Stat label="STÜCK" value={String(position.shares)} />
          <Stat label="EINSTAND" value={formatEUR(position.costEUR)} />
          <Stat
            label="G/V GESAMT"
            value={`${position.gainLossEUR >= 0 ? "+" : ""}${formatEUR(position.gainLossEUR)}`}
            valueClass={position.gainLossEUR >= 0 ? "text-emerald-400" : "text-red-400"}
          />
          <Stat
            label="ANTEIL / ZIEL"
            value={`${formatPct(position.allocationPct)} / ${position.targetPct} %`}
          />
        </div>
      )}

      <div className="mt-8 border-t border-neutral-800 pt-6">
        <NewsList items={news} />
      </div>

      {suggestions.length > 0 && (
        <div className="mt-6">
          <SuggestionsPanel suggestions={suggestions} />
        </div>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  valueClass,
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div>
      <div className="text-xs font-medium tracking-wide text-neutral-500">{label}</div>
      <div className={`mt-1 text-base font-semibold text-neutral-100 ${valueClass ?? ""}`}>
        {value}
      </div>
    </div>
  );
}
