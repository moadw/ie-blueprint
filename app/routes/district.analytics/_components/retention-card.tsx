import { MoreHorizontal } from "lucide-react";
import type { AnalyticsDashboardData } from "~/lib/district-analytics.server";

interface RetentionCardProps {
  retention: AnalyticsDashboardData["retention"];
}

const VIEW_W = 300;
const VIEW_H = 140;
const PAD_LEFT = 28;
const PAD_RIGHT = 8;
const PAD_TOP = 8;
const PAD_BOTTOM = 22;
const CHART_W = VIEW_W - PAD_LEFT - PAD_RIGHT;
const CHART_H = VIEW_H - PAD_TOP - PAD_BOTTOM;

function niceYMax(maxRate: number): number {
  const minMax = 50;
  const target = Math.max(minMax, maxRate * 1.2);
  return Math.ceil(target / 10) * 10;
}

export function RetentionCard({ retention }: RetentionCardProps) {
  const { peakPct, series } = retention;
  const yMax = niceYMax(peakPct);
  const count = Math.max(series.length, 1);

  const xFor = (i: number) => PAD_LEFT + (i / (count - 1)) * CHART_W;
  const yFor = (rate: number) => PAD_TOP + CHART_H - (rate / yMax) * CHART_H;

  const pathD = series
    .map((point, i) => {
      const x = xFor(i);
      const y = yFor(point.rate);
      if (i === 0) return `M ${x} ${y}`;
      const prevX = xFor(i - 1);
      const prevY = yFor(series[i - 1]?.rate ?? 0);
      return `L ${prevX} ${prevY} L ${x} ${prevY} L ${x} ${y}`;
    })
    .join(" ");

  const yTicks = [0, yMax / 2, yMax];

  return (
    <div className="bg-white rounded-[24px] border border-border shadow-xs p-5 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-serif text-xl text-foreground">Retention</h3>
        <button
          type="button"
          className="text-muted-foreground/40 hover:text-muted-foreground transition-colors"
          aria-label="More options"
        >
          <MoreHorizontal size={18} />
        </button>
      </div>

      {/* Badge */}
      <div className="mb-2">
        <span className="inline-flex items-center rounded-full border border-border bg-white px-3 py-1 text-xs font-medium text-muted-foreground">
          Peak: {peakPct}%
        </span>
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-0">
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid meet"
          className="overflow-visible"
        >
          <defs>
            <linearGradient id="retentionLineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.85} />
              <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={1} />
            </linearGradient>
          </defs>

          {/* Horizontal grid lines */}
          {yTicks.map((t) => (
            <line
              key={t}
              x1={PAD_LEFT}
              x2={VIEW_W - PAD_RIGHT}
              y1={yFor(t)}
              y2={yFor(t)}
              stroke="var(--color-border)"
              strokeDasharray="3 3"
              strokeWidth={1}
            />
          ))}

          {/* Step-after line */}
          <path
            d={pathD}
            fill="none"
            stroke="url(#retentionLineGrad)"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* X-axis labels */}
          {series.map((point, i) => (
            <text
              key={point.label}
              x={xFor(i)}
              y={VIEW_H - 6}
              textAnchor="middle"
              fontSize={10}
              fill="var(--color-muted-foreground)"
              fontFamily="var(--font-sans)"
            >
              {point.label}
            </text>
          ))}

          {/* Y-axis labels */}
          {yTicks.map((t) => (
            <text
              key={t}
              x={PAD_LEFT - 6}
              y={yFor(t) + 3}
              textAnchor="end"
              fontSize={9}
              fill="var(--color-muted-foreground)"
              fontFamily="var(--font-sans)"
            >
              {t}%
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
}

export default RetentionCard;
