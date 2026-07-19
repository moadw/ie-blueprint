interface ChartSkeletonProps {
  /** Extra classes (e.g. a `min-h-[…]` matching the real card) to avoid layout
   * shift when the skeleton swaps to the resolved chart. */
  className?: string;
}

/**
 * Placeholder shown while a card's deferred Amplitude data streams in. Matches
 * the analytics card chrome (white `rounded-[24px]` + `shadow-xs` border) with
 * `animate-pulse` muted blocks standing in for the title, badge, and plot. The
 * app's only `animate-pulse` usage — kept token-driven (`bg-muted`), no bespoke
 * keyframes.
 */
export function ChartSkeleton({ className }: ChartSkeletonProps) {
  return (
    <div
      className={`flex h-full flex-col rounded-[24px] border border-border bg-white p-5 shadow-xs ${
        className ?? ""
      }`}
    >
      <div className="flex h-full animate-pulse flex-col gap-4">
        {/* Title + badge row */}
        <div className="flex items-center justify-between">
          <div className="h-5 w-32 rounded bg-muted" />
          <div className="h-5 w-12 rounded-full bg-muted" />
        </div>
        {/* Plot area */}
        <div className="min-h-[120px] flex-1 rounded-xl bg-muted" />
      </div>
    </div>
  );
}

/**
 * Soft error card shown as an `<Await errorElement>` when a streamed card
 * promise rejects. `deferCard` resolves application throws to empty shapes, but
 * an SSR stream-timeout abort rejects still-pending promises client-side — this
 * degrades that one card gracefully instead of white-screening the whole route
 * via the root ErrorBoundary (the resilient-loader convention).
 */
export function ChartError({ className }: ChartSkeletonProps) {
  return (
    <div
      className={`flex h-full flex-col rounded-[24px] border border-border bg-white p-5 shadow-xs ${
        className ?? ""
      }`}
    >
      <p className="text-sm text-muted-foreground">Couldn&rsquo;t load this chart.</p>
    </div>
  );
}

export default ChartSkeleton;
