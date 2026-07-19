import { Users } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { getInitials } from "~/lib/initials";
import { formatRelativeTime } from "~/lib/relative-time";
import type { SchoolEducatorRow } from "~/routes/district.school.$schoolId";

interface SchoolEducatorsTableProps {
  educators: SchoolEducatorRow[];
}

/**
 * Teachers at a school. Columns intentionally diverge from the prototype's
 * (Educator / Role / Plays / Last Active): per-educator Plays would need a
 * per-user Amplitude fan-out through the ≤2 concurrency gate, and the
 * `UserSearch` row only exposes `lastLogin`, so we honestly show
 * Educator / Role / Email / **Last Login** instead. See the plan's
 * "What We're NOT Doing".
 */
export function SchoolEducatorsTable({ educators }: SchoolEducatorsTableProps) {
  if (educators.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-dashed border-border p-8 text-center">
        <Users
          className="w-8 h-8 text-muted-foreground mx-auto mb-2"
          aria-hidden="true"
        />
        <p className="text-sm text-muted-foreground">
          No educators have joined this school yet.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted/30">
            <th className="text-left font-medium text-muted-foreground px-4 py-3">
              Educator
            </th>
            <th className="text-left font-medium text-muted-foreground px-4 py-3">
              Role
            </th>
            <th className="text-left font-medium text-muted-foreground px-4 py-3 hidden md:table-cell">
              Email
            </th>
            <th className="text-right font-medium text-muted-foreground px-4 py-3">
              Last Login
            </th>
          </tr>
        </thead>
        <tbody>
          {educators.map((e, i) => {
            const fullName = `${e.firstName ?? ""} ${e.lastName ?? ""}`.trim();
            return (
              <tr
                key={e.userId ?? `${e.email ?? "row"}-${i}`}
                className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary text-xs font-medium flex-shrink-0">
                      {getInitials(fullName) || "?"}
                    </span>
                    <span className="font-medium text-foreground truncate">
                      {fullName || "Unnamed user"}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge variant="neutral">{e.type_name ?? "—"}</Badge>
                </td>
                <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                  <span className="truncate block max-w-[240px]">
                    {e.email ?? "—"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-muted-foreground">
                  {formatRelativeTime(e.lastLogin)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
