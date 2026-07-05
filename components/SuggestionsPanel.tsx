import type { Suggestion } from "@/types/portfolio";

const ACCENT: Record<Suggestion["type"], string> = {
  overweight: "border-emerald-400 text-emerald-400",
  underweight: "border-sky-400 text-sky-400",
  "sector-concentration": "border-emerald-400 text-emerald-400",
  "big-mover": "border-red-400 text-red-400",
};

export function SuggestionsPanel({ suggestions }: { suggestions: Suggestion[] }) {
  if (suggestions.length === 0) return null;

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
      <h2 className="mb-3 text-sm font-medium text-neutral-200">Vorschläge</h2>
      <ul className="space-y-4">
        {suggestions.map((s, i) => (
          <li key={i} className={`border-l-2 pl-3 ${ACCENT[s.type]}`}>
            <div className="text-sm font-medium">{s.title}</div>
            <p className="mt-0.5 text-sm text-neutral-400">{s.text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
