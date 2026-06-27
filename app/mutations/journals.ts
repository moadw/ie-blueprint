import { graphql } from "~/gql";

// Persist a teacher's group-scoped journal entry via the teacher variation of
// the journal create. Backend stamps user/platform from the session token, so
// no `platform`/`user` args. `group` is required (group-scoped); `question` is
// an optional free String (we pass the prompt text). There is no `tap` arg and
// no media argument, so journal media uploads are not persisted. Returns the
// `journals` record directly (NOT the progress-coupled `JournalProgressCheck`),
// so the selection is a flat `{ _id }` — no `journal {}`/`badge` wrapper.
export const TeacherGroupJournalCreateOneDocument = graphql(/* GraphQL */ `
  mutation TeacherGroupJournalCreateOne(
    $body: String!
    $question: String
    $group: String!
    $class: String
  ) {
    TeacherGroupJournalCreateOne(
      body: $body
      question: $question
      group: $group
      class: $class
    ) {
      _id
    }
  }
`);
