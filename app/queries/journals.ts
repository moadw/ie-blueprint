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
