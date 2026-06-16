interface SegmentedBarProps {
  value: number;
  max: number;
  color: string;
}

export function SegmentedBar({ value, max, color }: SegmentedBarProps) {
  const totalSegments = 40;
  const filledSegments = max > 0 ? Math.round((value / max) * totalSegments) : 0;

  return (
    <div className="flex gap-[2px] h-[6px] w-full">
      {Array.from({ length: totalSegments }).map((_, i) => {
        const filled = i < filledSegments;
        return (
          <div
            key={i}
            className="flex-1 rounded-[1px] transition-colors duration-200"
            style={{
              backgroundColor: filled ? color : "var(--color-muted)",
            }}
          />
        );
      })}
    </div>
  );
}

export default SegmentedBar;
