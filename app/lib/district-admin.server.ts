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
    }
  | {
      token: string;
      district: null;
      currentUser: null;
      loadError: string;
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

  if (!userResult.ok || !userResult.data.UsersFindOne?.organization) {
    return {
      token,
      district: null,
      currentUser: null,
      loadError: userResult.ok
        ? "Could not resolve user organization."
        : userResult.error,
    };
  }

  const me = userResult.data.UsersFindOne;
  const organization = userResult.data.UsersFindOne.organization;

  const currentUser: DistrictAdminCurrentUser = {
    name:
      `${me.firstName ?? ""} ${me.lastName ?? ""}`.trim() ||
      me.userName ||
      null,
    role: formatRole(me.typeObj?.identifier),
  };

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
    };
  }

  const districtRaw = districtResult.data.DistrictFindOne;
  const district: DistrictAdminInfo = {
    _id: districtRaw._id,
    name: districtRaw.name ?? null,
    organization: districtRaw.organization ?? null,
  };

  return { token, district, currentUser, loadError: null };
}
