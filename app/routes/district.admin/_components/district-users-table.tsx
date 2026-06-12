import { Users } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { formatRelativeTime } from "~/lib/relative-time";
import type { DistrictUserRow } from "~/routes/district.admin.users";

interface DistrictUsersTableProps {
  users: DistrictUserRow[];
  onViewCourses: (u: DistrictUserRow) => void;
}

function getInitial(user: DistrictUserRow): string {
  const first = user.firstName?.[0] ?? "";
  const last = user.lastName?.[0] ?? "";
  return (first + last).toUpperCase() || "?";
}

function joinSchools(
  schools: DistrictUserRow["schools"],
): string {
  if (!schools || schools.length === 0) return "—";
  const names = schools
    .map((s) => s?.school_name)
    .filter((n): n is string => typeof n === "string" && n.length > 0);
  return names.length > 0 ? names.join(", ") : "—";
}

export function DistrictUsersTable({
  users,
  onViewCourses,
}: DistrictUsersTableProps) {
  if (users.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-dashed border-border p-12 text-center">
        <Users
          className="w-10 h-10 text-muted-foreground mx-auto mb-3"
          aria-hidden="true"
        />
        <p className="text-muted-foreground">
          No users found with the search query
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
              User
            </th>
            <th className="text-left font-medium text-muted-foreground px-4 py-3 hidden md:table-cell">
              Email
            </th>
            <th className="text-left font-medium text-muted-foreground px-4 py-3">
              Role
            </th>
            <th className="text-left font-medium text-muted-foreground px-4 py-3 hidden lg:table-cell">
              Schools
            </th>
            <th className="text-right font-medium text-muted-foreground px-4 py-3">
              Last Login
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, i) => {
            const fullName = `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim();
            return (
              <tr
                key={u.userId ?? `${u.email}-${i}`}
                className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary text-xs font-medium flex-shrink-0">
                      {getInitial(u)}
                    </span>
                    <button
                      type="button"
                      onClick={() => onViewCourses(u)}
                      className="font-medium text-foreground hover:underline text-left truncate"
                    >
                      {fullName || "Unnamed user"}
                    </button>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                  <span className="truncate block max-w-[240px]">
                    {u.email ?? "—"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Badge variant="neutral">{u.type_name ?? "—"}</Badge>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <span className="truncate block max-w-[200px]">
                    {joinSchools(u.schools)}
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-muted-foreground">
                  {formatRelativeTime(u.lastLogin)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
