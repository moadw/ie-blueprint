import { MoreHorizontal } from "lucide-react";
import { DotGrid } from "./dot-grid";
import { formatCompactTotal, formatDelta } from "./format";
import type { AnalyticsDashboardData } from "~/lib/district-analytics.server";

interface ActiveEducatorsCardProps {
  activeEducators: AnalyticsDashboardData["activeEducators"];
}

export function ActiveEducatorsCard({ activeEducators }: ActiveEducatorsCardProps) {
  const { total, deltaVsPrev, peakLabel, grid } = activeEducators;

  return (
    <div className="bg-white rounded-[24px] border border-border shadow-xs p-5 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-serif text-xl text-foreground">Active Educators</h3>
        <button
          type="button"
          className="text-muted-foreground/40 hover:text-muted-foreground transition-colors"
          aria-label="More options"
        >
          <MoreHorizontal size={16} />
        </button>
      </div>

      {/* Badge */}
      <span className="inline-flex items-center self-start rounded-full border border-border bg-white px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground mb-3">
        Highest: {peakLabel}
      </span>

      {/* Stat */}
      <div className="flex items-baseline justify-between mb-3">
        <span className="font-serif text-4xl font-bold text-foreground tabular-nums leading-none">
          {formatCompactTotal(total)}
        </span>
        <div className="flex flex-col items-end gap-0.5">
          <span className="text-[11px] text-muted-foreground">vs last period</span>
          <span className="text-base font-bold text-foreground tabular-nums">
            {formatDelta(deltaVsPrev)}
          </span>
        </div>
      </div>

      {/* Dot grid pushed to bottom */}
      <div className="mt-auto">
        <DotGrid data={grid} color="hsl(215 70% 55%)" highlightColor="hsl(215 70% 55%)" />
      </div>
    </div>
  );
}

export default ActiveEducatorsCard;
