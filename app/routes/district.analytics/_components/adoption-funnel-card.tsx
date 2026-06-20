import { useMemo, useRef, useState } from "react";
import { MoreHorizontal } from "lucide-react";
import type { AnalyticsDashboardData } from "~/lib/district-analytics.server";

interface AdoptionFunnelCardProps {
  adoptionFunnel: AnalyticsDashboardData["adoptionFunnel"];
}

const VIEW_W = 600;
const VIEW_H = 260;
const CHART_LEFT = 48;
const CHART_RIGHT = 20;
const CHART_TOP = 16;
const CHART_BOTTOM = 12;
const CHART_W = VIEW_W - CHART_LEFT - CHART_RIGHT;
const CHART_H = VIEW_H - CHART_TOP - CHART_BOTTOM;
const BAR_GAP = 6;

function niceTicks(maxValue: number): { max: number; ticks: number[] } {
  if (maxValue <= 0) {
    return { max: 1, ticks: [0, 1] };
  }

  // Choose the smallest "nice" step (family 1/2/2.5/5 × 10^n) such that
  // step * 5 covers maxValue. Prototype uses 0..2500 with step 500 for ~2400.
  const fractions = [1, 2, 2.5, 5];
  const floorExp = Math.floor(Math.log10(maxValue));
  const exponents = [floorExp - 1, floorExp, floorExp + 1];

  let step = Infinity;
  for (const exp of exponents) {
    const base = Math.pow(10, exp);
    for (const f of fractions) {
      const candidate = f * base;
      if (candidate * 5 >= maxValue && candidate < step) {
        step = candidate;
      }
    }
  }

  if (!isFinite(step) || step <= 0) {
    step = 1;
  }

  const max = step * 5;
  const ticks: number[] = [];
  for (let i = 0; i <= 5; i++) {
    ticks.push(Number((step * i).toFixed(10)));
  }

  return { max, ticks };
}

function formatTick(t: number): string {
  if (t >= 1000) {
    const k = t / 1000;
    return `${Number.isInteger(k) ? k.toFixed(0) : k.toFixed(1)}k`;
  }
  return t.toLocaleString();
}

export function AdoptionFunnelCard({ adoptionFunnel }: AdoptionFunnelCardProps) {
  const [selected, setSelected] = useState(Math.min(2, adoptionFunnel.length - 1));
  const [hover, setHover] = useState<number | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeIdx = hover ?? selected;

  const { maxValue, ticks, barWidth, opacities } = useMemo(() => {
    const values = adoptionFunnel.map((s) => s.value);
    const rawMax = Math.max(...values, 1);
    const { max, ticks } = niceTicks(rawMax);
    const barWidth = (CHART_W - BAR_GAP * (adoptionFunnel.length - 1)) / adoptionFunnel.length;
    const opacities = adoptionFunnel.map((_, i) => {
      if (adoptionFunnel.length <= 1) return 0.85;
      return 0.85 - (i / (adoptionFunnel.length - 1)) * (0.85 - 0.22);
    });
    return { maxValue: max, ticks, barWidth, opacities };
  }, [adoptionFunnel]);

  const conversion = (i: number) => {
    if (i === 0) return 100;
    const current = adoptionFunnel[i]?.value ?? 0;
    const previous = adoptionFunnel[i - 1]?.value ?? 0;
    return previous > 0 ? Math.round((current / previous) * 100) : 0;
  };
  const dropoff = (i: number) => {
    if (i === 0) return 0;
    const current = adoptionFunnel[i]?.value ?? 0;
    const previous = adoptionFunnel[i - 1]?.value ?? 0;
    return previous > 0 ? -Math.round(((previous - current) / previous) * 100) : 0;
  };

  function yPos(v: number) {
    return CHART_TOP + CHART_H - (v / maxValue) * CHART_H;
  }

  function barX(i: number) {
    return CHART_LEFT + i * (barWidth + BAR_GAP);
  }

  const washPoints = adoptionFunnel
    .map((s, i) => {
      const x = barX(i);
      const top = yPos(s.value);
      return `${x},${top} ${x + barWidth},${top}`;
    })
    .join(" ");
  const washPolygon = `${barX(0)},${yPos(0)} ${washPoints} ${barX(adoptionFunnel.length - 1) + barWidth},${yPos(0)}`;

  const handleMouseMove = (e: React.MouseEvent<SVGGElement>, i: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setTooltip({ x: e.clientX - rect.left, y: e.clientY - rect.top - 52 });
    setHover(i);
  };

  return (
    <div className="bg-white rounded-[24px] border border-border shadow-xs p-6 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-xl text-foreground">User Adoption</h3>
        <button
          type="button"
          className="text-muted-foreground/40 hover:text-muted-foreground transition-colors"
          aria-label="More options"
        >
          <MoreHorizontal size={18} />
        </button>
      </div>

      {/* Stage tabs */}
      <div className="flex mb-5">
        {adoptionFunnel.map((stage, i) => (
          <button
            key={stage.key}
            type="button"
            onClick={() => setSelected(i)}
            className={`flex-1 flex flex-col items-start px-3 py-2 transition-colors ${
              i > 0 ? "border-l border-border/40" : ""
            }`}
          >
            <span
              className={`text-[11px] leading-tight ${
                selected === i ? "text-foreground font-semibold" : "text-muted-foreground/50"
              }`}
            >
              {stage.label}
            </span>
            <span
              className={`text-sm tabular-nums leading-snug ${
                selected === i
                  ? "text-foreground font-bold"
                  : "text-muted-foreground/50 font-medium"
              }`}
            >
              {stage.value.toLocaleString()}
            </span>
          </button>
        ))}
      </div>

      {/* Chart */}
      <div ref={containerRef} className="relative flex-1 min-h-0">
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid meet"
          className="overflow-visible"
        >
          <defs>
            {/* Diagonal hatching */}
            <pattern
              id="hatch"
              width="5"
              height="5"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)"
            >
              <line x1="0" y1="0" x2="0" y2="5" stroke="hsl(145, 63%, 42%)" strokeWidth="1.8" />
            </pattern>

            {/* Selected bar gradient */}
            <linearGradient id="selectedGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="hsl(145, 70%, 28%)" />
              <stop offset="30%" stopColor="hsl(145, 65%, 38%)" />
              <stop offset="55%" stopColor="hsl(145, 58%, 46%)" />
              <stop offset="100%" stopColor="hsl(145, 50%, 55%)" />
            </linearGradient>

            {/* Glossy top highlight */}
            <linearGradient id="glossTop" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="white" stopOpacity={0.45} />
              <stop offset="100%" stopColor="white" stopOpacity={0} />
            </linearGradient>

            {/* Background wash */}
            <linearGradient id="washGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(145, 63%, 45%)" stopOpacity={0.08} />
              <stop offset="100%" stopColor="hsl(145, 63%, 45%)" stopOpacity={0.01} />
            </linearGradient>

            {/* Glow filter for selected bar */}
            <filter id="barGlow" x="-80%" y="-40%" width="260%" height="180%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="blur" />
              <feColorMatrix
                in="blur"
                type="matrix"
                values="0 0 0 0 0.22  0 0 0 0 0.55  0 0 0 0 0.30  0 0 0 0.4 0"
                result="glow"
              />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Ambient glow for wash area */}
            <filter id="washGlow" x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur stdDeviation="12" />
            </filter>

            {/* Column hover glow */}
            <radialGradient id="colGlow" cx="0.5" cy="0.45" r="0.55" fx="0.5" fy="0.4">
              <stop offset="0%" stopColor="hsl(145, 55%, 50%)" stopOpacity={0.12} />
              <stop offset="60%" stopColor="hsl(145, 50%, 55%)" stopOpacity={0.05} />
              <stop offset="100%" stopColor="hsl(145, 45%, 60%)" stopOpacity={0} />
            </radialGradient>
          </defs>

          {/* Grid lines */}
          {ticks.map((t) => (
            <line
              key={t}
              x1={CHART_LEFT}
              x2={VIEW_W - CHART_RIGHT}
              y1={yPos(t)}
              y2={yPos(t)}
              stroke="var(--color-border)"
              strokeWidth={1}
            />
          ))}

          {/* Y-axis labels */}
          {ticks
            .filter((t) => t > 0)
            .map((t) => (
              <text
                key={t}
                x={CHART_LEFT - 8}
                y={yPos(t) + 3.5}
                textAnchor="end"
                fontSize={10}
                fill="var(--color-muted-foreground)"
                fontFamily="var(--font-sans)"
              >
                {formatTick(t)}
              </text>
            ))}

          {/* Ambient wash glow behind bars */}
          <polygon
            points={washPolygon}
            fill="hsl(145, 63%, 45%)"
            opacity={0.06}
            filter="url(#washGlow)"
          />

          {/* Background wash polygon */}
          <polygon points={washPolygon} fill="url(#washGrad)" />

          {/* Bars */}
          {adoptionFunnel.map((stage, i) => {
            const x = barX(i);
            const top = yPos(stage.value);
            const bottom = yPos(0);
            const h = bottom - top;
            const isSelected = i === activeIdx;
            const isHovered = i === hover;
            const fullColumnTop = CHART_TOP;
            const fullColumnH = CHART_H;
            const opacity = opacities[i] ?? 0.5;

            return (
              <g
                key={stage.key}
                onMouseMove={(e) => handleMouseMove(e, i)}
                onMouseLeave={() => {
                  setHover(null);
                  setTooltip(null);
                }}
                style={{ cursor: "pointer" }}
              >
                {/* Full-column hover glow */}
                <rect
                  x={x - 8}
                  y={fullColumnTop - 16}
                  width={barWidth + 16}
                  height={fullColumnH + 22}
                  rx={10}
                  fill="url(#colGlow)"
                  opacity={isHovered ? 1 : 0}
                  style={{ transition: "opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)" }}
                />

                {/* Invisible hit area covering full column */}
                <rect
                  x={x}
                  y={fullColumnTop - 14}
                  width={barWidth}
                  height={fullColumnH + 18}
                  fill="transparent"
                />

                {isSelected ? (
                  <g filter="url(#barGlow)">
                    <rect x={x} y={top} width={barWidth} height={h} rx={3} fill="url(#selectedGrad)" />
                    <rect
                      x={x}
                      y={top}
                      width={barWidth}
                      height={Math.min(h * 0.35, 30)}
                      rx={3}
                      fill="url(#glossTop)"
                    />
                    <rect
                      x={x}
                      y={top + 2}
                      width={3}
                      height={h - 4}
                      fill="hsl(145, 70%, 24%)"
                      opacity={0.35}
                      rx={1}
                    />
                    <rect
                      x={x + barWidth - 2}
                      y={top + 2}
                      width={2}
                      height={h - 4}
                      fill="white"
                      opacity={0.12}
                      rx={1}
                    />
                  </g>
                ) : (
                  <>
                    <rect
                      x={x}
                      y={top}
                      width={barWidth}
                      height={h}
                      rx={3}
                      fill="hsl(145, 50%, 93%)"
                      opacity={opacity}
                    />
                    <rect
                      x={x}
                      y={top}
                      width={barWidth}
                      height={h}
                      rx={3}
                      fill="url(#hatch)"
                      opacity={opacity * 0.4}
                    />
                    <rect
                      x={x}
                      y={top}
                      width={barWidth}
                      height={Math.min(h * 0.2, 14)}
                      rx={3}
                      fill="white"
                      opacity={0.3 * opacity}
                    />
                  </>
                )}

                {/* Pill badge */}
                <rect
                  x={x + barWidth / 2 - 15}
                  y={top - 11}
                  width={30}
                  height={15}
                  rx={7.5}
                  fill={isSelected ? "hsl(145, 63%, 42%)" : "hsl(145, 45%, 78%)"}
                  opacity={isSelected ? 1 : opacity}
                />
                <text
                  x={x + barWidth / 2}
                  y={top - 1.5}
                  textAnchor="middle"
                  fontSize={7.5}
                  fontWeight={600}
                  fill="white"
                  fontFamily="var(--font-sans)"
                  opacity={isSelected ? 1 : Math.max(opacity, 0.55)}
                >
                  {stage.value >= 1000
                    ? `${(stage.value / 1000).toFixed(1).replace(/\.0$/, "")}k`
                    : stage.value}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Tooltip */}
        {hover !== null && tooltip && (
          <div
            className="absolute pointer-events-none z-10 rounded-full px-4 py-2 bg-white/95 backdrop-blur-sm border border-border/50 shadow-[0_4px_20px_rgba(0,0,0,0.08)] flex items-center gap-2 text-xs whitespace-nowrap"
            style={{ left: tooltip.x, top: tooltip.y, transform: "translateX(-50%)" }}
          >
            <span className="font-bold text-foreground tabular-nums">
              {adoptionFunnel[hover]?.value.toLocaleString() ?? ""}
            </span>
            <span className="text-muted-foreground">users</span>
            <span className="text-muted-foreground/30">|</span>
            <span className="text-muted-foreground">Conversion:</span>
            <span className="font-bold text-foreground">{conversion(hover)}%</span>
            <span className="text-muted-foreground/30">|</span>
            <span className="text-muted-foreground">Drop-off:</span>
            <span className="font-bold text-foreground">{dropoff(hover)}%</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdoptionFunnelCard;
