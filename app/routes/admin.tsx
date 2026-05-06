import type { LoaderFunctionArgs } from "react-router";
import { Outlet, redirect } from "react-router";
import { gqlClient } from "~/lib/graphql";
import { requireSessionToken } from "~/lib/session.server";
import { UsersFindOneDocument } from "~/queries/users";
import { homePathForIdentifier } from "~/lib/user";
import { AdminShell } from "~/components/layout/admin-shell";

export async function loader({ request }: LoaderFunctionArgs) {
  const token = await requireSessionToken(request);
  const data = await gqlClient.request(
    UsersFindOneDocument,
    undefined,
    { "access-token": token },
  );
  const identifier = data.UsersFindOne?.typeObj?.identifier;
  if (identifier !== "admin") {
    throw redirect(homePathForIdentifier(identifier));
  }
  return null;
}

export default function AdminLayoutRoute() {
  return (
    <AdminShell>
      <Outlet />
    </AdminShell>
  );
}
