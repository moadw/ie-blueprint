import { Play, School, Users } from "lucide-react";
import { Link } from "react-router";
import { Badge, type BadgeVariant } from "~/components/ui/badge";

interface DistrictSchoolItem {
  _id: string;
  name?: string | null;
  city?: string | null;
  state?: string | null;
  deletedAt?: string | null;
}

/** Per-school engagement figures; `null` = source unavailable → renders "—". */
export type SchoolStat = {
  teachers: number | null;
  plays: number | null;
};
export type SchoolStatsMap = Record<string, SchoolStat>;

interface DistrictSchoolsGridProps {
  schools: DistrictSchoolItem[];
  /** Resolved per-school stats. Omitted while `loading`. */
  stats?: SchoolStatsMap;
  /** Stats still streaming — cards show skeleton figures, header hides the count. */
  loading?: boolean;
}

type Status = "Active" | "Pending" | "Inactive";

const STATUS_VARIANT: Record<Status, BadgeVariant> = {
  Active: "active",
  Pending: "pending",
  Inactive: "neutral",
};

/**
 * A school's card status. "Active" means teachers have *accessed* the platform
 * (`teachers > 0`), not that teachers were provisioned. A deleted school is
 * "Inactive"; a live school no teacher has accessed yet is "Pending". A `null`
 * teacher figure (Amplitude unavailable) can't confirm access → "Pending".
 */
function statusFor(deletedAt: string | null | undefined, teachers: number | null): Status {
  if (deletedAt) return "Inactive";
  return (teachers ?? 0) > 0 ? "Active" : "Pending";
}

function teacherLabel(teachers: number | null): string {
  if (teachers == null) return "— teachers";
  return `${teachers} ${teachers === 1 ? "teacher" : "teachers"}`;
}

function playsLabel(plays: number | null): string {
  if (plays == null) return "— plays";
  return `${plays.toLocaleString()} plays`;
}

export function DistrictSchoolsGrid({
  schools,
  stats,
  loading = false,
}: DistrictSchoolsGridProps) {
  const activeCount = schools.filter(
    (s) => !s.deletedAt && (stats?.[s._id]?.teachers ?? 0) > 0,
  ).length;

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold">
        Schools{" "}
        {!loading && (
          <span className="text-muted-foreground font-normal">
            ({activeCount} of {schools.length} active)
          </span>
        )}
      </h2>

      {schools.length === 0 ? (
        <div className="bg-card rounded-xl border border-dashed border-border p-12 text-center">
          <School
            className="w-10 h-10 text-muted-foreground mx-auto mb-3"
            aria-hidden="true"
          />
          <p className="text-muted-foreground">
            No schools yet. Schools appear here when educators join via the
            invite link.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {schools.map((s) => {
            const stat = stats?.[s._id];
            const status = statusFor(s.deletedAt, stat?.teachers ?? null);
            return (
              <Link
                key={s._id}
                to={`/district/school/${s._id}`}
                className="block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
              >
                <div className="bg-card rounded-2xl border border-border shadow-xs p-5 flex flex-col gap-3 transition-colors hover:border-primary/40">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-semibold text-sm leading-tight text-foreground truncate">
                      {s.name ?? "Unnamed School"}
                    </span>
                    {loading ? (
                      <div className="h-5 w-14 rounded-full bg-muted animate-pulse shrink-0" />
                    ) : (
                      <Badge variant={STATUS_VARIANT[status]} className="shrink-0">
                        {status}
                      </Badge>
                    )}
                  </div>

                  {loading ? (
                    <div className="h-4 w-40 rounded-md bg-muted animate-pulse" />
                  ) : (
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5" aria-hidden="true" />
                        {teacherLabel(stat?.teachers ?? null)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Play className="h-3.5 w-3.5" aria-hidden="true" />
                        {playsLabel(stat?.plays ?? null)}
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
