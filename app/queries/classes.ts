import { graphql } from "~/gql";

export const ClassesAdminFindManyDocument = graphql(/* GraphQL */ `
  query ClassesAdminFindMany($filter: FilterFindManyclassesInput, $limit: Int, $sort: [SortFindManyclassesInput!]) {
    ClassesAdminFindMany(filter: $filter, limit: $limit, sort: $sort) {
      _id
      title
      description
      order
      free
      feedback
      deleted
      curriculum
      cover { type url }
      background { type url }
      language {
        english { title description }
        spanish { title description }
      }
    }
  }
`);

// Slim projection used ONLY to count practices per series on the admin content
// index. Selects just the fields needed to bucket + filter (`_id`, `curriculum`,
// `deleted`) so one platform-wide request can drive every card's count without
// the heavy cover/background/language payload of `ClassesAdminFindMany`.
export const ClassesAdminCountFindManyDocument = graphql(/* GraphQL */ `
  query ClassesAdminCountFindMany($filter: FilterFindManyclassesInput, $limit: Int) {
    ClassesAdminFindMany(filter: $filter, limit: $limit) {
      _id
      curriculum
      deleted
    }
  }
`);

export const ClassesAdminFindOneDocument = graphql(/* GraphQL */ `
  query ClassesAdminFindOne($filter: FilterFindOneclassesInput) {
    ClassesAdminFindOne(filter: $filter) {
      _id
      title
      description
      order
      free
      deleted
      curriculum
      cover { type url }
      background { type url }
    }
  }
`);

// Teacher/classroom flow: the `*Admin*` resolvers require an admin role and are
// access-denied for teacher users. These non-admin endpoints back the classroom
// curriculum + practice-detail routes instead. `ClassesByCurriculumFindOne`
// returns the curriculum's classes as an array (despite the "FindOne" name) and
// takes only `curriculum` — order/deleted filtering is done client-side.
export const ClassesByCurriculumFindOneDocument = graphql(/* GraphQL */ `
  query ClassesByCurriculumFindOne($curriculum: String!) {
    ClassesByCurriculumFindOne(curriculum: $curriculum) {
      _id
      title
      description
      order
      free
      deleted
      curriculum
      cover { type url }
      background { type url }
      language {
        english { title description }
        spanish { title description }
      }
    }
  }
`);

export const ClassesFindOneDocument = graphql(/* GraphQL */ `
  query ClassesFindOne($_id: String!) {
    ClassesFindOne(_id: $_id) {
      _id
      title
      description
      order
      free
      feedback
      deleted
      curriculum
      cover { type url }
      background { type url }
      language {
        english { title description }
        spanish { title description }
      }
    }
  }
`);
