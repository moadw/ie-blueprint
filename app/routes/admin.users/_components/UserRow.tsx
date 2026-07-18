import { ArrowUpRight, KeyRound, Pencil, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import type { UserSearchQuery } from "~/gql/graphql";

/**
 * A single row from `UserSearch.data` — non-null. Exported so the dialog
 * components (steps 4-8) can type their `target` props without re-deriving
 * the shape.
 *
 * The array element itself is `T | null` in the codegen output, so we apply
 * `NonNullable` twice — once for the `data` field, once for the element.
 */
export type AdminUserRow = NonNullable<
  NonNullable<NonNullable<UserSearchQuery["UserSearch"]>["data"]>[number]
>;

export interface UserRowProps {
  user: AdminUserRow;
  onEdit: (u: AdminUserRow) => void;
  onDelete: (u: AdminUserRow) => void;
  onSetPassword: (u: AdminUserRow) => void;
  onManageSchools: (u: AdminUserRow) => void;
  /** Whether this user's role is school-scoped (false hides the + control). */
  canManageSchools: boolean;
}

/**
 * Shared column template so the header and every row card line up
 * column-for-column. Columns appear progressively with viewport width; each
 * cell's `hidden` breakpoint below MUST match the breakpoint at which this
 * template adds its track, so a display:none cell never occupies a track
 * (grid skips it). Widths are `fr`/fixed (never `auto` on content that varies
 * per row), so separate row grids resolve to identical track sizes.
 */
export const USERS_GRID_CLASS =
  "grid items-start gap-3 " +
  "grid-cols-[minmax(0,1fr)_150px_134px] " +
  "md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_150px_134px] " +
  "lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_150px_minmax(0,1fr)_minmax(0,1.2fr)_134px] " +
  "xl:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_150px_minmax(0,1fr)_minmax(0,1.2fr)_90px_90px_134px]";

/** Column headings, aligned to the same template as the rows. */
export function UsersTableHeader() {
  const cell = "text-xs font-medium uppercase tracking-wide text-muted-foreground";
  return (
    <div className={`${USERS_GRID_CLASS} border border-transparent px-4 pb-1`}>
      <span className={cell}>Name</span>
      <span className={`${cell} hidden md:block`}>Email</span>
      <span className={cell}>Role</span>
      <span className={`${cell} hidden lg:block`}>District</span>
      <span className={`${cell} hidden lg:block`}>Schools</span>
      <span className={`${cell} hidden xl:block`}>Created</span>
      <span className={`${cell} hidden xl:block`}>Last Login</span>
      <span className={`${cell} text-right`}>Actions</span>
    </div>
  );
}

function formatDate(value?: string | null): string {
  if (!value) return "—";
  // The backend returns timestamps as epoch milliseconds in a string, which
  // `new Date(string)` can't parse (→ "Invalid Date"). Coerce plain-digit
  // strings to a number first (mirrors app/lib/relative-time.ts).
  const input = /^\d+$/.test(value) ? Number(value) : value;
  const date = new Date(input);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString();
}

function joinSchools(schools: AdminUserRow["schools"]): string {
  if (!schools || schools.length === 0) return "—";
  const names = schools
    .map((s) => s?.school_name)
    .filter((n): n is string => typeof n === "string" && n.length > 0);
  return names.length > 0 ? names.join(", ") : "—";
}

export function UserRow({
  user,
  onEdit,
  onDelete,
  onSetPassword,
  onManageSchools,
  canManageSchools,
}: UserRowProps) {
  const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
  return (
    <div
      className={`${USERS_GRID_CLASS} bg-card rounded-[14px] shadow-xs border border-border px-4 py-3`}
    >
      {/* Name */}
      <div className="min-w-0">
        <span className="text-foreground font-medium text-xs break-words block">
          {fullName || "Unnamed user"}
        </span>
      </div>

      {/* Email — single line, never wraps */}
      <div className="min-w-0 hidden md:block overflow-hidden">
        <span className="text-xs text-muted-foreground whitespace-nowrap block">
          {user.email ?? "—"}
        </span>
      </div>

      {/* Role */}
      <div className="min-w-0">
        <Badge variant="neutral" className="whitespace-nowrap">
          {user.type_name ?? "—"}
        </Badge>
      </div>

      {/* District */}
      <div className="min-w-0 hidden lg:block">
        <span className="text-xs break-words block">
          {user.organization_name ?? "—"}
        </span>
      </div>

      {/* Schools + add */}
      <div className="min-w-0 hidden lg:flex items-start gap-1.5">
        <span className="text-xs break-words min-w-0 flex-1">
          {joinSchools(user.schools)}
        </span>
        {canManageSchools ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onManageSchools(user)}
            title="Manage schools"
            aria-label="Manage schools"
            className="h-6 w-6 flex-shrink-0"
          >
            <Plus className="w-3 h-3" aria-hidden="true" />
          </Button>
        ) : null}
      </div>

      {/* Created */}
      <div className="min-w-0 hidden xl:block">
        <span className="text-xs text-muted-foreground">
          {formatDate(user.createdAt)}
        </span>
      </div>

      {/* Last Login */}
      <div className="min-w-0 hidden xl:block">
        <span className="text-xs text-muted-foreground">
          {formatDate(user.lastLogin)}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-0.5">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onEdit(user)}
          title="Edit"
          aria-label="Edit user"
          className="h-8 w-8"
        >
          <Pencil className="w-4 h-4" aria-hidden="true" />
        </Button>
        {user.userId ? (
          <Link
            to={`/admin/users/${user.userId}`}
            title="View user detail"
            aria-label="View user detail"
            className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-muted text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          >
            <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        ) : null}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onSetPassword(user)}
          title="Set password"
          aria-label="Set password"
          className="h-8 w-8"
        >
          <KeyRound className="w-4 h-4" aria-hidden="true" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(user)}
          title="Delete"
          aria-label="Delete user"
          className="h-8 w-8"
        >
          <Trash2 className="w-4 h-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
