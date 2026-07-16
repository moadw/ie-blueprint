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
import { DistrictShell } from "~/routes/district/_components/district-shell";

export async function loader({ request }: LoaderFunctionArgs) {
  const token = await requireSessionToken(request);
  const userResult = await safe(
    gqlClient.request(UsersFindOneDocument, {}, { "access-token": token }),
  );
  const previewId = await readPreviewDistrictId(request);
  // If the user query succeeded, gate on role. A master `admin` is allowed
  // through ONLY when a preview cookie is present (they then see the previewed
  // district). Any other non-district-admin is redirected home. If the user
  // query failed (backend 500 etc.), pass through with a banner — the session
  // token is still required, so this is not an open door.
  let previewActive = false;
  if (userResult.ok) {
    const id = userResult.data.UsersFindOne?.typeObj?.identifier;
    previewActive = id === "admin" && !!previewId;
    if (id !== "district-admin" && !previewActive) {
      throw redirect(homePathForIdentifier(id));
    }
  }
  // Resolve the district: in admin-preview mode by the previewed `_id` (with a
  // platform guard so a foreign id fails soft), otherwise by the logged-in
  // user's own organization. If the user query failed (authError), district
  // stays null as before.
  const organization = userResult.ok
    ? userResult.data.UsersFindOne?.organization ?? null
    : null;
  // Sin filtro de platform en el path normal: paridad con MTW (solo organization).
  const districtResult =
    previewActive && previewId
      ? await safe(
          gqlClient.request(
            DistrictFindOneDocument,
            { filter: { _id: previewId, platform: env.PLATFORM } },
            { "access-token": token },
          ),
        )
      : organization
        ? await safe(
            gqlClient.request(
              DistrictFindOneDocument,
              { filter: { organization } },
              { "access-token": token },
            ),
          )
        : null;
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
  const resolvedDistrict =
    districtResult && districtResult.ok
      ? (districtResult.data.DistrictFindOne ?? null)
      : null;
  return {
    district: resolvedDistrict,
    // Surfaced for the header account menu (avatar initials, name, email).
    // Null when the user query 500s — the menu degrades gracefully.
    user: userResult.ok ? (userResult.data.UsersFindOne ?? null) : null,
    error:
      districtResult && !districtResult.ok ? districtResult.error : null,
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
