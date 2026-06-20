interface DotGridProps {
  data: number[][];
  color: string;
  highlightColor: string;
}

export function DotGrid({ data, color, highlightColor }: DotGridProps) {
  const maxVal = Math.max(...data.flat(), 1);

  return (
    <div className="flex flex-col gap-[5px]">
      {data.map((row, ri) => (
        <div key={ri} className="flex gap-[5px]">
          {row.map((val, ci) => {
            const intensity = maxVal > 0 ? val / maxVal : 0;
            const isHigh = intensity > 0.6;
            return (
              <div
                key={ci}
                className="w-[10px] h-[10px] rounded-full transition-opacity duration-200"
                style={{
                  backgroundColor: isHigh ? highlightColor : color,
                  opacity: Math.max(0.15, intensity),
                }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default DotGrid;
