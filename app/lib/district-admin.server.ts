import { env } from "~/lib/env";
import { readPreviewDistrictId } from "~/lib/district-preview.server";
import { gqlClient } from "~/lib/graphql";
import { safe } from "~/lib/safe-loader";
import { requireSessionToken } from "~/lib/session.server";
import { DistrictFindOneDocument } from "~/queries/districts";
import { UsersFindOneDocument } from "~/queries/users";

export interface DistrictAdminInfo {
  _id: string;
  name: string | null;
  organization: string | null;
}

/**
 * Identidad legible del admin logeado, para autofill (p. ej. `user`/`userType`
 * del Impact Hub). `name` = "First Last" (fallback userName); `role` = el
 * `typeObj.identifier` formateado para mostrar ("district_admin" → "District
 * Admin").
 */
export interface DistrictAdminCurrentUser {
  name: string | null;
  role: string | null;
}

export type ResolveDistrictAdminResult =
  | {
      token: string;
      district: DistrictAdminInfo;
      currentUser: DistrictAdminCurrentUser;
      loadError: null;
      preview: boolean;
    }
  | {
      token: string;
      district: null;
      currentUser: null;
      loadError: string;
      preview: boolean;
    };

function formatRole(identifier: string | null | undefined): string | null {
  if (!identifier) return null;
  const words = identifier
    .replace(/[_-]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1));
  return words.length ? words.join(" ") : null;
}

export async function resolveDistrictAdmin(
  request: Request,
): Promise<ResolveDistrictAdminResult> {
  const token = await requireSessionToken(request);

  const userResult = await safe(
    gqlClient.request(UsersFindOneDocument, {}, { "access-token": token }),
  );

  // Can't confirm role or organization if the user query soft-failed.
  if (!userResult.ok) {
    return {
      token,
      district: null,
      currentUser: null,
      loadError: userResult.error,
      preview: false,
    };
  }

  const me = userResult.data.UsersFindOne;
  const currentUser: DistrictAdminCurrentUser = {
    name:
      `${me?.firstName ?? ""} ${me?.lastName ?? ""}`.trim() ||
      me?.userName ||
      null,
    role: formatRole(me?.typeObj?.identifier),
  };
  const isAdmin = me?.typeObj?.identifier === "admin";
  const previewId = await readPreviewDistrictId(request);

  // Preview branch — MUST run before the org-presence guard below: a master
  // admin may have no `organization` of their own, so gating preview on it
  // would silently no-op the feature for exactly those admins. Only honored
  // for the master `admin` role (defense in depth). The platform is enforced
  // via the query filter so a foreign/other-platform id yields no row and
  // fails soft to the `loadError` card (behaviorally the same as an existence
  // + `platform === env.PLATFORM` check).
  if (isAdmin && previewId) {
    const previewResult = await safe(
      gqlClient.request(
        DistrictFindOneDocument,
        { filter: { _id: previewId, platform: env.PLATFORM } },
        { "access-token": token },
      ),
    );
    if (!previewResult.ok || !previewResult.data.DistrictFindOne) {
      return {
        token,
        district: null,
        currentUser: null,
        loadError: previewResult.ok
          ? "Could not resolve district."
          : previewResult.error,
        preview: true,
      };
    }
    const previewRaw = previewResult.data.DistrictFindOne;
    const previewDistrict: DistrictAdminInfo = {
      _id: previewRaw._id,
      name: previewRaw.name ?? null,
      organization: previewRaw.organization ?? null,
    };
    return {
      token,
      district: previewDistrict,
      currentUser,
      loadError: null,
      preview: true,
    };
  }

  // Non-preview path — resolve the district from the logged-in user's own
  // organization, exactly as before. The org-presence guard stays here.
  const organization = me?.organization;
  if (!organization) {
    return {
      token,
      district: null,
      currentUser: null,
      loadError: "Could not resolve user organization.",
      preview: false,
    };
  }

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
      token,
      district: null,
      currentUser: null,
      loadError: districtResult.ok
        ? "Could not resolve district."
        : districtResult.error,
      preview: false,
    };
  }

  const districtRaw = districtResult.data.DistrictFindOne;
  const district: DistrictAdminInfo = {
    _id: districtRaw._id,
    name: districtRaw.name ?? null,
    organization: districtRaw.organization ?? null,
  };

  return { token, district, currentUser, loadError: null, preview: false };
}
