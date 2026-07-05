// Synthetic chart series — v1 keeps historical charts generated rather than
// real time-series data (real history needs a separate paid/rate-limited
// endpoint on most providers). Deterministic per ticker so it doesn't jump
// around between renders.

function hashSeed(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h << 5) - h + input.charCodeAt(i);
    h |= 0;
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface ChartPoint {
  index: number;
  label: string;
  value: number;
}

const MONTH_LABELS = ["7. Juni", "14. Juni", "21. Juni", "28. Juni", "5. Juli"];

export function generateSparkline(ticker: string, points = 24): ChartPoint[] {
  const rand = mulberry32(hashSeed(ticker));
  let value = 100;
  const series: number[] = [];
  for (let i = 0; i < points; i++) {
    value += (rand() - 0.45) * 4;
    series.push(value);
  }

  // Only label a handful of evenly-spaced points — one entry per data point
  // would render a duplicate tick per label and clutter the axis. Insetting
  // from (0.5/labelCount) keeps labels off the exact axis edges, where
  // Recharts tends to clip/drop the tick.
  const labelCount = MONTH_LABELS.length;
  const labelIndices = new Map<number, string>();
  for (let b = 0; b < labelCount; b++) {
    const idx = Math.round(((b + 0.5) / labelCount) * (points - 1));
    labelIndices.set(idx, MONTH_LABELS[b]);
  }

  return series.map((v, i) => ({
    index: i,
    label: labelIndices.get(i) ?? "",
    value: v,
  }));
}
