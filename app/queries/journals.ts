import { graphql } from "~/gql";

// Look up the current teacher's saved journal for a class — filter by
// `teacher` (the logged-in teacher's user id) + `class` (the practice/class
// id). The practice player uses this to switch the journal form into a
// read-only "already submitted" state (Continue instead of Save, textarea
// disabled). Flat `{ _id body }` selection — the body pre-fills the read-only
// editor.
export const JournalsFindOneDocument = graphql(/* GraphQL */ `
  query JournalsFindOne($filter: FilterFindOnejournalsInput) {
    JournalsFindOne(filter: $filter) {
      _id
      body
    }
  }
`);

// List the logged-in teacher's own journals for the /settings/journals page.
// Filter by `teacher` (the teacher's user id) — journals carry a dedicated
// `teacher` field for teacher-authored entries. `_ID_DESC` is the only
// creation-ordered sort the schema exposes (Mongo ObjectIds are monotonic),
// so it yields newest-first. Selection covers exactly what the entry card
// renders: `body` (content), `question` (prompt), `createdAt` (date), and any
// image `documents` (attachment thumbnail).
export const JournalsFindManyDocument = graphql(/* GraphQL */ `
  query JournalsFindMany(
    $filter: FilterFindManyjournalsInput
    $sort: SortFindManyjournalsInput
    $limit: Int
  ) {
    JournalsFindMany(filter: $filter, sort: $sort, limit: $limit) {
      _id
      body
      question
      createdAt
      documents {
        title
        type
        url
      }
    }
  }
`);
