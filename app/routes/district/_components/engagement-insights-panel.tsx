import { GradientGaugeDial } from "~/routes/district/_components/gradient-gauge-dial";

interface MiniMetricProps {
  label: string;
  description: string;
  /** 0–100 percentage. Always rendered (0 when there's no activity yet). */
  value: number;
}

function MiniMetric({ label, description, value }: MiniMetricProps) {
  return (
    <div className="flex-1 bg-white/[0.06] rounded-[20px] p-3 flex flex-col gap-2.5">
      <p className="text-[11px] font-semibold text-white leading-snug">
        {label}
      </p>
      <p className="text-lg font-bold text-white font-serif leading-none shrink-0">
        {value}%
      </p>
      <p className="text-[10px] text-white/40 leading-relaxed">{description}</p>
    </div>
  );
}

interface EngagementInsightsPanelProps {
  /** % of org users who logged in AND completed ≥1 practice (drives the dial). */
  activeUserRate: number;
  /** % of users who started a practice that completed one (proxy until a true
   * started/session signal exists). */
  sessionCompletionRate: number;
  /** Live total org user count (the gauge's center number). `null` if unavailable. */
  totalUsers: number | null;
}

/**
 * District-home engagement panel (right gauge), driven by real Amplitude data
 * (`practice_completed` uniques over org users / users who started). Both rates
 * always render a number — 0 when there's no activity yet — so the panel stays
 * populated. The center number is the live org user count (em-dash only if that
 * fetch fails). Session Completion Rate is a proxy until a started/session
 * signal is instrumented (see follow-up).
 */
export function EngagementInsightsPanel({
  activeUserRate,
  sessionCompletionRate,
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
        <MiniMetric
          label="Session Completion Rate"
          description="Share of started practices that are completed."
          value={sessionCompletionRate}
        />
      </div>

      {/* Gauge — full width, anchored to the bottom of the remaining space */}
      <div className="flex-1 flex items-end justify-center px-3 pb-2">
        <GradientGaugeDial
          value={activeUserRate}
          centerValue={totalUsers == null ? "—" : totalUsers.toLocaleString()}
          centerLabel="Users"
        />
      </div>
    </div>
  );
}

export default EngagementInsightsPanel;
