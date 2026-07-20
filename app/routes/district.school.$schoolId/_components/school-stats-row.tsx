import { Suspense } from "react";
import { Await } from "react-router";
import { Clock, Play, Users } from "lucide-react";
import { SchoolStatCard } from "./school-stat-card";

interface SchoolStatsRowProps {
  /** Real teacher-roster count for this school (all-time). Resolved synchronously
   *  from GraphQL, so this tile renders immediately (no skeleton). */
  teacherTotal: number;
  /**
   * Per-school Total Plays from Amplitude (`practice_completed` count over the
   * window), deferred so it streams in behind a skeleton instead of blocking the
   * page. Resolves to `null` when Amplitude is unconfigured / soft-failed —
   * rendered as a muted "—" rather than a misleading 0.
   */
  totalPlays: Promise<number | null>;
  /**
   * Per-school distinct active educators from Amplitude, deferred the same way;
   * resolves to `null` when unconfigured / soft-failed (→ "—").
   */
  activeEducators: Promise<number | null>;
}

/**
 * Format an optional Amplitude count for a stat card: a localized number when
 * present, else a muted em-dash (unconfigured / soft-fail). Never a spinner,
 * never a crash — the card degrades to "—" so the page always renders.
 */
function statValue(n: number | null): string | number {
  return n != null ? n.toLocaleString() : "—";
}

/**
 * The 3-up stat row on the school-detail page: Teachers (real, from the roster
 * count, rendered immediately), Total Plays, and Educators Active. The latter two
 * come from per-school Amplitude (`getSchoolTotalPlays` / `getSchoolActiveEducators`)
 * and stream in behind a skeleton so the page doesn't wait on the (slow) Amplitude
 * calls. `deferStat` normalizes them to never reject; the `<Await errorElement>`
 * degrades an SSR stream-timeout abort to a muted "—" instead of white-screening
 * the route (CLAUDE.md "Resilient loaders"). Collapses to a single column on mobile.
 */
export function SchoolStatsRow({
  teacherTotal,
  totalPlays,
  activeEducators,
}: SchoolStatsRowProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <SchoolStatCard label="Teachers" value={teacherTotal} icon={Users} />

      <Suspense fallback={<SchoolStatCard label="Total Plays" icon={Play} loading />}>
        <Await
          resolve={totalPlays}
          errorElement={<SchoolStatCard label="Total Plays" value="—" icon={Play} />}
        >
          {(plays) => (
            <SchoolStatCard
              label="Total Plays"
              value={statValue(plays)}
              icon={Play}
            />
          )}
        </Await>
      </Suspense>

      <Suspense
        fallback={<SchoolStatCard label="Educators Active" icon={Clock} loading />}
      >
        <Await
          resolve={activeEducators}
          errorElement={
            <SchoolStatCard label="Educators Active" value="—" icon={Clock} />
          }
        >
          {(educators) => (
            <SchoolStatCard
              label="Educators Active"
              value={statValue(educators)}
              icon={Clock}
            />
          )}
        </Await>
      </Suspense>
    </div>
  );
}
