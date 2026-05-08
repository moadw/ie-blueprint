import { GraphQLClient } from "graphql-request";

import { getToken } from "~/lib/auth";
import { env } from "~/lib/env";

export const gqlClient = new GraphQLClient(env.GRAPHQL_URL, {
  requestMiddleware: (request) => {
    const token = getToken();
    if (!token) return request;
    // `request.headers` is a `Headers` instance — spreading it yields `{}`
    // (its props aren't enumerable own keys), which would silently drop
    // `Content-Type: application/json` and trigger Apollo's
    // "POST body missing, invalid Content-Type..." 400. Mutate it instead.
    const headers = new Headers(request.headers as HeadersInit);
    headers.set("access-token", token);
    return { ...request, headers };
  },
});
