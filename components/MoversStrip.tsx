import Link from "next/link";
import { formatPct } from "@/lib/format";
import type { EnrichedPosition } from "@/types/portfolio";

export function MoversStrip({ positions }: { positions: EnrichedPosition[] }) {
  const withChange = positions.filter((p) => p.live && p.dayChangePct !== null);
  const sorted = [...withChange].sort((a, b) => b.dayChangePct! - a.dayChangePct!);

  const top = sorted.slice(0, 2);
  const flop = sorted.slice(-2).reverse();

  const movers = [
    ...top.map((p) => ({ p, label: "TOP" as const })),
    ...flop.map((p) => ({ p, label: "FLOP" as const })),
  ];

  if (movers.length === 0) return null;

  return (
    <div className="mt-6 grid grid-cols-2 gap-3 px-6 sm:grid-cols-4">
      {movers.map(({ p, label }) => (
        <Link
          key={`${label}-${p.ticker}`}
          href={`/stock/${p.ticker}`}
          className="rounded-xl border border-neutral-800 bg-neutral-900 p-4 transition hover:border-neutral-700"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-neutral-200">{p.ticker}</span>
            <span
              className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                label === "TOP"
                  ? "bg-emerald-400/15 text-emerald-400"
                  : "bg-orange-400/15 text-orange-400"
              }`}
            >
              {label}
            </span>
          </div>
          <div
            className={`mt-1 text-lg font-semibold ${
              p.dayChangePct! >= 0 ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {formatPct(p.dayChangePct!, true)}
          </div>
          <div className="text-xs text-neutral-500">{p.name}</div>
        </Link>
      ))}
    </div>
  );
}
