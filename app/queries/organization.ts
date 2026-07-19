import { graphql } from "~/gql";

export const MyOrganizationFindOneDocument = graphql(`
  query MyOrganizationFindOne {
    MyOrganizationFindOne {
      _id
      name
      code
      platform
    }
  }
`);
