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

export type ResolveDistrictAdminResult =
  | { token: string; district: DistrictAdminInfo; loadError: null }
  | { token: string; district: null; loadError: string };

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
      loadError: userResult.ok
        ? "Could not resolve user organization."
        : userResult.error,
    };
  }

  const organization = userResult.data.UsersFindOne.organization;

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

  return { token, district, loadError: null };
}
