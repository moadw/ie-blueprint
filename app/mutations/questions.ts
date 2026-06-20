import { graphql } from "~/gql";

// Question text lives in `label` — there is no `question` field on the
// questions collection.
export const QuestionsCreateOneDocument = graphql(/* GraphQL */ `
  mutation QuestionsCreateOne($record: CreateOnequestionsInput!) {
    QuestionsCreateOne(record: $record) {
      recordId
      record {
        _id
        label
      }
      error { message }
    }
  }
`);

export const QuestionsUpdateOneDocument = graphql(/* GraphQL */ `
  mutation QuestionsUpdateOne($_id: String!, $record: UpdateByIdquestionsInput!) {
    QuestionsUpdateOne(_id: $_id, record: $record) {
      recordId
      record {
        _id
        label
      }
      error { message }
    }
  }
`);
