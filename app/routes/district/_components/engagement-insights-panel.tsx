import { GradientGaugeDial } from "~/routes/district/_components/gradient-gauge-dial";

interface MiniMetricProps {
  label: string;
  description: string;
  /** 0–100 percentage, or `null` for a soft "no data" state. */
  value: number | null;
}

function MiniMetric({ label, description, value }: MiniMetricProps) {
  return (
    <div className="flex-1 bg-white/[0.06] rounded-[20px] p-3 flex flex-col gap-2.5">
      <p className="text-[11px] font-semibold text-white leading-snug">
        {label}
      </p>
      <p className="text-lg font-bold text-white font-serif leading-none shrink-0">
        {value == null ? "—" : `${value}%`}
      </p>
      <p className="text-[10px] text-white/40 leading-relaxed">{description}</p>
    </div>
  );
}

interface EngagementInsightsPanelProps {
  /**
   * Active User Rate (0–100): % of org users who logged in AND completed ≥1
   * practice over the window. `null` when the data source is unavailable.
   */
  activeUserRate: number | null;
  /** Live total org user count (the gauge's center number). `null` if unavailable. */
  totalUsers: number | null;
}

/**
 * District-home engagement panel (right gauge). The Active User Rate + the gauge
 * dial are driven by real Amplitude data (`practice_completed` uniques ÷ org
 * users); the center number is the live org user count. The prototype's
 * "Session Completion Rate" mini-metric is intentionally omitted — there is no
 * completion-vs-started signal instrumented yet (see follow-up), so it would be
 * fabricated. A `null` rate/count renders an honest em-dash.
 */
export function EngagementInsightsPanel({
  activeUserRate,
  totalUsers,
}: EngagementInsightsPanelProps) {
  return (
    <div className="bg-[#1a1a1a] rounded-[24px] flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-4 pb-2">
        <h2 className="text-white text-sm font-semibold font-serif">
          Engagement Analytics Insights
        </h2>
      </div>

      {/* Mini metrics */}
      <div className="flex gap-3 px-5 pb-3">
        <MiniMetric
          label="Active User Rate"
          description="Users who log in and complete at least one practice."
          value={activeUserRate}
        />
      </div>

      {/* Gauge — full width, anchored to the bottom of the remaining space */}
      <div className="flex-1 flex items-end justify-center px-3 pb-2">
        <GradientGaugeDial
          value={activeUserRate ?? 0}
          centerValue={totalUsers == null ? "—" : totalUsers.toLocaleString()}
          centerLabel="Users"
        />
      </div>
    </div>
  );
}

export default EngagementInsightsPanel;
