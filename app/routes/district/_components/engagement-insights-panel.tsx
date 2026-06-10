import { GradientGaugeDial } from "~/routes/district/_components/gradient-gauge-dial";

interface MiniMetricProps {
  label: string;
  description: string;
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

export function EngagementInsightsPanel() {
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
          description="Stable participation across all schools."
          value={12}
        />
        <MiniMetric
          label="Session Completion Rate"
          description="Most sessions are partially completed."
          value={30}
        />
      </div>

      {/* Gauge — full width, anchored to the bottom of the remaining space */}
      <div className="flex-1 flex items-end justify-center px-3 pb-2">
        <GradientGaugeDial value={21} studentCount="22,000+" />
      </div>
    </div>
  );
}

export default EngagementInsightsPanel;
