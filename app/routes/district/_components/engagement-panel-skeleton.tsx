/**
 * Dark streaming skeleton for the district-home engagement panel ("Annual
 * Engagement Arc"). `ChartSkeleton` is white and would clash inside the dark
 * `bg-[#1a1a1a]` panel, so this fallback mirrors that panel's chrome with
 * `animate-pulse` `bg-white/10` blocks standing in for the heading, the two
 * stat tiles, and the gauge dial. No props — it's a fixed placeholder.
 */
export function EngagementPanelSkeleton() {
  return (
    <div className="flex h-full flex-col rounded-[24px] bg-[#1a1a1a] p-5">
      <div className="flex h-full animate-pulse flex-col gap-4">
        {/* Heading */}
        <div className="h-4 w-40 rounded bg-white/10" />

        {/* Two stat tiles */}
        <div className="flex gap-3">
          <div className="h-24 flex-1 rounded-[20px] bg-white/10" />
          <div className="h-24 flex-1 rounded-[20px] bg-white/10" />
        </div>

        {/* Circular gauge placeholder */}
        <div className="mt-auto flex flex-1 items-end justify-center pb-2">
          <div className="h-32 w-32 rounded-full bg-white/10" />
        </div>
      </div>
    </div>
  );
}

export default EngagementPanelSkeleton;
