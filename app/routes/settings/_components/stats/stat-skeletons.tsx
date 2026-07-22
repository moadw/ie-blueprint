/**
 * Streaming placeholders for the `/settings/stats` regions. Each mirrors the
 * chrome of the component it stands in for (so the swap to real data doesn't
 * shift layout) with `animate-pulse` muted blocks — the same recipe as the
 * analytics `ChartSkeleton`, kept token-driven with no bespoke keyframes.
 */

/** The glass recipe shared by WeeklyChain / JourneyProgress / RoutineCard. */
const GLASS_STYLE = {
  background: "rgba(255,255,255,0.7)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "2px solid rgba(255,255,255,0.5)",
  boxShadow: "0 8px 32px rgba(40,46,56,0.08), inset 0 1px 0 rgba(255,255,255,0.3)",
} as const;

/** One tinted stat tile placeholder — matches `StatCard`'s chrome. */
export function StatCardSkeleton() {
  return (
    <div className="bg-primary/10 rounded-[24px] p-5 min-h-[100px] flex flex-col items-center justify-center gap-2">
      <div className="h-8 w-14 rounded-lg bg-primary/20 animate-pulse" />
      <div className="h-3 w-20 rounded bg-primary/15 animate-pulse" />
    </div>
  );
}

/** Weekly-chain placeholder — title + a row of 5 day nodes + a message line. */
export function WeeklyChainSkeleton() {
  return (
    <div className="rounded-[24px] p-6 overflow-hidden" style={GLASS_STYLE}>
      <div className="h-4 w-36 rounded bg-muted animate-pulse mb-6" />
      <div className="flex items-start justify-between w-full max-w-md mx-auto px-2 animate-pulse">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-2.5">
            <div className="w-14 h-14 rounded-[24px] bg-muted" />
            <div className="h-3 w-7 rounded bg-muted" />
          </div>
        ))}
      </div>
      <div className="h-3 w-52 rounded bg-muted animate-pulse mx-auto mt-6" />
    </div>
  );
}

/** Journey-progress placeholder — title/percent row + a progress track. */
export function JourneyProgressSkeleton() {
  return (
    <div className="rounded-[24px] p-5" style={GLASS_STYLE}>
      <div className="flex items-center justify-between mb-3 animate-pulse">
        <div className="h-4 w-40 rounded bg-muted" />
        <div className="h-4 w-24 rounded bg-muted" />
      </div>
      <div className="h-7 rounded-full bg-primary/10 animate-pulse" />
      <div className="h-8" />
    </div>
  );
}

/** Routine-card placeholder — the progress ring + the text column. */
export function RoutineCardSkeleton() {
  return (
    <div className="rounded-[24px] p-6" style={GLASS_STYLE}>
      <div className="flex items-start gap-5 animate-pulse">
        <div className="w-[100px] h-[100px] rounded-full bg-muted flex-shrink-0" />
        <div className="flex-1 pt-1 space-y-2">
          <div className="h-5 w-40 rounded bg-muted" />
          <div className="h-3 w-52 rounded bg-muted" />
          <div className="h-3 w-full rounded bg-muted" />
          <div className="h-3 w-3/4 rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}

/**
 * Soft error shown as an `<Await errorElement>` when a streamed region rejects.
 * `deferStat` resolves application throws to empty shapes, but an SSR
 * stream-timeout abort rejects still-pending promises client-side — this
 * degrades that one region gracefully (dashed-red card, sized via `className`)
 * instead of white-screening the route via the root ErrorBoundary.
 */
export function StatRegionError({ className }: { className?: string }) {
  return (
    <div
      className={`flex items-center justify-center rounded-[24px] border-2 border-dashed border-red-200 bg-red-50 p-4 text-center ${
        className ?? ""
      }`}
    >
      <p className="text-xs text-red-600">Couldn&apos;t load this section.</p>
    </div>
  );
}
