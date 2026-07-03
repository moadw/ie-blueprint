import { graphql } from "~/gql";

export const AnnouncementCreateOneDocument = graphql(/* GraphQL */ `
  mutation AnnouncementCreateOne($record: CreateOneannouncementInput!) {
    AnnouncementCreateOne(record: $record) {
      recordId
      record { _id message type active createdAt }
      error { message }
    }
  }
`);

export const AnnouncementUpdateOneDocument = graphql(/* GraphQL */ `
  mutation AnnouncementUpdateOne($_id: String!, $record: UpdateByIdannouncementInput!) {
    AnnouncementUpdateOne(_id: $_id, record: $record) {
      recordId
      record { _id message type active createdAt }
      error { message }
    }
  }
`);

// AnnouncementDeleteOne returns a String, not a payload object — no inner selection set.
export const AnnouncementDeleteOneDocument = graphql(/* GraphQL */ `
  mutation AnnouncementDeleteOne($_id: String!) {
    AnnouncementDeleteOne(_id: $_id)
  }
`);
