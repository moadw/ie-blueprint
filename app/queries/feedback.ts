import { graphql } from "~/gql";

// Look up the logged-in user's existing feedback for a practice — filter by
// `user` (the logged-in teacher's id) + `class` (the practice/class id). A flat
// filter object is implicitly ANDed by the backend (no AND/_operators needed).
export const FeedbackFindOneDocument = graphql(/* GraphQL */ `
  query FeedbackFindOne($filter: FilterFindOnefeedbackInput) {
    FeedbackFindOne(filter: $filter) {
      _id
      state
      comment
    }
  }
`);
