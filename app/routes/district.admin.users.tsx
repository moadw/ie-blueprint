import { useState } from "react";
import { useLoaderData, useNavigate, useNavigation } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { Loader2 } from "lucide-react";
import {
  ADMIN_LIST_PAGE_SIZE,
  AdminListPagination,
} from "~/components/admin/admin-list-pagination";
import { resolveDistrictAdmin } from "~/lib/district-admin.server";
import { env } from "~/lib/env";
import { gqlClient } from "~/lib/graphql";
import { readPageFromRequest } from "~/lib/pagination";
import { safe } from "~/lib/safe-loader";
import { SchoolFindManyDocument } from "~/queries/schools";
import {
  UserSearchDocument,
  UserTypesFindManyDocument,
} from "~/queries/users";
import { DistrictDownloadUsersButton } from "~/routes/district.admin/_components/district-download-users-button";
import { DistrictUserCoursesDialog } from "~/routes/district.admin/_components/district-user-courses-dialog";
import { DistrictUsersFilterBar } from "~/routes/district.admin/_components/district-users-filter-bar";
import { DistrictUsersTable } from "~/routes/district.admin/_components/district-users-table";
import type { UserSearchQuery } from "~/gql/graphql";

export type DistrictUserRow = NonNullable<
  NonNullable<NonNullable<UserSearchQuery["UserSearch"]>["data"]>[number]
>;

type UserTypeOption = { _id: string; label?: string | null };
type SchoolOption = {
  _id: string;
  name?: string | null;
  city?: string | null;
  state?: string | null;
  deletedAt?: string | null;
};

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const schoolId = url.searchParams.get("school") || undefined;
  const type = url.searchParams.get("role") || undefined;
  const search = url.searchParams.get("query") || undefined;
  const filters = {
    role: type,
    school: schoolId,
    query: search,
  };

  const page = readPageFromRequest(request);

  const result = await resolveDistrictAdmin(request);
  if (result.loadError || !result.district) {
    return {
      district: null,
      users: [] as DistrictUserRow[],
      total: 0,
      userTypes: [] as UserTypeOption[],
      schools: [] as SchoolOption[],
      filters,
      page,
      hasMore: false,
      loadError: result.loadError ?? "Could not resolve district.",
    };
  }

  const { token, district } = result;
  const skip = (page - 1) * ADMIN_LIST_PAGE_SIZE;

  const [searchResult, userTypesResult, schoolsResult] = await Promise.all([
    safe(
      gqlClient.request(
        UserSearchDocument,
        {
          ...(district.organization ? { organizationId: district.organization } : {}),
          ...(type ? { type } : {}),
          ...(search ? { search } : {}),
          ...(schoolId ? { schoolId } : {}),
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
        SchoolFindManyDocument,
        { filter: { district: district._id, platform: env.PLATFORM }, limit: 500 },
        { "access-token": token },
      ),
    ),
  ]);

  const users: DistrictUserRow[] = searchResult.ok
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
  const schools: SchoolOption[] = schoolsResult.ok
    ? (schoolsResult.data.SchoolFindMany ?? []).filter(
        (s): s is NonNullable<typeof s> => s != null,
      )
    : [];

  return {
    district,
    users,
    total,
    userTypes,
    schools,
    filters,
    page,
    hasMore: users.length === ADMIN_LIST_PAGE_SIZE,
    loadError: searchResult.error,
  };
}

export default function DistrictAdminUsersRoute() {
  const {
    district,
    users,
    total,
    loadError,
    page,
    hasMore,
    filters,
    userTypes,
    schools,
  } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const navigate = useNavigate();

  const [coursesTarget, setCoursesTarget] = useState<DistrictUserRow | null>(
    null,
  );

  const isInitialLoading =
    navigation.state === "loading" && users.length === 0;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-foreground">
          Users ({total})
        </h3>
        {total > 0 && district?.organization ? (
          <DistrictDownloadUsersButton
            total={total}
            organizationId={district.organization}
          />
        ) : null}
      </div>

      <DistrictUsersFilterBar
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
      ) : (
        <DistrictUsersTable
          users={users}
          onViewCourses={setCoursesTarget}
        />
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

      <DistrictUserCoursesDialog
        target={coursesTarget}
        onOpenChange={(open) => {
          if (!open) setCoursesTarget(null);
        }}
      />
    </div>
  );
}
