import { graphql } from "~/gql";

export const MyLikedClassesDocument = graphql(/* GraphQL */ `
  query MyLikedClasses {
    MyLikedClasses {
      _id
      class
      classObj {
        _id
        title
        description
        cover { url }
      }
    }
  }
`);
