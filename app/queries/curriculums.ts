import { graphql } from "~/gql";

export const CurriculumsFindManyDocument = graphql(/* GraphQL */ `
  query CurriculumsFindMany($filter: curriculumsInput, $limit: Int, $sort: curriculumsSortEnum) {
    CurriculumsFindMany(filter: $filter, limit: $limit, sort: $sort) {
      _id
      title
      description
      slug
      active
      hidden
      grade
      category
      order
      totalLesson
      curriculumCollection { _id }
      cover { type url }
    }
  }
`);

export const CurriculumsFindOneDocument = graphql(/* GraphQL */ `
  query CurriculumsFindOne($filter: curriculumsInput) {
    CurriculumsFindOne(filter: $filter) {
      _id
      title
      description
      slug
      active
      hidden
      grade
      category
      order
      totalLesson
      curriculumCollection { _id }
      cover { type url }
    }
  }
`);

// Re-exported from app/mutations/curriculums.ts so step-3's "Manage Series"
// flow can import all curriculum operations from a single colocated module.
// The canonical document lives in app/mutations/curriculums.ts (used by
// existing callers); duplicating it would collide on operation name during
// codegen.
export { CurriculumsUpdateOneDocument } from "~/mutations/curriculums";
