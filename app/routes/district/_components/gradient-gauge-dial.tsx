export interface GradientGaugeDialProps {
  value?: number; // 0–100
  studentCount?: string;
}

interface ColorStop {
  p: number;
  r: number;
  g: number;
  b: number;
}

function interpolateColor(t: number): string {
  const stops: ColorStop[] = [
    { p: 0, r: 34, g: 197, b: 94 },
    { p: 0.33, r: 234, g: 179, b: 8 },
    { p: 0.66, r: 249, g: 115, b: 22 },
    { p: 1, r: 239, g: 68, b: 68 },
  ];
  let i = 0;
  while (i < stops.length - 2 && t > (stops[i + 1]?.p ?? 1)) i++;
  const a = stops[i];
  const b = stops[i + 1];
  if (!a || !b) return "rgb(34,197,94)";
  const f = (t - a.p) / (b.p - a.p);
  return `rgb(${Math.round(a.r + (b.r - a.r) * f)},${Math.round(
    a.g + (b.g - a.g) * f,
  )},${Math.round(a.b + (b.b - a.b) * f)})`;
}

export function GradientGaugeDial({
  value = 21,
  studentCount = "22,000+",
}: GradientGaugeDialProps) {
  const numBars = 40;
  const cx = 200;
  const cy = 200;
  const r = 160;
  const barWidth = 5;
  const barHeight = 22;
  const activeIndex = Math.round((value / 100) * (numBars - 1));

  const bars = Array.from({ length: numBars }, (_, i) => {
    const t = i / (numBars - 1);
    const angle = Math.PI - t * Math.PI;
    const color = interpolateColor(t);
    const lit = i <= activeIndex;
    const bx = cx + r * Math.cos(angle);
    const by = cy - r * Math.sin(angle);
    const rotation = -(angle * 180) / Math.PI + 90;
    return { bx, by, rotation, color, lit };
  });

  return (
    <div className="w-full">
      <svg
        viewBox="0 0 400 220"
        className="w-full block"
        preserveAspectRatio="xMidYMax meet"
      >
        <defs>
          <filter id="bar-glow">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {bars.map((b, i) => (
          <rect
            key={i}
            x={b.bx - barWidth / 2}
            y={b.by - barHeight / 2}
            width={barWidth}
            height={barHeight}
            rx={barWidth / 2}
            fill={b.color}
            opacity={b.lit ? 1 : 0.12}
            filter={b.lit ? "url(#bar-glow)" : undefined}
            transform={`rotate(${b.rotation}, ${b.bx}, ${b.by})`}
          />
        ))}

        {/* Center text — positioned in the visible upper half of the dial */}
        <text
          x={cx}
          y={cy - 70}
          textAnchor="middle"
          fill="white"
          fontSize="40"
          fontWeight="400"
          fontFamily="'Instrument Serif', Georgia, serif"
        >
          {studentCount}
        </text>
        <text
          x={cx}
          y={cy - 45}
          textAnchor="middle"
          fill="rgba(255,255,255,0.45)"
          fontSize="14"
          fontFamily="'Instrument Serif', Georgia, serif"
        >
          Students
        </text>
      </svg>
    </div>
  );
}

export default GradientGaugeDial;
