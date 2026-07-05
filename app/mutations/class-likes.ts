import { graphql } from "~/gql";

export const ClassLikeCreateOneDocument = graphql(/* GraphQL */ `
  mutation ClassLikeCreateOne($class: String!) {
    ClassLikeCreateOne(class: $class) { _id }
  }
`);

// ClassLikeDeleteOne returns a String, not a payload object — no inner selection set.
export const ClassLikeDeleteOneDocument = graphql(/* GraphQL */ `
  mutation ClassLikeDeleteOne($class: String!) {
    ClassLikeDeleteOne(class: $class)
  }
`);
