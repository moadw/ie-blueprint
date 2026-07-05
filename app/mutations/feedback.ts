import { graphql } from "~/gql";

export const FeedbackCreateOneDocument = graphql(/* GraphQL */ `
  mutation FeedbackCreateOne($record: CreateOnefeedbackInput!) {
    FeedbackCreateOne(record: $record) {
      recordId
      record {
        _id
        state
        comment
        class
        curriculum
        user
        createdAt
      }
      error {
        message
      }
    }
  }
`);
