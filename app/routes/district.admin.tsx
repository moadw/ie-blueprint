import { useState } from "react";
import { useLoaderData, useNavigate, useNavigation } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { Loader2 } from "lucide-react";
import {
  ADMIN_LIST_PAGE_SIZE,
  AdminListPagination,
} from "~/components/admin/admin-list-pagination";
import { env } from "~/lib/env";
import { gqlClient } from "~/lib/graphql";
import { readPageFromRequest } from "~/lib/pagination";
import { safe } from "~/lib/safe-loader";
import { requireSessionToken } from "~/lib/session.server";
import { DistrictFindOneDocument } from "~/queries/districts";
import { SchoolCodeFindManyDocument } from "~/queries/school-codes";
import { SchoolFindManyDocument } from "~/queries/schools";
import {
  UserSearchDocument,
  UserTypesFindManyDocument,
  UsersFindOneDocument,
} from "~/queries/users";
import { DistrictDownloadUsersButton } from "~/routes/district.admin/_components/district-download-users-button";
import { DistrictInviteCard } from "~/routes/district.admin/_components/district-invite-card";
import { DistrictSchoolsGrid } from "~/routes/district.admin/_components/district-schools-grid";
import { DistrictUserCoursesDialog } from "~/routes/district.admin/_components/district-user-courses-dialog";
import { DistrictUsersFilterBar } from "~/routes/district.admin/_components/district-users-filter-bar";
import { DistrictUsersTable } from "~/routes/district.admin/_components/district-users-table";
import type { UserSearchQuery } from "~/gql/graphql";

type DistrictInfo = {
  _id: string;
  name: string | null;
  organization: string | null;
};

type UserTypeOption = { _id: string; label?: string | null };
type SchoolOption = {
  _id: string;
  name?: string | null;
  city?: string | null;
  state?: string | null;
  deletedAt?: string | null;
};
type InviteOption = { _id: string; code: string };

export type DistrictUserRow = NonNullable<
  NonNullable<NonNullable<UserSearchQuery["UserSearch"]>["data"]>[number]
>;

export async function loader({ request }: LoaderFunctionArgs) {
  const token = await requireSessionToken(request);
  const url = new URL(request.url);
  const schoolId = url.searchParams.get("school") || undefined;
  const type = url.searchParams.get("role") || undefined;
  const search = url.searchParams.get("query") || undefined;
  const filters = {
    role: type,
    school: schoolId,
    query: search,
  };

  if (!env.PLATFORM) {
    return {
      district: null as DistrictInfo | null,
      users: [] as DistrictUserRow[],
      total: 0,
      userTypes: [] as UserTypeOption[],
      schools: [] as SchoolOption[],
      invite: null as InviteOption | null,
      filters,
      page: 1,
      hasMore: false,
      loadError:
        "Platform is not configured. Please contact your administrator.",
    };
  }

  const page = readPageFromRequest(request);

  // Llamada 1a: obtener la organización del usuario (secuencial)
  const userResult = await safe(
    gqlClient.request(UsersFindOneDocument, {}, { "access-token": token }),
  );

  if (!userResult.ok || !userResult.data.UsersFindOne?.organization) {
    return {
      district: null as DistrictInfo | null,
      users: [] as DistrictUserRow[],
      total: 0,
      userTypes: [] as UserTypeOption[],
      schools: [] as SchoolOption[],
      invite: null as InviteOption | null,
      filters,
      page,
      hasMore: false,
      loadError: userResult.ok
        ? "Could not resolve user organization."
        : userResult.error,
    };
  }

  const organization = userResult.data.UsersFindOne.organization;

  // Llamada 1b: resolver el distrito por organización (secuencial).
  // Sin filtro de platform: paridad con MTW (DistrictFindOne solo por
  // organization) — el registro del distrito puede tener platform distinto.
  const districtResult = await safe(
    gqlClient.request(
      DistrictFindOneDocument,
      { filter: { organization } },
      { "access-token": token },
    ),
  );

  if (!districtResult.ok || !districtResult.data.DistrictFindOne) {
    return {
      district: null as DistrictInfo | null,
      users: [] as DistrictUserRow[],
      total: 0,
      userTypes: [] as UserTypeOption[],
      schools: [] as SchoolOption[],
      invite: null as InviteOption | null,
      filters,
      page,
      hasMore: false,
      loadError: districtResult.ok
        ? "Could not resolve district."
        : districtResult.error,
    };
  }

  const districtRaw = districtResult.data.DistrictFindOne;
  const district: DistrictInfo = {
    _id: districtRaw._id,
    name: districtRaw.name ?? null,
    organization: districtRaw.organization ?? null,
  };

  const skip = (page - 1) * ADMIN_LIST_PAGE_SIZE;

  // Llamadas 2-5: usuarios, tipos de usuario, escuelas, schoolcode (en paralelo)
  const [searchResult, userTypesResult, schoolsResult, schoolCodesResult] =
    await Promise.all([
      safe(
        gqlClient.request(
          UserSearchDocument,
          {
            ...(district.organization ? { organizationId: district.organization } : {}),
            platformId: env.PLATFORM,
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
      safe(
        gqlClient.request(
          SchoolCodeFindManyDocument,
          { filter: { district: district._id }, limit: 1 },
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
  const schoolCodes = schoolCodesResult.ok
    ? (schoolCodesResult.data.SchoolCodeFindMany ?? []).filter(
        (c): c is NonNullable<typeof c> => c != null,
      )
    : [];
  const firstCode = schoolCodes[0];
  const invite: InviteOption | null =
    firstCode && firstCode._id && firstCode.code
      ? { _id: firstCode._id, code: firstCode.code }
      : null;

  return {
    district,
    users,
    total,
    userTypes,
    schools,
    invite,
    filters,
    page,
    hasMore: users.length === ADMIN_LIST_PAGE_SIZE,
    loadError: searchResult.error,
  };
}

export default function DistrictAdminRoute() {
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
    invite,
  } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const navigate = useNavigate();

  const [coursesTarget, setCoursesTarget] = useState<DistrictUserRow | null>(
    null,
  );

  const isInitialLoading =
    navigation.state === "loading" && users.length === 0;

  return (
    <div className="p-6 max-w-5xl mx-auto w-full space-y-4">
      {district ? (
        <DistrictInviteCard
          districtId={district._id}
          districtName={district.name}
          invite={invite}
        />
      ) : null}

      {!loadError ? <DistrictSchoolsGrid schools={schools} /> : null}

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
