import { graphql } from "~/gql";

// Persist a student's journal entry. Backend stamps user/platform from the
// session token, so no `platform`/`user` args. `question` is a free String
// (we pass the prompt text); there is no media argument, so journal media
// uploads are not persisted. Returns `JournalProgressCheck` — selecting only
// `journal { _id }` (no `error`/ErrorInterface field on the payload).
export const JournalsCreateOneDocument = graphql(/* GraphQL */ `
  mutation JournalsCreateOne(
    $body: String!
    $question: String!
    $tap: String!
    $class: String
    $group: String
  ) {
    JournalsCreateOne(
      body: $body
      question: $question
      tap: $tap
      class: $class
      group: $group
    ) {
      journal {
        _id
      }
    }
  }
`);
