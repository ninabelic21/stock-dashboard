import type { NewsItem } from "@/types/portfolio";

export function NewsList({ items }: { items: NewsItem[] }) {
  return (
    <div>
      <h2 className="mb-3 text-sm font-medium text-neutral-200">Nachrichten</h2>
      {items.length === 0 ? (
        <p className="text-sm text-neutral-500">
          Noch keine Schlagzeilen — Cowork kann hier aktuelle Nachrichten zu dieser Position eintragen.
        </p>
      ) : (
        <div className="divide-y divide-neutral-800">
          {items.map((item, i) => (
            <div key={i} className="flex gap-4 py-3">
              <span className="w-14 shrink-0 text-xs text-neutral-500">{item.date}</span>
              <div>
                <div className="text-sm font-medium text-neutral-100">{item.title}</div>
                <div className="text-xs text-neutral-500">{item.source}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
