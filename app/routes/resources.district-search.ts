import type { LoaderFunctionArgs } from "react-router";
import { env } from "~/lib/env";
import { gqlClient } from "~/lib/graphql";
import { safe } from "~/lib/safe-loader";
import { requireSessionToken } from "~/lib/session.server";
import {
  DistrictOptionsFindManyDocument,
  DistrictSearchOptionsDocument,
} from "~/queries/districts";

export interface DistrictSearchOption {
  _id: string;
  name: string;
  state: string | null;
  organization: string | null;
}

export interface DistrictSearchResourceData {
  districts: DistrictSearchOption[];
  total: number;
  error: string | null;
}

/** How many autocomplete results a page returns by default. */
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

/**
 * `/resources/district-search` — resource route backing `<DistrictCombobox />`.
 *
 * Two modes, both scoped to the session user's platform by the federated
 * `DistrictSearch` resolver (no `platform` arg — global admins see all):
 *
 * - `?q=&limit=&skip=` — fuzzy, name-ordered search (autocomplete). `q` empty
 *   returns the first `limit` districts alphabetically.
 * - `?organization=<id>` — exact lookup used to preselect the district a record
 *   already belongs to (via its `organization`). Returns at most one district.
 *
 * Kept server-side (rather than a client `gqlClient` call from the component)
 * so the role-gated resolver always sees a reliable session token, mirroring
 * the lazy-lookup pattern in `admin.district-admin.$organizationId`.
 */
export async function loader({
  request,
}: LoaderFunctionArgs): Promise<DistrictSearchResourceData> {
  const token = await requireSessionToken(request);
  const url = new URL(request.url);
  const organization = url.searchParams.get("organization")?.trim();

  // Preselection mode: resolve one district by its organization.
  if (organization) {
    const result = await safe(
      gqlClient.request(
        DistrictOptionsFindManyDocument,
        { filter: { organization }, limit: 1 },
        { "access-token": token },
      ),
    );
    const districts = result.ok
      ? (result.data.DistrictFindMany ?? [])
          .filter((d): d is NonNullable<typeof d> => d != null)
          .map(toOption)
      : [];
    return { districts, total: districts.length, error: result.error };
  }

  if (!env.PLATFORM) {
    return { districts: [], total: 0, error: null };
  }

  const query = (url.searchParams.get("q") ?? "").trim();
  const limit = clampInt(url.searchParams.get("limit"), DEFAULT_LIMIT);
  const skip = clampInt(url.searchParams.get("skip"), 0, 0);

  const result = await safe(
    gqlClient.request(
      DistrictSearchOptionsDocument,
      {
        ...(query ? { query } : {}),
        sortBy: "name",
        sortOrder: 1,
        limit,
        skip,
      },
      { "access-token": token },
    ),
  );
  const total = result.ok ? (result.data.DistrictSearch?.total ?? 0) : 0;
  const districts = result.ok
    ? (result.data.DistrictSearch?.data ?? [])
        .filter((d): d is NonNullable<typeof d> => d != null)
        .map(toOption)
    : [];
  return { districts, total, error: result.error };
}

function toOption(d: {
  _id: string;
  name?: string | null;
  state?: string | null;
  organization?: string | null;
}): DistrictSearchOption {
  return {
    _id: d._id,
    name: d.name ?? "",
    state: d.state ?? null,
    organization: d.organization ?? null,
  };
}

/** Parse a positive int query param, clamped to [min, MAX_LIMIT]. */
function clampInt(raw: string | null, fallback: number, min = 1): number {
  const n = Number(raw);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(MAX_LIMIT, Math.max(min, Math.floor(n)));
}
