import Link from "next/link";
import { formatEUR, formatPct } from "@/lib/format";
import type { EnrichedPosition } from "@/types/portfolio";

export function PositionsTable({ positions }: { positions: EnrichedPosition[] }) {
  const sorted = [...positions].sort((a, b) => b.allocationPct - a.allocationPct);

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900">
      <div className="flex items-center justify-between border-b border-neutral-800 px-4 py-3">
        <h2 className="text-sm font-medium text-neutral-200">Positionen</h2>
      </div>

      <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-4 py-2 text-xs font-medium tracking-wide text-neutral-500">
        <span>POSITION</span>
        <span className="text-right">WERT</span>
        <span className="text-right">HEUTE</span>
        <span className="text-right">ANTEIL</span>
      </div>

      <div className="divide-y divide-neutral-800">
        {sorted.map((p) => (
          <Link
            key={p.ticker}
            href={`/stock/${p.ticker}`}
            className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 px-4 py-3 transition hover:bg-neutral-800/50"
          >
            <div className="min-w-0">
              <div className="truncate text-sm font-medium text-neutral-100">{p.name}</div>
              <div className="text-xs text-neutral-500">{p.sector}</div>
              {!p.live && (
                <div className="text-xs text-amber-500">Live-Daten nicht verfügbar</div>
              )}
            </div>
            <div className="text-right text-sm text-neutral-100">{formatEUR(p.valueEUR)}</div>
            <div
              className={`text-right text-sm ${
                p.dayChangePct === null
                  ? "text-neutral-600"
                  : p.dayChangePct >= 0
                    ? "text-emerald-400"
                    : "text-red-400"
              }`}
            >
              {p.dayChangePct === null ? "—" : formatPct(p.dayChangePct, true)}
            </div>
            <div className="flex w-28 items-center justify-end gap-2">
              <div className="h-1.5 w-14 overflow-hidden rounded-full bg-neutral-800">
                <div
                  className="h-full rounded-full bg-emerald-400"
                  style={{ width: `${Math.min(100, p.allocationPct)}%` }}
                />
              </div>
              <span className="text-sm text-neutral-300">{formatPct(p.allocationPct)}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
