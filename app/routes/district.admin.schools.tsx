import { Suspense } from "react";
import { Await, useLoaderData, useNavigation } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { Loader2 } from "lucide-react";
import {
  dailyWindow,
  getSchoolActiveEducators,
  getSchoolTotalPlays,
} from "~/lib/amplitude.server";
import { env } from "~/lib/env";
import { gqlClient } from "~/lib/graphql";
import { resolveDistrictAdmin } from "~/lib/district-admin.server";
import { safe } from "~/lib/safe-loader";
import { MyOrganizationFindOneDocument } from "~/queries/organization";
import { SchoolFindManyDocument } from "~/queries/schools";
import { DistrictInviteCard } from "~/routes/district.admin/_components/district-invite-card";
import {
  DistrictSchoolsGrid,
  type SchoolStatsMap,
} from "~/routes/district.admin/_components/district-schools-grid";

type SchoolOption = {
  _id: string;
  name?: string | null;
  city?: string | null;
  state?: string | null;
  deletedAt?: string | null;
};
type OrganizationInvite = { code: string | null; name: string | null };

/**
 * Per-school engagement stats for the cards, streamed in behind a skeleton so
 * the (slow) Amplitude round-trips never block the page. Both figures come from
 * the same helpers the school-detail page uses:
 *  - `teachers` = distinct teachers who fired ANY event ("accessed"), NOT the
 *    roster count — a school with 0 accessed teachers reads as "Pending".
 *  - `plays`    = `practice_completed` count.
 * `dailyWindow(365)` is the bounded all-time stand-in (same choice as the detail
 * page). Each figure soft-fails to `null` → the card renders "—" and, since
 * activity can't be confirmed, the badge falls back to "Pending". This promise
 * ALWAYS resolves (never rejects): a rejected promise reaching `<Await>` without
 * an `errorElement` would white-screen the route via the root ErrorBoundary.
 */
async function loadSchoolStats(
  schools: SchoolOption[],
  window: { start: string; end: string },
): Promise<SchoolStatsMap> {
  const entries = await Promise.all(
    schools.map(async (s) => {
      const [teachers, plays] = await Promise.all([
        safe(getSchoolActiveEducators(s._id, window)),
        safe(getSchoolTotalPlays(s._id, window)),
      ]);
      return [
        s._id,
        {
          teachers: teachers.ok ? teachers.data : null,
          plays: plays.ok ? plays.data : null,
        },
      ] as const;
    }),
  );
  return Object.fromEntries(entries);
}

export async function loader({ request }: LoaderFunctionArgs) {
  const result = await resolveDistrictAdmin(request);
  if (result.loadError || !result.district) {
    return {
      district: null,
      schools: [] as SchoolOption[],
      schoolStats: Promise.resolve<SchoolStatsMap>({}),
      organization: null as OrganizationInvite | null,
      organizationError: null as string | null,
      previewHidden: result.preview,
      loadError: result.loadError ?? "Could not resolve district.",
      preview: result.preview,
    };
  }

  const { token, district, preview } = result;

  const schoolsResult = await safe(
    gqlClient.request(
      SchoolFindManyDocument,
      { filter: { district: district._id, platform: env.PLATFORM }, limit: 500 },
      { "access-token": token },
    ),
  );

  const schools: SchoolOption[] = schoolsResult.ok
    ? (schoolsResult.data.SchoolFindMany ?? []).filter(
        (s): s is NonNullable<typeof s> => s != null,
      )
    : [];

  // Fired UN-awaited so the cards' teacher/play figures stream in behind a
  // skeleton instead of blocking the whole page on the Amplitude calls.
  const schoolStats = loadSchoolStats(schools, dailyWindow(365));

  // Master-admin district preview: `MyOrganizationFindOne` takes no arguments and
  // scopes to the *session user's* organization (the master admin), NOT the
  // previewed district. So skip the query and hide the invite section entirely
  // in preview — a foreign/own org code would be misleading here.
  if (preview) {
    return {
      district,
      schools,
      schoolStats,
      organization: null as OrganizationInvite | null,
      organizationError: null as string | null,
      previewHidden: true,
      loadError: schoolsResult.error,
      preview,
    };
  }

  const orgResult = await safe(
    gqlClient.request(MyOrganizationFindOneDocument, {}, { "access-token": token }),
  );
  const org = orgResult.ok ? orgResult.data.MyOrganizationFindOne : null;
  const organization: OrganizationInvite | null = org
    ? { code: org.code ?? null, name: org.name ?? null }
    : null;

  return {
    district,
    schools,
    schoolStats,
    organization,
    organizationError: orgResult.ok ? null : orgResult.error,
    previewHidden: false,
    loadError: schoolsResult.error,
    preview,
  };
}

export default function DistrictAdminSchoolsRoute() {
  const {
    district,
    schools,
    schoolStats,
    organization,
    organizationError,
    loadError,
    preview,
  } = useLoaderData<typeof loader>();
  const navigation = useNavigation();

  const isInitialLoading =
    navigation.state === "loading" && schools.length === 0;

  return (
    <div className="space-y-6">
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
            Couldn't load schools
          </p>
          <p className="text-xs text-red-600">{loadError}</p>
        </div>
      ) : (
        <>
          {district ? (
            <DistrictInviteCard
              organization={organization}
              districtName={district?.name ?? null}
              error={organizationError}
              readOnly={preview}
            />
          ) : null}
          {/* Card layout + names render immediately; the teacher/play figures
              and the "(X of Y active)" header count stream in behind a skeleton.
              The deferred promise never rejects; the `errorElement` only covers
              an SSR stream-timeout abort, degrading to unknown stats (—). */}
          <Suspense fallback={<DistrictSchoolsGrid schools={schools} loading />}>
            <Await
              resolve={schoolStats}
              errorElement={<DistrictSchoolsGrid schools={schools} stats={{}} />}
            >
              {(stats) => (
                <DistrictSchoolsGrid schools={schools} stats={stats} />
              )}
            </Await>
          </Suspense>
        </>
      )}
    </div>
  );
}
