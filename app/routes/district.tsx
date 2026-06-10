import type { LoaderFunctionArgs } from "react-router";
import { Outlet, redirect, useLoaderData } from "react-router";
import { gqlClient } from "~/lib/graphql";
import { requireSessionToken } from "~/lib/session.server";
import { safe } from "~/lib/safe-loader";
import { UsersFindOneDocument } from "~/queries/users";
import { UserDistrictFindOneDocument } from "~/queries/districts";
import { homePathForIdentifier } from "~/lib/user";
import { DistrictShell } from "~/routes/district/_components/district-shell";

export async function loader({ request }: LoaderFunctionArgs) {
  const token = await requireSessionToken(request);
  const userResult = await safe(
    gqlClient.request(UsersFindOneDocument, {}, { "access-token": token }),
  );
  // If the user query succeeded and the role isn't district-admin, redirect.
  // If it failed (backend 500 etc.), pass through with a banner — the
  // session token is still required, so this is not an open door.
  if (userResult.ok) {
    const id = userResult.data.UsersFindOne?.typeObj?.identifier;
    if (id !== "district-admin") throw redirect(homePathForIdentifier(id));
  }
  const districtResult = await safe(
    gqlClient.request(UserDistrictFindOneDocument, {}, { "access-token": token }),
  );
  return {
    district: districtResult.ok
      ? (districtResult.data.UserDistrictFindOne ?? null)
      : null,
    error: districtResult.ok ? null : districtResult.error,
    authError: userResult.ok ? null : userResult.error,
  };
}

export default function DistrictLayoutRoute() {
  const { district } = useLoaderData<typeof loader>();
  return (
    <DistrictShell district={district}>
      <Outlet />
    </DistrictShell>
  );
}
