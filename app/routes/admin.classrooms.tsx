import { useState } from "react";
import { redirect, useLoaderData } from "react-router";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { gqlClient } from "~/lib/graphql";
import { safe } from "~/lib/safe-loader";
import { GroupFindManyDocument } from "~/queries/groups";
import { GroupDeleteOneDocument } from "~/mutations/groups";
import { ClassroomRow } from "./admin.classrooms/_components/ClassroomRow";
import type { ClassroomRowGroup } from "./admin.classrooms/_components/ClassroomRow";
import { DeleteClassroomDialog } from "./admin.classrooms/_components/DeleteClassroomDialog";

// Client-only loader: the page shell SSRs immediately via HydrateFallback;
// the GraphQL call only fires after hydration, so a slow or 503-ing backend
// can't block the SSR stream (no "Server Timeout" from entry.server's
// streamTimeout).
export async function clientLoader() {
  const sessionRes = await fetch("/api/session", { credentials: "include" });
  const sessionData = (await sessionRes.json()) as { accessToken: string | null };
  const token = sessionData.accessToken;
  if (!token) throw redirect("/login");
  const result = await safe(
    gqlClient.request(
      GroupFindManyDocument,
      { filter: {} },
      { "access-token": token },
    ),
  );
  const groups: ClassroomRowGroup[] = result.ok
    ? (result.data.GroupFindMany ?? []).filter(
        (g): g is NonNullable<typeof g> => g != null,
      )
    : [];
  return { groups, error: result.error };
}

export function HydrateFallback() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-stone-500">
        View user-created classrooms. Users create classrooms from Classroom
        Types.
      </p>
      <div className="flex justify-center py-12">
        <Loader2
          className="w-6 h-6 text-stone-400 animate-spin"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

export default function AdminClassroomsRoute() {
  const { groups: initialGroups, error: loadError } =
    useLoaderData<typeof clientLoader>();

  const [groups, setGroups] = useState<ClassroomRowGroup[]>(initialGroups);
  const [deleteTarget, setDeleteTarget] = useState<ClassroomRowGroup | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    const target = deleteTarget;
    setIsDeleting(true);
    setError(null);
    try {
      await gqlClient.request(GroupDeleteOneDocument, { _id: target._id });
      setGroups((prev) => prev.filter((g) => g._id !== target._id));
      setDeleteTarget(null);
      toast.success("Classroom deleted");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete classroom";
      toast.error(message);
      setError(message);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-stone-500">
        View user-created classrooms. Users create classrooms from Classroom
        Types.
      </p>

      {loadError ? (
        <div className="rounded-xl border-2 border-dashed border-red-200 bg-red-50 py-10 text-center">
          <p className="mb-1 text-sm font-medium text-red-700">
            Couldn't load classrooms
          </p>
          <p className="text-xs text-red-600">{loadError}</p>
        </div>
      ) : groups.length === 0 ? (
        <p className="text-center text-stone-400 py-8">
          No user-created classrooms yet.
        </p>
      ) : (
        <div className="space-y-3">
          {groups.map((g) => (
            <ClassroomRow
              key={g._id}
              group={g}
              isDeleting={deleteTarget?._id === g._id && isDeleting}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      {error ? (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive flex items-center justify-between">
          <span>{error}</span>
          <Button
            variant="outline"
            onClick={() => setError(null)}
            className="h-9 px-3 text-sm"
          >
            Dismiss
          </Button>
        </div>
      ) : null}

      <DeleteClassroomDialog
        open={deleteTarget !== null}
        onOpenChange={(o) => {
          if (!o) setDeleteTarget(null);
        }}
        classroomName={deleteTarget?.name ?? null}
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
