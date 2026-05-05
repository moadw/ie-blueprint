/**
 * /api/session — single-token session resource route.
 *
 * Blueprint deviation note: `POST /webapi/login` returns a single JWT
 * (`{ token }`, 48h lifetime), and `POST /common/refreshtoken` is currently
 * broken on the test backend (HTTP 500). So this route does NOT perform a
 * real refresh — it only:
 *   - GET    → returns the current cookie token as `{ accessToken }`
 *   - POST   → called by `app/lib/api.ts` on a 401; clears the cookie and
 *              returns `{ accessToken: null }` with status 401 so the
 *              client retry surfaces null and the next loader navigation
 *              redirects to /login.
 *   - DELETE → logout; clears the cookie, 204.
 *
 * Follow-up: when `/common/refreshtoken` is fixed upstream, the POST
 * branch should perform the actual refresh round-trip and re-set the
 * cookie with the rotated token.
 */
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import {
  destroySession,
  getSession,
  getSessionToken,
} from "~/lib/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const token = await getSessionToken(request);
  return Response.json({ accessToken: token ?? null });
}

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request);
  const setCookie = await destroySession(session);

  if (request.method === "DELETE") {
    return new Response(null, {
      status: 204,
      headers: { "Set-Cookie": setCookie },
    });
  }

  // POST = api.ts's refresh attempt on 401. Clear cookie and tell client
  // there is no fresh token; the subsequent navigation hits a loader that
  // redirects to /login.
  return Response.json(
    { accessToken: null },
    {
      status: 401,
      headers: { "Set-Cookie": setCookie },
    },
  );
}
