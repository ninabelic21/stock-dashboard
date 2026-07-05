import { formatPct } from "@/lib/format";

const COLORS = ["bg-emerald-400", "bg-violet-400", "bg-sky-400", "bg-orange-400", "bg-rose-400", "bg-yellow-400"];

export function SectorAllocation({
  sectors,
}: {
  sectors: { sector: string; pct: number }[];
}) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
      <h2 className="mb-3 text-sm font-medium text-neutral-200">Aufteilung</h2>

      <div className="mb-4 flex h-2 overflow-hidden rounded-full">
        {sectors.map((s, i) => (
          <div
            key={s.sector}
            className={COLORS[i % COLORS.length]}
            style={{ width: `${s.pct}%` }}
          />
        ))}
      </div>

      <div className="space-y-2">
        {sectors.map((s, i) => (
          <div key={s.sector} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${COLORS[i % COLORS.length]}`} />
              <span className="text-neutral-300">{s.sector}</span>
            </div>
            <span className="text-neutral-400">{formatPct(s.pct)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
