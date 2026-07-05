"use client";

import { useMemo, useState } from "react";
import { Sparkline } from "@/components/Sparkline";
import { generateSparkline } from "@/lib/chart-data";
import { formatEUR, formatPct } from "@/lib/format";

const RANGES = ["1T", "1W", "1M", "3M", "1J", "Max"] as const;
const RANGE_POINTS: Record<(typeof RANGES)[number], number> = {
  "1T": 8,
  "1W": 14,
  "1M": 24,
  "3M": 30,
  "1J": 36,
  Max: 48,
};

export function TotalValueHeader({
  totalValue,
  dayChangeEUR,
  dayChangePct,
  monthChangePct,
}: {
  totalValue: number;
  dayChangeEUR: number;
  dayChangePct: number;
  monthChangePct: number;
}) {
  const [range, setRange] = useState<(typeof RANGES)[number]>("1M");
  const data = useMemo(
    () => generateSparkline(`portfolio-${range}`, RANGE_POINTS[range]),
    [range],
  );

  const isUp = dayChangePct >= 0;

  return (
    <section className="px-6 pt-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-medium tracking-wide text-neutral-500">
            GESAMTWERT · EUR
          </div>
          <div className="mt-1 flex items-baseline gap-3">
            <span className="text-4xl font-semibold text-neutral-50">
              {formatEUR(totalValue)}
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-sm font-medium ${
                isUp ? "bg-emerald-400/15 text-emerald-400" : "bg-red-400/15 text-red-400"
              }`}
            >
              {isUp ? "↗" : "↘"} {formatPct(Math.abs(dayChangePct))}
            </span>
          </div>
          <div className="mt-1 text-sm text-neutral-400">
            <span className={isUp ? "text-emerald-400" : "text-red-400"}>
              {formatEUR(dayChangeEUR, 0)} heute
            </span>{" "}
            · 1 Monat {formatPct(monthChangePct, true)}
          </div>
        </div>

        <div className="flex gap-1 rounded-full bg-neutral-900 p-1">
          {RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                range === r
                  ? "bg-emerald-400 text-neutral-900"
                  : "text-neutral-400 hover:text-neutral-100"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <Sparkline data={data} />
      </div>
    </section>
  );
}
