import { ArrowLeft } from "lucide-react";
import { Link, useLoaderData } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { Badge } from "~/components/ui/badge";
import {
  dailyWindow,
  getSchoolActiveEducators,
  getSchoolTotalPlays,
} from "~/lib/amplitude.server";
import { resolveDistrictAdmin } from "~/lib/district-admin.server";
import { env } from "~/lib/env";
import { gqlClient } from "~/lib/graphql";
import { safe } from "~/lib/safe-loader";
import { SchoolFindOneDocument } from "~/queries/schools";
import {
  UserSearchDocument,
  UserTypesFindManyDocument,
} from "~/queries/users";
import { SchoolEducatorsTable } from "~/routes/district.school.$schoolId/_components/school-educators-table";
import { SchoolStatsRow } from "~/routes/district.school.$schoolId/_components/school-stats-row";
import type { UserSearchQuery } from "~/gql/graphql";

/** A single teacher row from `UserSearch` (non-null). */
export type SchoolEducatorRow = NonNullable<
  NonNullable<NonNullable<UserSearchQuery["UserSearch"]>["data"]>[number]
>;

/** The normalized school shape the detail page renders. */
type SchoolDetail = {
  _id: string;
  name: string | null;
  city: string | null;
  state: string | null;
  deletedAt: string | null;
};

const BACK_TO_SCHOOLS = "/district/admin/schools";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const schoolId = params.schoolId;

  const result = await resolveDistrictAdmin(request);
  if (result.loadError || !result.district) {
    return {
      school: null as SchoolDetail | null,
      educators: [] as SchoolEducatorRow[],
      teacherTotal: 0,
      totalPlays: null as number | null,
      activeEducators: null as number | null,
      error: result.loadError ?? "Could not resolve district.",
      notFound: false,
      preview: result.preview,
    };
  }

  const { token, district, preview } = result;

  // Missing param → treat as not-found rather than issuing a wildcard lookup
  // that could surface some other school.
  if (!schoolId) {
    return {
      school: null as SchoolDetail | null,
      educators: [] as SchoolEducatorRow[],
      teacherTotal: 0,
      totalPlays: null as number | null,
      activeEducators: null as number | null,
      error: null,
      notFound: true,
      preview,
    };
  }

  const schoolResult = await safe(
    gqlClient.request(
      SchoolFindOneDocument,
      { filter: { _id: schoolId } },
      { "access-token": token },
    ),
  );
  if (!schoolResult.ok) {
    return {
      school: null as SchoolDetail | null,
      educators: [] as SchoolEducatorRow[],
      teacherTotal: 0,
      totalPlays: null as number | null,
      activeEducators: null as number | null,
      error: schoolResult.error,
      notFound: false,
      preview,
    };
  }

  const rawSchool = schoolResult.data.SchoolFindOne;
  // Scope enforcement: a missing school OR one belonging to another district
  // must NOT leak — render the not-found state (do NOT throw, do NOT show it).
  if (!rawSchool || rawSchool.district !== district._id) {
    return {
      school: null as SchoolDetail | null,
      educators: [] as SchoolEducatorRow[],
      teacherTotal: 0,
      totalPlays: null as number | null,
      activeEducators: null as number | null,
      error: null,
      notFound: true,
      preview,
    };
  }

  const school: SchoolDetail = {
    _id: rawSchool._id,
    name: rawSchool.name ?? null,
    city: rawSchool.city ?? null,
    state: rawSchool.state ?? null,
    deletedAt: rawSchool.deletedAt ?? null,
  };

  // Resolve the teacher usertype id so the roster is narrowed to teachers. If
  // it can't be resolved, the search runs unnarrowed rather than crashing.
  const userTypesResult = await safe(
    gqlClient.request(
      UserTypesFindManyDocument,
      { limit: 100 },
      { "access-token": token },
    ),
  );
  const teacherTypeId = userTypesResult.ok
    ? (userTypesResult.data.UserTypesFindMany ?? []).find(
        (t) => t?.identifier === "teacher",
      )?._id
    : undefined;

  const searchResult = await safe(
    gqlClient.request(
      UserSearchDocument,
      {
        ...(district.organization
          ? { organizationId: district.organization }
          : {}),
        platformId: env.PLATFORM,
        schoolId,
        ...(teacherTypeId ? { type: teacherTypeId } : {}),
        sortBy: "createdAt",
        sortOrder: -1,
        limit: 100,
        skip: 0,
      },
      { "access-token": token },
    ),
  );

  const educators: SchoolEducatorRow[] = searchResult.ok
    ? (searchResult.data.UserSearch?.data ?? []).filter(
        (u): u is SchoolEducatorRow => u != null,
      )
    : [];
  const teacherTotal = searchResult.ok
    ? (searchResult.data.UserSearch?.total ?? educators.length)
    : educators.length;

  // Per-school engagement stats from Amplitude. `dailyWindow(365)` is the
  // bounded-window all-time stand-in (Dashboard REST needs a bounded range; the
  // prototype metric is "all-time" — same choice as `stats.server.ts`). Both
  // are `safe()`-wrapped AND already soft-fail to `null` internally, so an
  // Amplitude outage leaves the school/educators rendering untouched; the cards
  // just show "—".
  const window = dailyWindow(365);
  const [totalPlaysResult, activeEducatorsResult] = await Promise.all([
    safe(getSchoolTotalPlays(schoolId, window)),
    safe(getSchoolActiveEducators(schoolId, window)),
  ]);
  const totalPlays: number | null = totalPlaysResult.ok
    ? totalPlaysResult.data
    : null;
  const activeEducators: number | null = activeEducatorsResult.ok
    ? activeEducatorsResult.data
    : null;

  return {
    school,
    educators,
    teacherTotal,
    totalPlays,
    activeEducators,
    error: searchResult.error,
    notFound: false,
    preview,
  };
}

export default function DistrictSchoolDetailRoute() {
  const {
    school,
    educators,
    teacherTotal,
    totalPlays,
    activeEducators,
    error,
    notFound,
  } = useLoaderData<typeof loader>();

  // No school in hand: either scope-enforced not-found, or the district/school
  // fetch soft-failed. Both keep a back link so the page never dead-ends.
  if (!school) {
    return (
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <Link
          to={BACK_TO_SCHOOLS}
          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to Schools
        </Link>
        {notFound ? (
          <p className="mt-8 text-center text-muted-foreground">
            School not found.
          </p>
        ) : (
          <div className="rounded-xl border-2 border-dashed border-red-200 bg-red-50 py-10 text-center">
            <p className="mb-1 text-sm font-medium text-red-700">
              Couldn't load school
            </p>
            <p className="text-xs text-red-600">{error ?? "Please try again."}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Link
          to={BACK_TO_SCHOOLS}
          className="mt-1 p-1.5 rounded-lg hover:bg-muted transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          aria-label="Back to Schools"
        >
          <ArrowLeft
            className="h-4 w-4 text-muted-foreground"
            aria-hidden="true"
          />
        </Link>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-foreground">
              {school.name ?? "Unnamed School"}
            </h1>
            <Badge variant={school.deletedAt ? "neutral" : "active"}>
              {school.deletedAt ? "Inactive" : "Active"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            School overview and educator activity
          </p>
        </div>
      </div>

      <SchoolStatsRow
        teacherTotal={teacherTotal}
        totalPlays={totalPlays}
        activeEducators={activeEducators}
      />

      <div>
        <h2 className="text-sm font-semibold text-foreground mb-3">Educators</h2>
        {error ? (
          <div className="rounded-xl border-2 border-dashed border-red-200 bg-red-50 py-10 text-center">
            <p className="mb-1 text-sm font-medium text-red-700">
              Couldn't load educators
            </p>
            <p className="text-xs text-red-600">{error}</p>
          </div>
        ) : (
          <SchoolEducatorsTable educators={educators} />
        )}
      </div>
    </div>
  );
}
