interface SchoolsOverviewCardProps {
  /** Schools with at least one registered educator (Amplitude active-schools). */
  registered: number;
  /** Schools licensed to the district (from SchoolFindMany). */
  licensed: number;
}

/**
 * District-home "School Registration" card. Pure prop-driven (no self-fetch) —
 * the home loader streams `{ registered, licensed }` in. Matches the analytics
 * card chrome (white `rounded-[24px]` + `shadow-xs` border). Progress fill is
 * guarded so `licensed === 0` renders an empty (0%) track instead of dividing
 * by zero.
 */
export function SchoolsOverviewCard({ registered, licensed }: SchoolsOverviewCardProps) {
  const ratio = licensed > 0 ? Math.min(1, registered / licensed) : 0;

  return (
    <div className="flex h-full flex-col rounded-[24px] border border-border bg-white p-5 shadow-xs">
      <h3 className="font-display text-base text-foreground">School Registration</h3>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="font-display text-4xl font-bold tabular-nums text-foreground">
          {registered}
          <span className="text-xl font-normal text-muted-foreground/50">/{licensed}</span>
        </span>
      </div>
      <span className="mt-1 text-xs text-muted-foreground/60">
        schools with registered educators
      </span>

      <div className="mt-auto pt-4">
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary"
            style={{ width: `${ratio * 100}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between text-[11px] text-muted-foreground/50">
          <span>{registered} active</span>
          <span>{licensed} licensed</span>
        </div>
      </div>
    </div>
  );
}

export default SchoolsOverviewCard;
