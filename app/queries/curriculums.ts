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
      cover { type url }
    }
  }
`);
