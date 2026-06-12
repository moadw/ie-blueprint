import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { env } from "~/lib/env";
import { gqlClient } from "~/lib/graphql";
import { safe } from "~/lib/safe-loader";
import { GroupFindManyDocument } from "~/queries/groups";
import type { DistrictUserRow } from "~/routes/district.admin.users";

export interface DistrictUserCoursesDialogProps {
  target: DistrictUserRow | null;
  onOpenChange: (open: boolean) => void;
}

type GroupItem = { _id: string; name: string | null | undefined };

export function DistrictUserCoursesDialog({
  target,
  onOpenChange,
}: DistrictUserCoursesDialogProps) {
  const [groups, setGroups] = useState<GroupItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (target === null) {
      setGroups(null);
      setError(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    const userId = target.userId;
    if (!userId) {
      setGroups([]);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setGroups(null);

    void (async () => {
      const result = await safe(
        gqlClient.request(GroupFindManyDocument, {
          filter: { manager: userId, platform: env.PLATFORM },
          limit: 100,
        }),
      );
      if (cancelled) return;
      if (result.ok) {
        const raw = result.data.GroupFindMany ?? [];
        const filtered = raw.filter(
          (g): g is NonNullable<typeof g> => g != null,
        );
        setGroups(filtered.map((g) => ({ _id: g._id, name: g.name })));
        setError(null);
      } else {
        setGroups([]);
        setError(result.error);
      }
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [target]);

  const schoolNames =
    target?.schools
      ?.map((s) => s?.school_name)
      .filter((n): n is string => typeof n === "string" && n.length > 0) ?? [];

  return (
    <Dialog open={target !== null} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl font-normal">
            Courses managed by {target?.firstName ?? ""}{" "}
            {target?.lastName ?? ""}
          </DialogTitle>
          <DialogDescription>
            {target?.email ?? ""}
            {schoolNames.length > 0 ? <> · {schoolNames.join(", ")}</> : null}
          </DialogDescription>
        </DialogHeader>
        {loading ? (
          <Loader2
            className="w-5 h-5 animate-spin mx-auto text-muted-foreground"
            aria-hidden="true"
          />
        ) : null}
        {!loading && error ? (
          <div className="rounded-xl border-2 border-dashed border-red-200 bg-red-50 py-6 text-center">
            <p className="text-sm font-medium text-red-700">
              Couldn't load courses
            </p>
            <p className="text-xs text-red-600">{error}</p>
          </div>
        ) : null}
        {!loading && !error && groups && groups.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            This user has no courses assigned yet.
          </p>
        ) : null}
        {!loading && !error && groups && groups.length > 0 ? (
          <ul className="space-y-2">
            {groups.map((g) => (
              <li
                key={g._id}
                className="rounded-[14px] border border-border bg-card px-3 py-2 text-sm"
              >
                {g.name ?? g._id}
              </li>
            ))}
          </ul>
        ) : null}
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
