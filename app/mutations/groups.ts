import { graphql } from "~/gql";

export const GroupDeleteOneDocument = graphql(/* GraphQL */ `
  mutation GroupDeleteOne($_id: String!) {
    GroupDeleteOne(_id: $_id)
  }
`);
