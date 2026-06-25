import { MoreHorizontal, TrendingUp } from "lucide-react";
import { SegmentedBar } from "./segmented-bar";
import type { AnalyticsDashboardData } from "~/lib/district-analytics.server";

interface MindfulMinutesCardProps {
  mindfulMinutes: AnalyticsDashboardData["mindfulMinutes"];
}

export function MindfulMinutesCard({ mindfulMinutes }: MindfulMinutesCardProps) {
  const { total, trendPct, breakdowns } = mindfulMinutes;
  const max = Math.max(...breakdowns.map((b) => b.value), 1);
  const trendPositive = trendPct >= 0;

  return (
    <div className="bg-white rounded-[24px] border border-border shadow-xs p-6 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-display text-xl text-foreground">Mindful Minutes</h3>
        <button
          type="button"
          className="text-muted-foreground/40 hover:text-muted-foreground transition-colors"
          aria-label="More options"
        >
          <MoreHorizontal size={18} />
        </button>
      </div>

      {/* Headline */}
      <div className="flex items-baseline gap-3 mb-6">
        <span className="font-display text-7xl font-bold text-foreground tabular-nums">
          {total.toLocaleString()}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary px-2.5 py-0.5 text-xs font-semibold">
          <TrendingUp size={12} />
          {trendPositive ? "+" : ""}
          {trendPct}%
        </span>
      </div>

      {/* Breakdowns */}
      <div className="flex flex-col gap-5 mt-auto">
        {breakdowns.length === 0 ? (
          <p className="text-sm text-muted-foreground/70">
            No role breakdown for this period yet.
          </p>
        ) : (
          breakdowns.map((item) => (
            <div key={item.label} className="flex flex-col gap-1.5">
              <div className="flex justify-between items-baseline">
                <span className="text-sm text-muted-foreground">{item.label}</span>
                <span className="text-sm font-semibold text-foreground tabular-nums">
                  {item.value.toLocaleString()} min
                </span>
              </div>
              <SegmentedBar value={item.value} max={max} color={item.color} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MindfulMinutesCard;
