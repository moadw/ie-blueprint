/**
 * Deferred loader for the district-home analytics cluster.
 *
 * Mirrors the proven streaming pattern from the district-analytics loader:
 * awaits only the cheap, synchronous data (district resolution + licensed-schools
 * count), fires every slow Amplitude / GraphQL fetch UN-awaited, and returns
 * each of the four home regions as a per-card promise the route streams in
 * behind skeletons.
 *
 * INTENTIONALLY self-contained: it does NOT import from the concurrently-edited
 * district-analytics loader module. The 7-line never-reject `deferCard` and the
 * structural card types are copied locally so the home never couples to that
 * moving file.
 *
 * Every per-region promise ALWAYS resolves (never rejects) — a rejected promise
 * reaching an `<Await>` without an `errorElement` would white-screen the whole
 * route via the root ErrorBoundary. `deferCard` resolves each region to its
 * honest empty shape on any throw (CLAUDE.md "Resilient loaders").
 */
import { env } from "~/lib/env";
import { gqlClient } from "~/lib/graphql";
import { resolveDistrictAdmin } from "~/lib/district-admin.server";
import { getSchoolRosterTotal } from "~/lib/school-roster.server";
import { safe } from "~/lib/safe-loader";
import { UserTotalsFindManyDocument } from "~/queries/analytics";
import { SchoolFindManyDocument } from "~/queries/schools";
import { UsersByOrganizationTotalDocument } from "~/queries/users";
import {
  dailyWindow,
  getActiveSchoolsCount,
  getActiveUsersTotal,
  getCompletedUsersTotal,
  getContentPlayedTotal,
  getEngagedUsersTotal,
  getMindfulSecondsSeries,
  windowFromISO,
} from "~/lib/amplitude.server";

// ---------------------------------------------------------------------------
// Structural types (local — never imported from the moving analytics module)
// ---------------------------------------------------------------------------

/** Minimal district identity the route needs (Hero data comes from the parent). */
export interface DistrictInfo {
  _id: string;
  name: string | null;
  organization: string | null;
}

/** One stage of the User Adoption funnel (Registered → Active → Engaged). */
export interface FunnelStage {
  key: string;
  label: string;
  value: number;
}

/** School Registration card: schools active this year vs licensed schools. */
export interface SchoolRegistration {
  registered: number;
  licensed: number;
}

/** Practice Sessions card: current-school-year plays vs prior-school-year plays. */
export interface PracticeSessions {
  current: number;
  previous: number;
}

/**
 * Annual Engagement Arc panel props.
 *  - `activeUserRate`      = completed-users ÷ org users (0–100), same formula
 *                            as the current home.
 *  - `priorWeekDeltaPct`   = magnitude of the week-over-week active-users change
 *                            (sign carried by `priorWeekDirection`).
 *  - `priorWeekDirection`  = "up" when this week ≥ last week, else "down".
 *  - `ytdMindfulLabel`     = formatted YTD mindful minutes ("x.xk" ≥ 1000).
 *  - `gaugeScore`          = arc fill (0–100); reuses `activeUserRate`.
 */
export interface HomeEngagement {
  activeUserRate: number;
  priorWeekDeltaPct: number;
  priorWeekDirection: "up" | "down";
  ytdMindfulLabel: string;
  gaugeScore: number;
}

/** The four regions the route streams in behind skeletons. */
export interface DistrictHomeDeferred {
  adoptionFunnel: Promise<FunnelStage[]>;
  schoolRegistration: Promise<SchoolRegistration>;
  practiceSessions: Promise<PracticeSessions>;
  engagement: Promise<HomeEngagement>;
}

// Honest empty shape for the engagement panel — the deferCard fallback and the
// no-data branch. No invented numbers (0% rate, flat delta, "0" gauge center).
const EMPTY_ENGAGEMENT: HomeEngagement = {
  activeUserRate: 0,
  priorWeekDeltaPct: 0,
  priorWeekDirection: "up",
  ytdMindfulLabel: "0",
  gaugeScore: 0,
};

// ---------------------------------------------------------------------------
// Local helpers
// ---------------------------------------------------------------------------

/**
 * Wrap a per-region async build so it ALWAYS resolves (never rejects): `safe()`
 * covers the fetch, but post-fetch shaping can still throw. A rejected promise
 * reaching an `<Await>` without an `errorElement` white-screens the route via
 * the root ErrorBoundary — forbidden by the resilient-loader convention. On any
 * throw we resolve to the empty shape. (Local copy — do NOT import from the
 * concurrently-edited district-analytics loader module.)
 */
async function deferCard<T>(build: () => Promise<T>, empty: T): Promise<T> {
  try {
    return await build();
  } catch {
    return empty;
  }
}

function sum(series: number[]): number {
  return series.reduce((a, b) => a + b, 0);
}

/** ISO `YYYY-MM-DD` for a Date, UTC (matches `dailyWindow`'s UTC convention). */
function isoFromDate(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** ISO `YYYY-MM-DD` `deltaDays` from `base` (UTC). */
function isoShift(base: Date, deltaDays: number): string {
  const d = new Date(base.getTime());
  d.setUTCDate(d.getUTCDate() + deltaDays);
  return isoFromDate(d);
}

/** Mindful-minutes label — compact "x.xk" at ≥ 1000, plain integer below. */
function formatMinutesLabel(minutes: number): string {
  if (minutes >= 1000) {
    return `${(minutes / 1000).toFixed(1)}k`;
  }
  return minutes.toLocaleString();
}

// ---------------------------------------------------------------------------
// Loader — resolves the caller's scope: a district org for `district-admin` /
// preview (unchanged), OR the caller's own school-id list for `school-admin`
// (step-1's `SchoolByUsersFindMany` — no district concept for that role), plus
// the licensed-schools count (both awaited so the School Registration
// denominator is ready). Returns each region as an UN-awaited promise so the
// route streams them in behind skeletons. No mock/dummy data: when Amplitude
// is unconfigured or a call soft-errors, the region resolves to an honest
// zero/empty shape. Additive branching only — zero behavior change for
// district-admin/preview.
// ---------------------------------------------------------------------------

export async function getDistrictHome(request: Request): Promise<{
  district: DistrictInfo | null;
  loadError: string | null;
  deferred: DistrictHomeDeferred | null;
}> {
  const result = await resolveDistrictAdmin(request);

  if (result.loadError !== null) {
    return {
      district: null,
      loadError: result.loadError,
      deferred: null,
    };
  }

  const { token } = result;
  const isSchoolAdmin = result.role === "school-admin";

  // Per-role scope: `org` narrows Amplitude via `gp:organization`
  // (district-admin/preview only — school-admin has no district/org concept
  // from step-1's resolver); `schoolIds` narrows via `gp:school` (school-admin
  // only — aggregates across every school the caller belongs to, `null` =
  // unscoped/org-wide for district-admin). `districtId` feeds the roster query
  // below (school-admin has none — the roster promise branches to
  // `getSchoolRosterTotal(schoolIds)` instead, step-5).
  let org: string | null;
  let schoolIds: string[] | null;
  let districtId: string | null;
  let licensed: number;
  let districtInfo: DistrictInfo | null;

  if (isSchoolAdmin) {
    const { schools } = result;
    if (!schools || schools.length === 0) {
      return {
        district: null,
        loadError: "No schools assigned.",
        deferred: null,
      };
    }
    org = null;
    schoolIds = schools.map((s) => s._id);
    districtId = null;
    // "Licensed schools" for a school-admin is their own school-list length —
    // they can't scope `SchoolFindMany({district})` (no district to filter by).
    licensed = schools.length;
    districtInfo = null;
  } else {
    if (!result.district) {
      return {
        district: null,
        loadError: "Could not resolve district.",
        deferred: null,
      };
    }
    const { district } = result;
    org = district.organization;
    schoolIds = null;
    districtId = district._id;
    districtInfo = {
      _id: district._id,
      name: district.name,
      organization: district.organization,
    };

    // Licensed schools — the School Registration denominator. Awaited inline
    // (the card needs it synchronously as the deferCard fallback), mirrors the
    // district-analytics loader (~lines 285-296 fetch, 349-357 count).
    const schoolsResult = await safe(
      gqlClient.request(
        SchoolFindManyDocument,
        { filter: { district: district._id, platform: env.PLATFORM }, limit: 500 },
        { "access-token": token },
      ),
    );
    licensed = schoolsResult.ok
      ? (schoolsResult.data.SchoolFindMany ?? []).filter((s) => s && s._id).length
      : 0;
  }

  // --- Windows (loaders may read `new Date()`) --------------------------------
  // School year runs Aug 1 → Jul 31; `syStart` is the calendar year that Aug 1
  // fell in. Months Aug–Dec (≥ 8) belong to the school year that started this
  // calendar year; Jan–Jul (≤ 7) belong to the one that started last calendar
  // year. (The plan text said ≥ 7, but that inverts the current-SY window
  // [`${syStart}-08-01` → today] for all of July — e.g. today 2026-07-19 would
  // give [2026-08-01 → 2026-07-19]; the Appendix intent is "Aug 1 → today".)
  const now = new Date();
  const yr = now.getUTCFullYear();
  const monthNum = now.getUTCMonth() + 1; // 1-12
  const syStart = monthNum >= 8 ? yr : yr - 1;
  const today = isoFromDate(now);

  const currentSY = windowFromISO(`${syStart}-08-01`, today);
  const priorSY = windowFromISO(`${syStart - 1}-08-01`, `${syStart}-07-31`);
  const ytd = windowFromISO(`${yr}-01-01`, today);
  const thisWeek = dailyWindow(7);
  const engagementWindow = dailyWindow(30);
  // The 7 days before `thisWeek.start`: [today-13, today-7] inclusive.
  const lastWeek = windowFromISO(isoShift(now, -13), isoShift(now, -7));

  // --- Fire everything UN-awaited (start the promises before the deferCards) --
  // Funnel (school-year adoption): Registered from roster, Active/Engaged from
  // Amplitude period uniques over the current school year (school-scoped via
  // `schoolIds` for a school-admin, org-scoped exactly as before otherwise).
  //
  // step-5: "Registered" funnel stage + Active User Rate denominator (below)
  // now share this ONE per-role roster promise. District-admin/preview:
  // unchanged `UserTotalsFindMany({district})` (students+teachers).
  // School-admin: the summed per-school roster (`getSchoolRosterTotal`,
  // `school-roster.server.ts` — see that module's docstring for why
  // `UserTotalsFindMany`'s `school` arg / `UsersBySchoolFindMany` were passed
  // over). "Active"/"Engaged" immediately below ARE real, school-scoped
  // numerators already (step-1/2).
  const registeredP: Promise<number | null> = districtId
    ? safe(
        gqlClient.request(
          UserTotalsFindManyDocument,
          { district: districtId },
          { "access-token": token },
        ),
      ).then((r) =>
        r.ok && r.data.UserTotalsFindMany
          ? (r.data.UserTotalsFindMany.students ?? 0) +
            (r.data.UserTotalsFindMany.teachers ?? 0)
          : null,
      )
    : isSchoolAdmin
      ? getSchoolRosterTotal(token, schoolIds ?? [])
      : Promise.resolve(null);
  const funnelActiveP = getActiveUsersTotal(org, currentSY, schoolIds);
  const funnelEngagedP = getEngagedUsersTotal(org, currentSY, schoolIds);

  // School Registration: distinct schools active this school year (bounded to
  // the caller's own schools for a school-admin).
  const activeSchoolsCountP = getActiveSchoolsCount(org, currentSY, schoolIds);

  // Practice Sessions: content plays this school year vs the full prior year.
  const currentPlaysP = getContentPlayedTotal(org, currentSY, schoolIds);
  const priorPlaysP = getContentPlayedTotal(org, priorSY, schoolIds);

  // Engagement: Active User Rate (completed ÷ total, 30-day window — matches
  // the current home), YTD mindful minutes for the gauge center, and the
  // week-over-week active-users delta.
  //
  // step-5: numerator — `getCompletedUsersTotal` was additively widened
  // (`amplitude.server.ts`) to accept the same `schoolId` scope as its
  // siblings (`getActiveUsersTotal`/`getEngagedUsersTotal`); for district-admin
  // `schoolIds` is `null` so `schoolSegmentFilter(null)` is `[]` — identical,
  // unchanged org-only behavior. Denominator — `orgTotalP`
  // (`UsersByOrganizationFindMany`, ALL org user types) has no per-school
  // equivalent proven reliable enough to introduce here (see
  // `school-roster.server.ts`'s docstring), so for a school-admin (where
  // `orgTotalP` is always `null` — no org) the `engagement` builder below
  // falls back to the SAME per-school roster total (`registeredP`, teacher +
  // student) already computed above for the funnel's "Registered" stage. WoW
  // delta and YTD mindful minutes below ARE school-scoped already (real data).
  const completedUsersP = getCompletedUsersTotal(org, engagementWindow, schoolIds);
  const orgTotalP = org
    ? safe(
        gqlClient.request(
          UsersByOrganizationTotalDocument,
          { organization: org },
          { "access-token": token },
        ),
      )
    : Promise.resolve(null);
  const ytdMindfulP = getMindfulSecondsSeries(org, ytd, undefined, schoolIds);
  const activeThisWeekP = getActiveUsersTotal(org, thisWeek, schoolIds);
  const activeLastWeekP = getActiveUsersTotal(org, lastWeek, schoolIds);

  // --- Per-region promises (each never rejects) -------------------------------

  // Adoption funnel — real only when Amplitude answered (active total !== null)
  // AND joined with the roster; otherwise `[]` so the card renders its EmptyCard.
  const adoptionFunnel = deferCard<FunnelStage[]>(async () => {
    const [registered, activeTotal, engagedTotal] = await Promise.all([
      registeredP,
      funnelActiveP,
      funnelEngagedP,
    ]);
    if (activeTotal === null) return [];
    return [
      { key: "registered", label: "Registered", value: registered ?? 0 },
      { key: "active", label: "Active Users", value: activeTotal },
      { key: "engaged", label: "Engaged", value: engagedTotal ?? 0 },
    ];
  }, []);

  // School Registration — registered = active schools this year; licensed is the
  // awaited roster count (also the fallback so the ratio denominator survives).
  const schoolRegistration = deferCard<SchoolRegistration>(
    async () => ({ registered: (await activeSchoolsCountP) ?? 0, licensed }),
    { registered: 0, licensed },
  );

  // Practice Sessions — current-SY plays vs prior-SY plays.
  const practiceSessions = deferCard<PracticeSessions>(
    async () => ({
      current: (await currentPlaysP) ?? 0,
      previous: (await priorPlaysP) ?? 0,
    }),
    { current: 0, previous: 0 },
  );

  // Engagement — Active User Rate + WoW delta + YTD mindful-minutes gauge center.
  const engagement = deferCard<HomeEngagement>(async () => {
    const [completed, orgTotalResult, registeredTotal, ytdMindful, activeThisWeek, activeLastWeek] =
      await Promise.all([
        completedUsersP,
        orgTotalP,
        registeredP,
        ytdMindfulP,
        activeThisWeekP,
        activeLastWeekP,
      ]);

    const orgTotal =
      orgTotalResult && orgTotalResult.ok
        ? orgTotalResult.data.UsersByOrganizationFindMany?.total ?? null
        : null;
    // `orgTotalP` is always `null` for a school-admin (no org concept) — fall
    // back to the same per-school roster total (`registeredP`) used for the
    // funnel's "Registered" stage above (step-5). District-admin/preview keeps
    // `orgTotal` exactly as before (this branch never triggers for them).
    const denominator = orgTotal ?? (isSchoolAdmin ? registeredTotal : null);
    const completedCount = completed ?? 0;
    const activeUserRate =
      denominator && denominator > 0
        ? Math.min(100, Math.round((completedCount / denominator) * 100))
        : 0;

    // WoW delta: direction carries the sign, `priorWeekDeltaPct` the magnitude
    // (the panel pairs an ▲/▼ arrow with the value).
    const thisWeekActive = activeThisWeek ?? 0;
    const lastWeekActive = activeLastWeek ?? 0;
    const rawDeltaPct =
      lastWeekActive > 0
        ? Math.round(((thisWeekActive - lastWeekActive) / lastWeekActive) * 100)
        : 0;
    const priorWeekDirection: "up" | "down" = rawDeltaPct >= 0 ? "up" : "down";
    const priorWeekDeltaPct = Math.abs(rawDeltaPct);

    const ytdMinutes = ytdMindful ? Math.round(sum(ytdMindful) / 60) : 0;

    return {
      activeUserRate,
      priorWeekDeltaPct,
      priorWeekDirection,
      ytdMindfulLabel: formatMinutesLabel(ytdMinutes),
      gaugeScore: activeUserRate,
    };
  }, EMPTY_ENGAGEMENT);

  return {
    district: districtInfo,
    loadError: null,
    deferred: {
      adoptionFunnel,
      schoolRegistration,
      practiceSessions,
      engagement,
    },
  };
}
