import type { LoaderFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { gqlClient } from "~/lib/graphql";
import { safe } from "~/lib/safe-loader";
import {
  destroySession,
  getSession,
  requireSessionToken,
} from "~/lib/session.server";
import { homePathForIdentifier } from "~/lib/user";
import { UsersFindOneDocument } from "~/queries/users";

export async function loader({ request }: LoaderFunctionArgs) {
  const token = await requireSessionToken(request);

  const result = await safe(
    gqlClient.request(UsersFindOneDocument, {}, { "access-token": token }),
  );

  // Token inválido/expirado: el backend rechaza la query (el JWT vive 48h).
  // Limpiamos la cookie y redirigimos a /login en vez de soltar un 500.
  if (!result.ok || !result.data.UsersFindOne) {
    const session = await getSession(request);
    throw redirect("/login", {
      headers: { "Set-Cookie": await destroySession(session) },
    });
  }

  throw redirect(
    homePathForIdentifier(result.data.UsersFindOne.typeObj?.identifier),
  );
}

export default function IndexRoute() {
  return null;
}
