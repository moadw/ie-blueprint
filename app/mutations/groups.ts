import { graphql } from "~/gql";

export const GroupDeleteOneDocument = graphql(/* GraphQL */ `
  mutation GroupDeleteOne($_id: String!) {
    GroupDeleteOne(_id: $_id)
  }
`);

export const GroupFinishedClassDocument = graphql(/* GraphQL */ `
  mutation GroupFinishedClass($_id: String, $class: String) {
    GroupFinishedClass(_id: $_id, class: $class)
  }
`);
