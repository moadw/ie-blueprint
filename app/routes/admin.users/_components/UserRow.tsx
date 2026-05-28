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
  onViewCourses: (u: AdminUserRow) => void;
}

function formatDate(iso?: string | null): string {
  return iso ? new Date(iso).toLocaleDateString() : "—";
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
  onViewCourses,
}: UserRowProps) {
  const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
  return (
    <div className="bg-card rounded-[14px] shadow-xs border border-border p-4 flex items-center justify-between gap-3">
      {/* Name */}
      <div className="min-w-0 flex-1">
        <button
          type="button"
          onClick={() => onViewCourses(user)}
          className="text-foreground hover:underline font-medium text-sm text-left truncate"
        >
          {fullName || "Unnamed user"}
        </button>
      </div>

      {/* Email */}
      <div className="min-w-0 flex-1 hidden md:block">
        <span className="text-sm text-muted-foreground truncate block">
          {user.email ?? "—"}
        </span>
      </div>

      {/* Role */}
      <div className="flex-shrink-0">
        <Badge variant="neutral">{user.type_name ?? "—"}</Badge>
      </div>

      {/* District */}
      <div className="min-w-0 flex-1 hidden lg:block">
        <span className="text-sm truncate block">
          {user.organization_name ?? "—"}
        </span>
      </div>

      {/* Schools + add */}
      <div className="min-w-0 flex-1 hidden lg:flex items-center gap-1.5">
        <span className="text-sm truncate">{joinSchools(user.schools)}</span>
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
      </div>

      {/* Created */}
      <div className="flex-shrink-0 hidden xl:block">
        <span className="text-xs text-muted-foreground">
          {formatDate(user.createdAt)}
        </span>
      </div>

      {/* Last Login */}
      <div className="flex-shrink-0 hidden xl:block">
        <span className="text-xs text-muted-foreground">
          {formatDate(user.lastLogin)}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onEdit(user)}
          title="Edit"
          aria-label="Edit user"
        >
          <Pencil className="w-4 h-4" aria-hidden="true" />
        </Button>
        {user.userId ? (
          <Link
            to={`/admin/users/${user.userId}`}
            title="View user detail"
            aria-label="View user detail"
            className="inline-flex items-center justify-center h-9 w-9 rounded-md hover:bg-muted text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
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
        >
          <KeyRound className="w-4 h-4" aria-hidden="true" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(user)}
          title="Delete"
          aria-label="Delete user"
        >
          <Trash2 className="w-4 h-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
