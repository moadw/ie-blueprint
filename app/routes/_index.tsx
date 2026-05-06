import type { LoaderFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { gqlClient } from "~/lib/graphql";
import { requireSessionToken } from "~/lib/session.server";
import { homePathForIdentifier } from "~/lib/user";
import { UsersFindOneDocument } from "~/queries/users";

export async function loader({ request }: LoaderFunctionArgs) {
  const token = await requireSessionToken(request);
  const data = await gqlClient.request(
    UsersFindOneDocument,
    undefined,
    { "access-token": token },
  );
  throw redirect(homePathForIdentifier(data.UsersFindOne?.typeObj?.identifier));
}

export default function IndexRoute() {
  return null;
}
