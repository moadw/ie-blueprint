import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
  Building2,
  CalendarDays,
  Clock,
  Hash,
  Loader2,
  Mail,
  School,
} from "lucide-react";
import { Badge } from "~/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "~/components/ui/dialog";
import { toErrorMessage } from "~/lib/errors";
import { gqlClient } from "~/lib/graphql";
import { cn } from "~/lib/utils";
import { GroupFindManyDocument } from "~/queries/groups";
import type { GroupFindManyQuery } from "~/gql/graphql";
import { formatDate, joinSchools } from "./UserRow";
import type { AdminUserRow } from "./UserRow";

type ClassGroup = NonNullable<
  NonNullable<GroupFindManyQuery["GroupFindMany"]>[number]
>;

export interface UserDetailDialogProps {
  /** The user whose detail to show; `null` keeps the dialog closed. */
  target: AdminUserRow | null;
  onOpenChange: (open: boolean) => void;
}

/**
 * Read-only user detail as a modal (mirrors MTW's user page, but in place).
 * Profile renders instantly from the already-loaded UserSearch row; Classes
 * are fetched client-side on open (the user's managed groups), with the
 * loading / error / empty states the resilient-loader convention expects.
 */
export function UserDetailDialog({
  target,
  onOpenChange,
}: UserDetailDialogProps) {
  const open = target !== null;
  const userId = target?.userId ?? null;

  const [classes, setClasses] = useState<ClassGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setClasses([]);
      setError(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    gqlClient
      .request(GroupFindManyDocument, { filter: { manager: userId } })
      .then((data) => {
        if (cancelled) return;
        setClasses(
          (data.GroupFindMany ?? []).filter(
            (g): g is ClassGroup => g != null,
          ),
        );
      })
      .catch((err) => {
        if (!cancelled) setError(toErrorMessage(err, "Couldn't load classes"));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const fullName = target
    ? `${target.firstName ?? ""} ${target.lastName ?? ""}`.trim()
    : "";
  const initials =
    `${target?.firstName?.[0] ?? ""}${target?.lastName?.[0] ?? ""}`.trim();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl" aria-describedby={undefined}>
        {target ? (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4 pr-8">
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-muted text-lg font-medium uppercase text-muted-foreground">
                {initials || "?"}
              </div>
              <div className="min-w-0">
                <DialogTitle className="truncate font-serif text-2xl text-foreground">
                  {fullName || "Unnamed user"}
                </DialogTitle>
                {target.type_name ? (
                  <Badge variant="neutral" className="mt-1">
                    {target.type_name}
                  </Badge>
                ) : null}
              </div>
            </div>

            {/* Profile */}
            <section>
              <h3 className="mb-3 text-sm font-medium text-foreground">
                Profile
              </h3>
              <dl className="grid grid-cols-1 gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
                <DetailField
                  icon={<Mail className="h-4 w-4" />}
                  label="Email"
                  value={target.email}
                />
                <DetailField
                  icon={<Hash className="h-4 w-4" />}
                  label="User ID"
                  value={target.userId}
                  mono
                />
                <DetailField
                  icon={<Building2 className="h-4 w-4" />}
                  label="District"
                  value={target.organization_name}
                />
                <DetailField
                  icon={<School className="h-4 w-4" />}
                  label="Schools"
                  value={joinSchools(target.schools)}
                />
                <DetailField
                  icon={<CalendarDays className="h-4 w-4" />}
                  label="Created"
                  value={formatDate(target.createdAt)}
                />
                <DetailField
                  icon={<Clock className="h-4 w-4" />}
                  label="Last login"
                  value={formatDate(target.lastLogin)}
                />
              </dl>
            </section>

            {/* Classes */}
            <section>
              <h3 className="mb-3 text-sm font-medium text-foreground">
                Classes
                {!loading && !error ? (
                  <span className="ml-1 text-muted-foreground">
                    ({classes.length})
                  </span>
                ) : null}
              </h3>

              {loading ? (
                <div className="flex justify-center py-6">
                  <Loader2
                    className="h-5 w-5 animate-spin text-muted-foreground"
                    aria-hidden="true"
                  />
                </div>
              ) : error ? (
                <div className="rounded-xl border-2 border-dashed border-red-200 bg-red-50 py-6 text-center">
                  <p className="mb-1 text-sm font-medium text-red-700">
                    Couldn't load classes
                  </p>
                  <p className="text-xs text-red-600">{error}</p>
                </div>
              ) : classes.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  This user has no classes yet.
                </p>
              ) : (
                <ul className="space-y-2">
                  {classes.map((c) => {
                    const seriesCount = (c.curriculums ?? []).filter(
                      Boolean,
                    ).length;
                    return (
                      <li
                        key={c._id}
                        className="rounded-[14px] border border-border bg-card p-3"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="truncate font-medium text-foreground">
                            {c.name ?? "Untitled class"}
                          </span>
                          <span className="flex-shrink-0 text-xs text-muted-foreground">
                            {seriesCount} series
                          </span>
                        </div>
                        {c.grade ? (
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {c.grade}
                          </p>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function DetailField({
  icon,
  label,
  value,
  mono = false,
}: {
  icon: ReactNode;
  label: string;
  value?: string | null | undefined;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 flex-shrink-0 text-muted-foreground" aria-hidden="true">
        {icon}
      </span>
      <div className="min-w-0">
        <dt className="text-xs text-muted-foreground">{label}</dt>
        <dd
          className={cn(
            "break-words text-foreground",
            mono && "font-mono text-xs",
          )}
        >
          {value && value.trim() ? value : "—"}
        </dd>
      </div>
    </div>
  );
}

export default UserDetailDialog;
