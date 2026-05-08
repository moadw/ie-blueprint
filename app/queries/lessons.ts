import { graphql } from "~/gql";

export const LessonFindManyDocument = graphql(/* GraphQL */ `
  query LessonFindMany($filter: lessonInput, $limit: Int, $sort: lessonSortEnumTC) {
    LessonFindMany(filter: $filter, limit: $limit, sort: $sort) {
      _id
      title
      description
      order
      class
      curriculum
      classificationType
      lifeSkill
      deleted
      cover { type url }
    }
  }
`);
