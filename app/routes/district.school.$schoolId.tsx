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
import { gqlClient } from "~/lib/graphql";
import { safe } from "~/lib/safe-loader";
import { SchoolFindOneDocument } from "~/queries/schools";
import {
  UserSearchDocument,
  UserTypesFindManyDocument,
} from "~/queries/users";
import { SchoolEducatorsTable } from "~/routes/district.school.$schoolId/_components/school-educators-table";
import { SchoolStatsRow } from "~/routes/district.school.$schoolId/_components/school-stats-row";
import { SchoolTitleSelector } from "~/routes/district.school.$schoolId/_components/school-title-selector";
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

/**
 * Fire a per-school Amplitude stat as a deferred promise that ALWAYS resolves
 * (never rejects): `safe()` covers any throw, and the helpers already soft-fail
 * to `null`. A rejected promise reaching an `<Await>` without an `errorElement`
 * would white-screen the route via the root ErrorBoundary — the resilient-loader
 * convention forbids that. On any throw / soft-fail this resolves to `null` → "—".
 */
async function deferStat(p: Promise<number | null>): Promise<number | null> {
  const r = await safe(p);
  return r.ok ? r.data : null;
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  const schoolId = params.schoolId;

  const result = await resolveDistrictAdmin(request);
  const { token, district, preview, role, schools } = result;

  // Hard failure (auth/user/district/school-list resolution) — never throw,
  // degrade to the not-found/error card.
  if (result.loadError) {
    return {
      school: null as SchoolDetail | null,
      educators: [] as SchoolEducatorRow[],
      teacherTotal: 0,
      totalPlays: Promise.resolve<number | null>(null),
      activeEducators: Promise.resolve<number | null>(null),
      error: result.loadError,
      notFound: false,
      preview,
      role,
      schools,
    };
  }

  // A district-admin/preview caller needs a resolved district; a school-admin
  // has no district concept — their scope is `schools`/`schoolIds` instead
  // (checked below, once the school itself is in hand).
  if (role !== "school-admin" && !district) {
    return {
      school: null as SchoolDetail | null,
      educators: [] as SchoolEducatorRow[],
      teacherTotal: 0,
      totalPlays: Promise.resolve<number | null>(null),
      activeEducators: Promise.resolve<number | null>(null),
      error: "Could not resolve district.",
      notFound: false,
      preview,
      role,
      schools,
    };
  }

  // Missing param → treat as not-found rather than issuing a wildcard lookup
  // that could surface some other school.
  if (!schoolId) {
    return {
      school: null as SchoolDetail | null,
      educators: [] as SchoolEducatorRow[],
      teacherTotal: 0,
      totalPlays: Promise.resolve<number | null>(null),
      activeEducators: Promise.resolve<number | null>(null),
      error: null,
      notFound: true,
      preview,
      role,
      schools,
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
      totalPlays: Promise.resolve<number | null>(null),
      activeEducators: Promise.resolve<number | null>(null),
      error: schoolResult.error,
      notFound: false,
      preview,
      role,
      schools,
    };
  }

  const rawSchool = schoolResult.data.SchoolFindOne;
  // Scope enforcement — role-branched: a district-admin/preview caller must
  // own the district the school belongs to; a school-admin must have the
  // school in their own `schoolIds`/`schools` list. Either way, a school
  // outside scope must NOT leak — render the not-found state (do NOT throw,
  // do NOT show it).
  const inScope =
    rawSchool != null &&
    (role === "school-admin"
      ? (schools ?? []).some((s) => s._id === rawSchool._id)
      : district != null && rawSchool.district === district._id);
  if (!rawSchool || !inScope) {
    return {
      school: null as SchoolDetail | null,
      educators: [] as SchoolEducatorRow[],
      teacherTotal: 0,
      totalPlays: Promise.resolve<number | null>(null),
      activeEducators: Promise.resolve<number | null>(null),
      error: null,
      notFound: true,
      preview,
      role,
      schools,
    };
  }

  const school: SchoolDetail = {
    _id: rawSchool._id,
    name: rawSchool.name ?? null,
    city: rawSchool.city ?? null,
    state: rawSchool.state ?? null,
    deletedAt: rawSchool.deletedAt ?? null,
  };

  // Per-school engagement stats from Amplitude, fired UN-awaited so they stream
  // in behind skeletons instead of blocking the page on the (slow) Amplitude
  // calls — they now run concurrently with the educators search below.
  // `dailyWindow(365)` is the bounded-window all-time stand-in (Dashboard REST
  // needs a bounded range; the prototype metric is "all-time" — same choice as
  // `stats.server.ts`). `deferStat` normalizes each to `number | null` and never
  // rejects in normal operation; the route's `<Await errorElement>` covers an SSR
  // stream-timeout abort. An Amplitude outage just leaves the tiles showing "—".
  const statsWindow = dailyWindow(365);
  const totalPlays = deferStat(getSchoolTotalPlays(school._id, statsWindow));
  const activeEducators = deferStat(
    getSchoolActiveEducators(school._id, statsWindow),
  );

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
        ...(district?.organization
          ? { organizationId: district.organization }
          : {}),
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

  return {
    school,
    educators,
    teacherTotal,
    // Deferred (fired above) — the route streams these two tiles behind skeletons.
    totalPlays,
    activeEducators,
    error: searchResult.error,
    notFound: false,
    preview,
    role,
    schools,
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
    role,
    schools,
  } = useLoaderData<typeof loader>();

  // A school-admin's "Admin" tab lands directly on this page — there's no
  // Schools list of theirs to go "back" to (unlike a district-admin's
  // `/district/admin/schools`), so the back link is district-admin/preview only.
  const showBackLink = role !== "school-admin";
  // Only a school-admin ever gets a non-null `schools` list; the title becomes
  // a switcher only once they have more than one (single-school stays a plain
  // `<h1>`, same as every district-admin).
  const schoolOptions = role === "school-admin" ? (schools ?? []) : [];

  // No school in hand: either scope-enforced not-found, or the district/school
  // fetch soft-failed. Both keep a back link so the page never dead-ends
  // (district-admin/preview only — see `showBackLink` above).
  if (!school) {
    return (
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        {showBackLink ? (
          <Link
            to={BACK_TO_SCHOOLS}
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to Schools
          </Link>
        ) : null}
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
        {showBackLink ? (
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
        ) : null}
        <div>
          <div className="flex items-center gap-3">
            {schoolOptions.length > 1 ? (
              <SchoolTitleSelector
                schools={schoolOptions}
                currentSchoolId={school._id}
                currentSchoolName={school.name ?? "Unnamed School"}
              />
            ) : (
              <h1 className="text-xl font-bold text-foreground">
                {school.name ?? "Unnamed School"}
              </h1>
            )}
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
