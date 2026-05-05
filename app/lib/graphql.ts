import { GraphQLClient } from "graphql-request";

import { getToken } from "~/lib/auth";
import { env } from "~/lib/env";

export const gqlClient = new GraphQLClient(env.GRAPHQL_URL, {
  requestMiddleware: (request) => {
    const token = getToken();
    if (token) {
      return {
        ...request,
        headers: {
          ...request.headers,
          "access-token": token,
        },
      };
    }
    return request;
  },
});
