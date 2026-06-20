import { graphql } from "~/gql";

// No limit/skip args exist on this query — callers filter by { platform }
// and match ids client-side.
export const QuestionsFindManyDocument = graphql(/* GraphQL */ `
  query QuestionsFindMany($filter: questionsInput) {
    QuestionsFindMany(filter: $filter) {
      _id
      label
      platform
    }
  }
`);
