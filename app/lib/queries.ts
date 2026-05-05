// Placeholder GraphQL document so codegen produces a non-empty `documents`
// array in `app/gql/gql.ts`. Real queries live in feature modules.
import { graphql } from "~/gql";

export const PingQuery = graphql(/* GraphQL */ `
  query Ping {
    __typename
  }
`);
