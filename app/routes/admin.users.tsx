import { useState } from "react";
import {
  useLoaderData,
  useNavigate,
  useNavigation,
  useRevalidator,
} from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { Loader2, Plus, Upload, Users } from "lucide-react";
import { toast } from "sonner";
import {
  ADMIN_LIST_PAGE_SIZE,
  AdminListPagination,
} from "~/components/admin/admin-list-pagination";
import { ConfirmDialog } from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { env } from "~/lib/env";
import { toErrorMessage } from "~/lib/errors";
import { gqlClient } from "~/lib/graphql";
import { readPageFromRequest } from "~/lib/pagination";
import { safe } from "~/lib/safe-loader";
import { requireSessionToken } from "~/lib/session.server";
import {
  DistrictFindManyDocument,
  DistrictFindOneDocument,
} from "~/queries/districts";
import { SchoolFindManyDocument } from "~/queries/schools";
import { DeleteUsersManyDocument } from "~/mutations/users";
import {
  UserSearchDocument,
  UserTypesFindManyDocument,
} from "~/queries/users";
import { DownloadUsersButton } from "./admin.users/_components/DownloadUsersButton";
import { ImportUsersDialog } from "./admin.users/_components/ImportUsersDialog";
import { SetPasswordDialog } from "./admin.users/_components/SetPasswordDialog";
import { UserDialog } from "./admin.users/_components/UserDialog";
import {
  UserRow,
  UsersTableHeader,
} from "./admin.users/_components/UserRow";
import type { AdminUserRow } from "./admin.users/_components/UserRow";
import { UserSchoolsDialog } from "./admin.users/_components/UserSchoolsDialog";
import { UsersFilterBar } from "./admin.users/_components/UsersFilterBar";

type DistrictOption = {
  _id: string;
  name?: string | null;
  organization?: string | null;
};
type UserTypeOption = {
  _id: string;
  label?: string | null;
  identifier?: string | null;
};

// Roles not scoped to schools — their rows hide the manage-schools control.
const SCHOOL_LESS_ROLE_IDENTIFIERS = new Set(["admin", "district-admin"]);
type SchoolOption = { _id: string; name?: string | null };

export async function loader({ request }: LoaderFunctionArgs) {
  const token = await requireSessionToken(request);
  const url = new URL(request.url);
  const districtId = url.searchParams.get("district") || undefined;
  const schoolId = url.searchParams.get("school") || undefined;
  const type = url.searchParams.get("role") || undefined;
  const search = url.searchParams.get("query") || undefined;
  const filters = {
    district: districtId,
    role: type,
    school: schoolId,
    query: search,
  };
  if (!env.PLATFORM) {
    return {
      users: [] as AdminUserRow[],
      total: 0,
      error: "Platform is not configured. Please contact your administrator.",
      page: 1,
      hasMore: false,
      userTypes: [] as UserTypeOption[],
      districts: [] as DistrictOption[],
      schools: [] as SchoolOption[],
      filters,
    };
  }
  const page = readPageFromRequest(request);
  const skip = (page - 1) * ADMIN_LIST_PAGE_SIZE;

  // Users carry `organization`, not `district` — resolve the selected district
  // to its organization and scope UserSearch by that. Only runs when a district
  // filter is active, so the unfiltered default view stays fully parallel.
  let organizationId: string | undefined;
  if (districtId) {
    const orgResult = await safe(
      gqlClient.request(
        DistrictFindOneDocument,
        { filter: { _id: districtId } },
        { "access-token": token },
      ),
    );
    organizationId = orgResult.ok
      ? (orgResult.data.DistrictFindOne?.organization ?? undefined)
      : undefined;
  }

  const [searchResult, userTypesResult, districtsResult, schoolsResult] =
    await Promise.all([
      safe(
        gqlClient.request(
          UserSearchDocument,
          {
            platformId: env.PLATFORM,
            ...(organizationId ? { organizationId } : {}),
            ...(schoolId ? { schoolId } : {}),
            ...(type ? { type } : {}),
            ...(search ? { search } : {}),
            sortBy: "createdAt",
            sortOrder: -1,
            limit: ADMIN_LIST_PAGE_SIZE,
            skip,
          },
          { "access-token": token },
        ),
      ),
      safe(
        gqlClient.request(
          UserTypesFindManyDocument,
          { limit: 100 },
          { "access-token": token },
        ),
      ),
      safe(
        gqlClient.request(
          DistrictFindManyDocument,
          { filter: { platform: env.PLATFORM }, limit: 500 },
          { "access-token": token },
        ),
      ),
      districtId
        ? safe(
            gqlClient.request(
              SchoolFindManyDocument,
              { filter: { district: districtId }, limit: 500 },
              { "access-token": token },
            ),
          )
        : Promise.resolve({
            ok: true as const,
            data: { SchoolFindMany: [] as SchoolOption[] },
            error: null,
          }),
    ]);
  const users: AdminUserRow[] = searchResult.ok
    ? (searchResult.data.UserSearch?.data ?? []).filter(
        (u): u is NonNullable<typeof u> => u != null,
      )
    : [];
  const total = searchResult.ok
    ? (searchResult.data.UserSearch?.total ?? 0)
    : 0;
  const userTypes: UserTypeOption[] = userTypesResult.ok
    ? (userTypesResult.data.UserTypesFindMany ?? []).filter(
        (t): t is NonNullable<typeof t> => t != null,
      )
    : [];
  const districts: DistrictOption[] = districtsResult.ok
    ? (districtsResult.data.DistrictFindMany ?? []).filter(
        (d): d is NonNullable<typeof d> => d != null,
      )
    : [];
  const schools: SchoolOption[] = schoolsResult.ok
    ? (schoolsResult.data.SchoolFindMany ?? []).filter(
        (s): s is NonNullable<typeof s> => s != null,
      )
    : [];
  return {
    users,
    total,
    error: searchResult.error,
    page,
    hasMore: users.length === ADMIN_LIST_PAGE_SIZE,
    userTypes,
    districts,
    schools,
    filters,
  };
}

export default function AdminUsersRoute() {
  const {
    users,
    total,
    error: loadError,
    page,
    hasMore,
    userTypes,
    districts,
    schools,
    filters,
  } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const navigate = useNavigate();
  const revalidator = useRevalidator();

  // All seven dialog state hooks declared up-front so downstream steps (3-11)
  // can mount their dialogs into the placeholder slots below without
  // re-touching this region. Setters are wired into UserRow callbacks and the
  // disabled header buttons so no `@typescript-eslint/no-unused-vars`
  // suppression is needed.
  const [createOpen, setCreateOpen] = useState<boolean>(false);
  const [editTarget, setEditTarget] = useState<AdminUserRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminUserRow | null>(null);
  const [passwordTarget, setPasswordTarget] = useState<AdminUserRow | null>(
    null,
  );
  const [schoolsTarget, setSchoolsTarget] = useState<AdminUserRow | null>(null);
  const [importOpen, setImportOpen] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);

  // Reference state values so the strict TS `noUnusedLocals`-equivalent stays
  // quiet until downstream steps consume them. Once steps 4/5/6/7/8/10 land,
  // these `void` lines disappear in favour of real dialog mounts.

  // Keep the manage-schools dialog open across mutations by reading the
  // freshest copy of the targeted user from the loader payload on every
  // render. After a successful add/remove the parent revalidates; `users`
  // updates with the new schools cell, and we hand that to the dialog as
  // the new `target` while keeping it visually open.
  const schoolsRefreshed = schoolsTarget
    ? (users.find((u) => u.userId === schoolsTarget.userId) ?? schoolsTarget)
    : null;

  // usertype ids whose role isn't school-scoped (admin / district-admin) — used
  // to hide the per-row manage-schools control for those users.
  const schoolLessTypeIds = new Set(
    userTypes
      .filter((t) => SCHOOL_LESS_ROLE_IDENTIFIERS.has(t.identifier ?? ""))
      .map((t) => t._id),
  );

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    const target = deleteTarget;
    setDeleting(true);
    try {
      await gqlClient.request(DeleteUsersManyDocument, {
        users: [target.userId ?? ""],
      });
      toast.success("User deleted");
      setDeleteTarget(null);
      revalidator.revalidate();
    } catch (err) {
      toast.error(toErrorMessage(err, "Failed to delete user"));
    } finally {
      setDeleting(false);
    }
  }

  const isInitialLoading =
    navigation.state === "loading" && users.length === 0;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-foreground">
          Users ({total})
        </h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setImportOpen(true)}
            className="h-10 px-4 text-sm gap-1.5"
          >
            <Upload className="w-4 h-4" aria-hidden="true" /> Import Users
          </Button>
          <DownloadUsersButton total={total} />
          <Button
            variant="primary"
            onClick={() => setCreateOpen(true)}
            className="h-10 px-4 text-sm gap-1.5"
          >
            <Plus className="w-4 h-4" aria-hidden="true" /> Create User
          </Button>
        </div>
      </div>

      <UsersFilterBar
        districts={districts}
        userTypes={userTypes}
        schools={schools}
        filters={filters}
      />

      {isInitialLoading ? (
        <div className="flex justify-center py-12">
          <Loader2
            className="w-6 h-6 animate-spin text-muted-foreground"
            aria-hidden="true"
          />
        </div>
      ) : loadError ? (
        <div className="rounded-xl border-2 border-dashed border-red-200 bg-red-50 py-10 text-center">
          <p className="mb-1 text-sm font-medium text-red-700">
            Couldn't load users
          </p>
          <p className="text-xs text-red-600">{loadError}</p>
        </div>
      ) : users.length === 0 ? (
        <div className="bg-card rounded-lg border border-border p-12 text-center">
          <Users
            className="w-10 h-10 text-muted-foreground mx-auto mb-3"
            aria-hidden="true"
          />
          <p className="text-muted-foreground">No users yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          <UsersTableHeader />
          {users.map((u) => (
            <UserRow
              key={u.userId ?? `${u.email}-${u.createdAt}`}
              user={u}
              onEdit={setEditTarget}
              onDelete={setDeleteTarget}
              onSetPassword={setPasswordTarget}
              onManageSchools={setSchoolsTarget}
              canManageSchools={!schoolLessTypeIds.has(u.type_id ?? "")}
            />
          ))}
        </div>
      )}

      {(hasMore || page > 1) && !filters.query ? (
        <AdminListPagination
          page={page}
          hasMore={hasMore}
          loading={navigation.state !== "idle"}
          onPrev={() => navigate(`?page=${page - 1}`)}
          onNext={() => navigate(`?page=${page + 1}`)}
        />
      ) : null}

      {/* Dialog mount placeholders — downstream steps land their dialogs here.
          Order is contract; do not reorder without updating each leaf step. */}
      <UserDialog
        open={createOpen || editTarget !== null}
        target={editTarget}
        districts={districts}
        onOpenChange={(open) => {
          if (!open) {
            setCreateOpen(false);
            setEditTarget(null);
          }
        }}
        onSaved={() => revalidator.revalidate()}
      />
      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title={
          <>
            Delete{" "}
            <span className="font-medium">
              {deleteTarget?.firstName} {deleteTarget?.lastName}
            </span>
            ?
          </>
        }
        description="You are about to remove this user. This action cannot be undone."
        variant="destructive"
        confirmLabel="Delete user"
        cancelLabel="Cancel"
        loading={deleting}
        onConfirm={handleConfirmDelete}
      />
      <SetPasswordDialog
        target={passwordTarget}
        onOpenChange={(open) => {
          if (!open) setPasswordTarget(null);
        }}
      />
      <UserSchoolsDialog
        target={schoolsRefreshed}
        onOpenChange={(open) => {
          if (!open) setSchoolsTarget(null);
        }}
        onChanged={() => revalidator.revalidate()}
      />

      <ImportUsersDialog
        open={importOpen}
        onOpenChange={setImportOpen}
        onImported={() => revalidator.revalidate()}
      />
    </div>
  );
}
