import type { LoaderFunctionArgs } from "react-router";
import { Outlet, redirect } from "react-router";
import { gqlClient } from "~/lib/graphql";
import {
  isInvalidSessionError,
  logoutRedirect,
  requireSessionToken,
} from "~/lib/session.server";
import { safe } from "~/lib/safe-loader";
import { UsersFindOneDocument } from "~/queries/users";
import { homePathForIdentifier } from "~/lib/user";
import { AdminShell } from "~/components/layout/admin-shell";

export async function loader({ request }: LoaderFunctionArgs) {
  const token = await requireSessionToken(request);
  const result = await safe(
    gqlClient.request(UsersFindOneDocument, {}, { "access-token": token }),
  );

  if (result.ok) {
    // Successful lookup → enforce the admin role gate.
    const identifier = result.data.UsersFindOne?.typeObj?.identifier;
    if (identifier !== "admin") {
      throw redirect(homePathForIdentifier(identifier));
    }
    return { authError: null };
  }

  // An expired/invalid token surfaces as the backend `checkAccess` "reading
  // '_id'" TypeError — treat it as a dead session and force re-login (clearing
  // the cookie) rather than showing a broken banner.
  if (isInvalidSessionError(result.error)) {
    await logoutRedirect(request);
  }

  // Otherwise it's a transient backend failure — keep the UI mounted with a
  // banner. The session token is still required, so this is not an open door.
  return { authError: result.error };
}

export default function AdminLayoutRoute() {
  return (
    <AdminShell>
      <Outlet />
    </AdminShell>
  );
}
