import { env } from "~/lib/env";
import { readPreviewDistrictId } from "~/lib/district-preview.server";
import { gqlClient } from "~/lib/graphql";
import { safe } from "~/lib/safe-loader";
import { requireSessionToken } from "~/lib/session.server";
import { DistrictFindOneDocument } from "~/queries/districts";
import { UsersFindOneDocument } from "~/queries/users";
import { SchoolByUsersFindManyDocument } from "~/queries/schools";

export interface DistrictAdminInfo {
  _id: string;
  name: string | null;
  organization: string | null;
}

/** One of the caller's schools (school-admin scope only). */
export interface ScopedSchool {
  _id: string;
  name: string | null;
}

/** The caller's role, as resolved from `typeObj.identifier`. */
export type ResolveScopeRole = "district-admin" | "school-admin" | "admin";

/**
 * Identidad legible del admin logeado, para autofill (p. ej. `user`/`userType`
 * del Impact Hub). `name` = "First Last" (fallback userName); `role` = el
 * `typeObj.identifier` formateado para mostrar ("district_admin" → "District
 * Admin").
 */
export interface DistrictAdminCurrentUser {
  name: string | null;
  role: string | null;
  // Master `admin` role. Cuando navega como distrito (preview) crea a nombre del
  // distrito, no suyo → el Impact Hub NO autocompleta autor/rol para un admin.
  isAdmin: boolean;
}

export type ResolveDistrictAdminResult =
  | {
      token: string;
      // `null` for a `school-admin` (no district concept — see `schools` below);
      // non-null for `district-admin` / preview, exactly as before.
      district: DistrictAdminInfo | null;
      currentUser: DistrictAdminCurrentUser;
      loadError: null;
      preview: boolean;
      role: ResolveScopeRole;
      // Populated for `school-admin` only; `null` for district-admin/preview.
      schools: ScopedSchool[] | null;
      // Convenience `schools.map(s => s._id)`; `null` for district-admin/preview.
      schoolIds: string[] | null;
    }
  | {
      token: string;
      district: null;
      currentUser: null;
      loadError: string;
      preview: boolean;
      role: ResolveScopeRole | null;
      schools: null;
      schoolIds: null;
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
      role: null,
      schools: null,
      schoolIds: null,
    };
  }

  const me = userResult.data.UsersFindOne;
  const identifier = me?.typeObj?.identifier;
  const isAdmin = identifier === "admin";
  const isSchoolAdmin = identifier === "school-admin";
  const role: ResolveScopeRole = isSchoolAdmin
    ? "school-admin"
    : isAdmin
      ? "admin"
      : "district-admin";
  const currentUser: DistrictAdminCurrentUser = {
    name:
      `${me?.firstName ?? ""} ${me?.lastName ?? ""}`.trim() ||
      me?.userName ||
      null,
    role: formatRole(me?.typeObj?.identifier),
    isAdmin,
  };
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
        role,
        schools: null,
        schoolIds: null,
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
      role,
      schools: null,
      schoolIds: null,
    };
  }

  // School-admin branch — role-polymorphic scope: skip the org→district
  // resolution entirely and resolve the caller's schools via
  // `SchoolByUsersFindMany($user)` instead. `district` stays `null` (no
  // district concept for this role); downstream district-scoped code is
  // untouched because it keys off `district`, which this role never sets.
  if (isSchoolAdmin) {
    const userId = me?._id;
    // Can't scope schools without the caller's own id (shouldn't happen once
    // authenticated, but the query is nullable) — soft error, no throw.
    if (!userId) {
      return {
        token,
        district: null,
        currentUser: null,
        loadError: "Could not resolve user.",
        preview: false,
        role,
        schools: null,
        schoolIds: null,
      };
    }
    const schoolsResult = await safe(
      gqlClient.request(
        SchoolByUsersFindManyDocument,
        { user: userId },
        { "access-token": token },
      ),
    );
    if (!schoolsResult.ok) {
      return {
        token,
        district: null,
        currentUser: null,
        loadError: schoolsResult.error,
        preview: false,
        role,
        schools: null,
        schoolIds: null,
      };
    }
    const schools: ScopedSchool[] = (
      schoolsResult.data.SchoolByUsersFindMany ?? []
    )
      .filter((s): s is NonNullable<typeof s> => s != null)
      .map((s) => ({ _id: s._id, name: s.name ?? null }));

    // Empty list is a SOFT error (no schools assigned) — never throw.
    if (schools.length === 0) {
      return {
        token,
        district: null,
        currentUser: null,
        loadError: "No schools assigned.",
        preview: false,
        role,
        schools: null,
        schoolIds: null,
      };
    }

    return {
      token,
      district: null,
      currentUser,
      loadError: null,
      preview: false,
      role,
      schools,
      schoolIds: schools.map((s) => s._id),
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
      role,
      schools: null,
      schoolIds: null,
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
      role,
      schools: null,
      schoolIds: null,
    };
  }

  const districtRaw = districtResult.data.DistrictFindOne;
  const district: DistrictAdminInfo = {
    _id: districtRaw._id,
    name: districtRaw.name ?? null,
    organization: districtRaw.organization ?? null,
  };

  return {
    token,
    district,
    currentUser,
    loadError: null,
    preview: false,
    role,
    schools: null,
    schoolIds: null,
  };
}
