import { graphql } from "~/gql";

export const GroupDeleteOneDocument = graphql(/* GraphQL */ `
  mutation GroupDeleteOne($_id: String!) {
    GroupDeleteOne(_id: $_id)
  }
`);

export const ClassesDeleteOneDocument = graphql(/* GraphQL */ `
  mutation ClassesDeleteOne($_id: String!) {
    ClassesDeleteOne(_id: $_id)
  }
`);
