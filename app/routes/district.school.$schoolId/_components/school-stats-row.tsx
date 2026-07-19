import { Clock, Play, Users } from "lucide-react";
import { SchoolStatCard } from "./school-stat-card";

interface SchoolStatsRowProps {
  /** Real teacher-roster count for this school (all-time). */
  teacherTotal: number;
  /**
   * Per-school Total Plays from Amplitude (`practice_completed` count over the
   * window), or `null` when Amplitude is unconfigured / soft-failed — rendered
   * as a muted "—" rather than a misleading 0.
   */
  totalPlays: number | null;
  /**
   * Per-school distinct active educators from Amplitude, or `null` when
   * unconfigured / soft-failed (→ "—").
   */
  activeEducators: number | null;
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
 * count), Total Plays, and Educators Active. The latter two come from per-school
 * Amplitude (`getSchoolTotalPlays` / `getSchoolActiveEducators`); when Amplitude
 * is unconfigured or a call soft-fails they arrive as `null` and render a muted
 * "—". Collapses to a single column on mobile.
 */
export function SchoolStatsRow({
  teacherTotal,
  totalPlays,
  activeEducators,
}: SchoolStatsRowProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <SchoolStatCard label="Teachers" value={teacherTotal} icon={Users} />
      <SchoolStatCard
        label="Total Plays"
        value={statValue(totalPlays)}
        icon={Play}
      />
      <SchoolStatCard
        label="Educators Active"
        value={statValue(activeEducators)}
        icon={Clock}
      />
    </div>
  );
}
