import { TrendingDown, TrendingUp } from "lucide-react";
import { formatCompactTotal } from "~/routes/district.analytics/_components/format";
import { SegmentedBar } from "~/routes/district.analytics/_components/segmented-bar";

interface PracticeSessionsCardProps {
  /** Playback count for the current school year (Amplitude content_played). */
  current: number;
  /** Playback count for the prior school year. */
  previous: number;
}

/**
 * District-home "Practice Sessions" card. Pure prop-driven (no self-fetch) — the
 * home loader streams `{ current, previous }` in. Reuses the analytics
 * `SegmentedBar` + `formatCompactTotal` cross-route so the compact totals and
 * segmented meter match the analytics dashboard. Trend chip shows the up icon
 * when `current >= previous`; the delta label is an em-dash when there's no
 * prior-year baseline to divide by.
 */
export function PracticeSessionsCard({ current, previous }: PracticeSessionsCardProps) {
  const isUp = current >= previous;
  const deltaLabel =
    previous > 0 ? `${Math.round(((current - previous) / previous) * 100)}%` : "—";

  return (
    <div className="flex h-full flex-col rounded-[24px] border border-border bg-white p-5 shadow-xs">
      <h3 className="font-display text-base text-foreground">Practice Sessions</h3>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="font-display text-3xl font-bold tabular-nums text-foreground">
          {formatCompactTotal(current)}
        </span>
        <span
          className={`flex items-center gap-0.5 text-xs font-medium ${
            isUp ? "text-primary" : "text-red-600"
          }`}
        >
          {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {deltaLabel}
        </span>
      </div>
      <span className="mt-0.5 mb-auto text-[11px] text-muted-foreground/50">
        this school year
      </span>

      <div className="space-y-1.5 pt-3">
        <SegmentedBar
          value={current}
          max={Math.max(current, previous, 1)}
          color="var(--color-primary)"
        />
        <div className="flex justify-between text-[11px] text-muted-foreground/50">
          <span>Current: {formatCompactTotal(current)}</span>
          <span>Last year: {formatCompactTotal(previous)}</span>
        </div>
      </div>
    </div>
  );
}

export default PracticeSessionsCard;
