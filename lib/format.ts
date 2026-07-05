export function formatEUR(value: number, maximumFractionDigits = 0): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits,
  }).format(value);
}

export function formatEURPrecise(value: number): string {
  return formatEUR(value, 2);
}

export function formatPct(value: number, signed = false): string {
  const formatted = Math.abs(value).toLocaleString("de-DE", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
  if (!signed) return `${formatted} %`;
  const sign = value > 0 ? "+" : value < 0 ? "−" : "±";
  return `${sign}${formatted} %`;
}
