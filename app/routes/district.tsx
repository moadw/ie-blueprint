import type { LoaderFunctionArgs } from "react-router";
import { Outlet, redirect, useLoaderData } from "react-router";
import { env } from "~/lib/env";
import { readPreviewDistrictId } from "~/lib/district-preview.server";
import { gqlClient } from "~/lib/graphql";
import { requireSessionToken } from "~/lib/session.server";
import { safe } from "~/lib/safe-loader";
import { UsersFindOneDocument } from "~/queries/users";
import { DistrictFindOneDocument } from "~/queries/districts";
import { AnnouncementFindManyDocument } from "~/queries/announcements";
import { SortFindManyannouncementInput } from "~/gql/graphql";
import { isAnnouncementDismissed } from "~/lib/announcement-dismissal";
import { homePathForIdentifier } from "~/lib/user";
import { resolveDistrictAdmin } from "~/lib/district-admin.server";
import { DistrictShell } from "~/routes/district/_components/district-shell";

export async function loader({ request }: LoaderFunctionArgs) {
  const token = await requireSessionToken(request);
  const userResult = await safe(
    gqlClient.request(UsersFindOneDocument, {}, { "access-token": token }),
  );
  const previewId = await readPreviewDistrictId(request);
  // If the user query succeeded, gate on role. A master `admin` is allowed
  // through ONLY when a preview cookie is present (they then see the previewed
  // district). A `school-admin` is admitted the same as a `district-admin` —
  // their scope is resolved below via the role-polymorphic
  // `resolveDistrictAdmin`. Any other role is redirected home. If the user
  // query failed (backend 500 etc.), pass through with a banner — the session
  // token is still required, so this is not an open door.
  let previewActive = false;
  let identifier: string | null | undefined;
  if (userResult.ok) {
    identifier = userResult.data.UsersFindOne?.typeObj?.identifier;
    previewActive = identifier === "admin" && !!previewId;
    if (
      identifier !== "district-admin" &&
      identifier !== "school-admin" &&
      !previewActive
    ) {
      throw redirect(homePathForIdentifier(identifier));
    }
  }
  const isSchoolAdmin = identifier === "school-admin";

  // Resolve the district: in admin-preview mode by the previewed `_id` (with a
  // platform guard so a foreign id fails soft), otherwise by the logged-in
  // user's own organization. If the user query failed (authError), district
  // stays null as before. Skipped entirely for a school-admin — they have no
  // district concept (see the scope resolution below instead).
  const organization = userResult.ok
    ? userResult.data.UsersFindOne?.organization ?? null
    : null;
  // Sin filtro de platform en el path normal: paridad con MTW (solo organization).
  const districtResult =
    !isSchoolAdmin && previewActive && previewId
      ? await safe(
          gqlClient.request(
            DistrictFindOneDocument,
            { filter: { _id: previewId, platform: env.PLATFORM } },
            { "access-token": token },
          ),
        )
      : !isSchoolAdmin && organization
        ? await safe(
            gqlClient.request(
              DistrictFindOneDocument,
              { filter: { organization } },
              { "access-token": token },
            ),
          )
        : null;

  // School-admin scope: the role-polymorphic resolver returns the caller's
  // schools instead of a district (already `safe()`-wrapped internally). Child
  // routes (steps 2-4) resolve their own school-scoped data from
  // `schools`/`schoolIds`; this loader only needs them to synthesize the hero
  // title (comma-joined school names over the generic default image — no code
  // change to `DistrictHero`).
  const scopeResult = isSchoolAdmin
    ? await resolveDistrictAdmin(request)
    : null;
  const schools = scopeResult && !scopeResult.loadError ? scopeResult.schools : null;
  const schoolIds =
    scopeResult && !scopeResult.loadError ? scopeResult.schoolIds : null;
  const scopeError =
    scopeResult && scopeResult.loadError ? scopeResult.loadError : null;
  // Latest active district-portal announcement (global — no platform filter).
  // A failed fetch → announcement null; the layout must not break.
  const announcementResult = await safe(
    gqlClient.request(
      AnnouncementFindManyDocument,
      {
        filter: { type: "district", active: true },
        limit: 1,
        sort: SortFindManyannouncementInput.CREATEDAT_DESC,
      },
      { "access-token": token },
    ),
  );
  // Dismissal is resolved server-side via cookie so a closed bar never flashes
  // on reload (the server just omits it).
  const announcementRow = announcementResult.ok
    ? (announcementResult.data.AnnouncementFindMany?.[0] ?? null)
    : null;
  const announcement =
    announcementRow &&
    !isAnnouncementDismissed(request.headers.get("Cookie"), announcementRow._id)
      ? announcementRow
      : null;
  // For a school-admin, synthesize a hero-compatible "district" from their
  // school name(s): comma-joined names, generic default image (no cover/logo),
  // rendered by the unmodified `DistrictHero`/`DistrictShell`. `_id` is a
  // placeholder (first school id) — never read by the hero, just satisfies the
  // shared `district` shape. Empty/failed scope → `null` (shell degrades as
  // today, matching the district-admin soft-error path).
  const resolvedDistrict = isSchoolAdmin
    ? schools && schools.length > 0
      ? {
          _id: schoolIds?.[0] ?? "school-admin",
          name: schools.map((s) => s.name ?? "Unnamed School").join(", "),
          coverPhoto: null,
          logo: null,
        }
      : null
    : districtResult && districtResult.ok
      ? (districtResult.data.DistrictFindOne ?? null)
      : null;
  const districtError =
    districtResult && !districtResult.ok ? districtResult.error : null;
  return {
    district: resolvedDistrict,
    // School-admin only — `null` for district-admin/preview. Child routes
    // (steps 2-4) resolve their own school-scoped data from these.
    schools,
    schoolIds,
    // Surfaced for the header account menu (avatar initials, name, email).
    // Null when the user query 500s — the menu degrades gracefully.
    user: userResult.ok ? (userResult.data.UsersFindOne ?? null) : null,
    error: isSchoolAdmin ? scopeError : districtError,
    authError: userResult.ok ? null : userResult.error,
    announcement,
    // Consumed by Phase 4's "Back to CMS" header affordance. `active` is only
    // true for a master admin with a live preview cookie; `districtName` names
    // the previewed district for the header label.
    preview: {
      active: previewActive,
      districtName: previewActive ? (resolvedDistrict?.name ?? null) : null,
    },
  };
}

export default function DistrictLayoutRoute() {
  const { district, user, announcement, preview } =
    useLoaderData<typeof loader>();
  return (
    <DistrictShell
      district={district}
      user={user}
      announcement={announcement}
      preview={preview}
    >
      <Outlet />
    </DistrictShell>
  );
}
