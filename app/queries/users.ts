import { graphql } from "~/gql";

export const UsersFindOneDocument = graphql(`
  query UsersFindOne {
    UsersFindOne {
      _id
      firstName
      lastName
      email
      userName
      type
      profilePicture {
        url
      }
    }
  }
`);
