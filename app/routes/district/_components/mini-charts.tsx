export function BarChartMini({
  data,
  color,
}: {
  data: number[];
  color: string;
}) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-[3px] w-full h-8">
      {data.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-[12px]"
          style={{
            height: max > 0 ? `${(v / max) * 100}%` : "0%",
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
