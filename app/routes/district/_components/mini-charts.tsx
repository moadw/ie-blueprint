export function BarChartMini({
  data,
  color,
  max: maxProp,
}: {
  data: number[];
  color: string;
  /**
   * Absolute ceiling for bar heights. Omit to scale relative to the series max
   * (sparkline "shape" mode). Pass a fixed ceiling (e.g. `1` for a 0–1 ratio)
   * so magnitude is honest — a low week reads as low bars, not inflated to full
   * height by relative scaling.
   */
  max?: number;
}) {
  const hasData = data.some((v) => v > 0);
  const max = maxProp ?? Math.max(...data, 0);
  // Nothing positive to plot (empty, errored, or a genuine all-zero week) →
  // a flat baseline, so the state reads as "zero" rather than a blank/broken
  // chart or a misleading bar.
  if (!hasData || max <= 0) {
    return (
      <div className="flex items-end w-full h-8">
        <div className="w-full h-0.5 rounded-full bg-muted" />
      </div>
    );
  }
  return (
    <div className="flex items-end gap-[3px] w-full h-8">
      {data.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-[12px]"
          style={{
            height: `${Math.min(100, (v / max) * 100)}%`,
            background: color,
          }}
        />
      ))}
    </div>
  );
}

export function ComparisonBar({
  average,
  yours,
  color,
}: {
  average: number;
  yours: number;
  color: string;
}) {
  const max = Math.max(average, yours);
  return (
    <div className="w-full space-y-1.5">
      <div>
        <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
          <span>Average</span>
          <span>{average}</span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-muted-foreground/30"
            style={{ width: max > 0 ? `${(average / max) * 100}%` : "0%" }}
          />
        </div>
      </div>
      <div>
        <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
          <span>Your Result</span>
          <span>{yours}</span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: max > 0 ? `${(yours / max) * 100}%` : "0%",
              background: color,
            }}
          />
        </div>
      </div>
    </div>
  );
}
