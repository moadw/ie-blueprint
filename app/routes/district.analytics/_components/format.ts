export function formatCompactTotal(value: number): string {
  if (value >= 10000) {
    const k = value / 1000;
    return `${Number.isInteger(k) ? k.toFixed(0) : k.toFixed(1).replace(/\.0$/, "")}k`;
  }
  return value.toLocaleString();
}

export function formatDelta(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toLocaleString()}`;
}
