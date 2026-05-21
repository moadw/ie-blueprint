import { useState } from "react";
import {
  useLoaderData,
  useNavigate,
  useNavigation,
  useRevalidator,
} from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  ADMIN_LIST_PAGE_SIZE,
  AdminListPagination,
} from "~/components/admin/admin-list-pagination";
import { env } from "~/lib/env";
import { gqlClient } from "~/lib/graphql";
import { readPageFromRequest } from "~/lib/pagination";
import { safe } from "~/lib/safe-loader";
import { requireSessionToken } from "~/lib/session.server";
import { GroupFindManyDocument } from "~/queries/groups";
import { GroupDeleteOneDocument } from "~/mutations/groups";
import { ClassroomRow } from "./admin.classrooms/_components/ClassroomRow";
import type { ClassroomRowGroup } from "./admin.classrooms/_components/ClassroomRow";
import { DeleteClassroomDialog } from "./admin.classrooms/_components/DeleteClassroomDialog";

export async function loader({ request }: LoaderFunctionArgs) {
  const token = await requireSessionToken(request);
  if (!env.PLATFORM) {
    return {
      groups: [] as ClassroomRowGroup[],
      error:
        "Platform is not configured. Please contact your administrator.",
      page: 1,
      hasMore: false,
    };
  }
  const page = readPageFromRequest(request);
  const skip = (page - 1) * ADMIN_LIST_PAGE_SIZE;
  const result = await safe(
    gqlClient.request(
      GroupFindManyDocument,
      {
        filter: { platform: env.PLATFORM },
        limit: ADMIN_LIST_PAGE_SIZE,
        skip,
      },
      { "access-token": token },
    ),
  );
  const groups: ClassroomRowGroup[] = result.ok
    ? (result.data.GroupFindMany ?? []).filter(
        (g): g is NonNullable<typeof g> => g != null,
      )
    : [];
  return {
    groups,
    error: result.error,
    page,
    hasMore: groups.length === ADMIN_LIST_PAGE_SIZE,
  };
}

export default function AdminClassroomsRoute() {
  const {
    groups,
    error: loadError,
    page,
    hasMore,
  } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const revalidator = useRevalidator();

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
      setDeleteTarget(null);
      toast.success("Classroom deleted");
      revalidator.revalidate();
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

      {hasMore || page > 1 ? (
        <AdminListPagination
          page={page}
          hasMore={hasMore}
          loading={navigation.state !== "idle"}
          onPrev={() => navigate(`?page=${page - 1}`)}
          onNext={() => navigate(`?page=${page + 1}`)}
        />
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
