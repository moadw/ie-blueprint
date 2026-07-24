import { GradientGaugeDial } from "~/routes/district/_components/gradient-gauge-dial";

interface MiniMetricProps {
  label: string;
  /** Pre-formatted value string (e.g. "82%"). */
  value: string;
  description: string;
  /** Optional trend arrow shown before the value: green ▲ up / red ▼ down. */
  direction?: "up" | "down";
}

function MiniMetric({ label, value, description, direction }: MiniMetricProps) {
  return (
    <div className="flex-1 bg-white/[0.06] rounded-[20px] p-3 flex flex-col gap-2.5">
      <p className="text-[11px] font-semibold text-white leading-snug">
        {label}
      </p>
      <p className="text-lg font-bold text-white font-serif leading-none shrink-0 flex items-center gap-1">
        {direction ? (
          <span
            className={`text-xs ${
              direction === "up" ? "text-green-500" : "text-red-500"
            }`}
            aria-hidden
          >
            {direction === "up" ? "▲" : "▼"}
          </span>
        ) : null}
        {value}
      </p>
      <p className="text-[10px] text-white/40 leading-relaxed">{description}</p>
    </div>
  );
}

interface EngagementInsightsPanelProps {
  /** % of org users who logged in AND completed ≥1 practice (0–100). */
  activeUserRate: number;
  /** Magnitude of the week-over-week active-users change (sign in `priorWeekDirection`). */
  priorWeekDeltaPct: number;
  /** "up" when this week ≥ last week, else "down" (drives the tile arrow). */
  priorWeekDirection: "up" | "down";
  /** Formatted YTD mindful minutes ("x.xk" ≥ 1000) — the gauge center number. */
  ytdMindfulLabel: string;
  /** Gauge arc fill (0–100). */
  gaugeScore: number;
}

/**
 * District-home "Annual Engagement Arc" panel (right gauge), driven entirely by
 * real Amplitude data streamed in from the home loader — no hardcoded numbers.
 * Kept on the dark `bg-[#1a1a1a]` hero theme with the panel's serif value
 * treatment; only the copy, props, and trend arrows changed from the prior
 * "Engagement Analytics Insights" version. The gauge center shows the live YTD
 * mindful minutes ("Mindful Minutes YTD").
 */
export function EngagementInsightsPanel({
  activeUserRate,
  priorWeekDeltaPct,
  priorWeekDirection,
  ytdMindfulLabel,
  gaugeScore,
}: EngagementInsightsPanelProps) {
  return (
    <div className="bg-[#1a1a1a] rounded-[24px] flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-4 pb-2">
        <h2 className="text-white text-sm font-semibold font-serif">
          Annual Engagement Arc
        </h2>
      </div>

      {/* Mini metrics */}
      <div className="flex gap-3 px-5 pb-3">
        <MiniMetric
          label="Active User Rate"
          value={`${activeUserRate}%`}
          description="Stable participation across your schools."
        />
        <MiniMetric
          label="From Prior Week"
          value={`${priorWeekDeltaPct}%`}
          description="Compared to last week's activity."
          direction={priorWeekDirection}
        />
      </div>

      {/* Gauge — full width, anchored to the bottom of the remaining space */}
      <div className="flex-1 flex items-end justify-center px-3 pb-2">
        <GradientGaugeDial
          value={gaugeScore}
          centerValue={ytdMindfulLabel}
          centerLabel="Mindful Minutes YTD"
        />
      </div>
    </div>
  );
}

export default EngagementInsightsPanel;
