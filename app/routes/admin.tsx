import type { LoaderFunctionArgs } from "react-router";
import { Outlet, redirect } from "react-router";
import { gqlClient } from "~/lib/graphql";
import { requireSessionToken } from "~/lib/session.server";
import { safe } from "~/lib/safe-loader";
import { UsersFindOneDocument } from "~/queries/users";
import { homePathForIdentifier } from "~/lib/user";
import { AdminShell } from "~/components/layout/admin-shell";

export async function loader({ request }: LoaderFunctionArgs) {
  const token = await requireSessionToken(request);
  const result = await safe(
    gqlClient.request(UsersFindOneDocument, undefined, {
      "access-token": token,
    }),
  );
  // If the user query succeeded and the role isn't admin, redirect.
  // If it failed (backend 500 etc.), pass through with a banner — the
  // session token is still required, so this is not an open door.
  if (result.ok) {
    const identifier = result.data.UsersFindOne?.typeObj?.identifier;
    if (identifier !== "admin") {
      throw redirect(homePathForIdentifier(identifier));
    }
  }
  return { authError: result.ok ? null : result.error };
}

export default function AdminLayoutRoute() {
  return (
    <AdminShell>
      <Outlet />
    </AdminShell>
  );
}
