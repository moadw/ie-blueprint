import type { LoaderFunctionArgs } from "react-router";
import { env } from "~/lib/env";
import { gqlClient } from "~/lib/graphql";
import { safe } from "~/lib/safe-loader";
import { requireSessionToken } from "~/lib/session.server";
import {
  UserSearchDocument,
  UserTypesFindManyDocument,
} from "~/queries/users";

export interface OrgAdmin {
  name: string;
}

export interface DistrictAdminLookupData {
  admins: OrgAdmin[];
  error: string | null;
}

/**
 * `/admin/district-admin/:organizationId` — resource route. Given a district's
 * `organization` id, returns the `district-admin` users in that org. Lazily
 * hit per-row by `<DistrictAdminLine />` (IntersectionObserver) so the district
 * list never fires N blocking user lookups up front — see the "lazy per-row"
 * decision on this feature.
 *
 * `UserSearch`'s `type` filter needs the usertype `_id`, not the identifier
 * string. That mapping is stable for the process lifetime, so resolve it once
 * and memoize — otherwise every visible row would also pay for a
 * `UserTypesFindMany` round-trip. Only a successful resolution is cached; a
 * soft failure leaves the memo empty so a later row retries.
 */
let cachedTypeId: string | null = null;
let typeIdPromise: Promise<string | null> | null = null;

async function getDistrictAdminTypeId(token: string): Promise<string | null> {
  if (cachedTypeId) return cachedTypeId;
  if (typeIdPromise) return typeIdPromise;
  typeIdPromise = (async () => {
    const result = await safe(
      gqlClient.request(
        UserTypesFindManyDocument,
        { limit: 100 },
        { "access-token": token },
      ),
    );
    typeIdPromise = null;
    if (!result.ok) return null;
    const match = (result.data.UserTypesFindMany ?? []).find(
      (t) => t?.identifier === "district-admin",
    );
    cachedTypeId = match?._id ?? null;
    return cachedTypeId;
  })();
  return typeIdPromise;
}

export async function loader({
  request,
  params,
}: LoaderFunctionArgs): Promise<DistrictAdminLookupData> {
  const token = await requireSessionToken(request);
  const organizationId = params.organizationId;
  if (!organizationId || !env.PLATFORM) {
    return { admins: [], error: null };
  }

  // Without the district-admin usertype id we'd have to query the org
  // unscoped and risk mislabeling a teacher/student as "the admin" — so bail
  // to the empty (retry-able) state instead of guessing.
  const typeId = await getDistrictAdminTypeId(token);
  if (!typeId) {
    return { admins: [], error: null };
  }

  const result = await safe(
    gqlClient.request(
      UserSearchDocument,
      {
        organizationId,
        type: typeId,
        sortBy: "createdAt",
        sortOrder: -1,
        limit: 5,
        skip: 0,
      },
      { "access-token": token },
    ),
  );

  if (!result.ok) {
    return { admins: [], error: result.error };
  }

  const admins: OrgAdmin[] = (result.data.UserSearch?.data ?? [])
    .filter((u): u is NonNullable<typeof u> => u != null)
    .map((u) => ({
      name:
        `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim() ||
        u.email ||
        "Unknown user",
    }));

  return { admins, error: null };
}
