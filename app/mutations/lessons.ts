import { graphql } from "~/gql";

export const LessonCreateOneDocument = graphql(/* GraphQL */ `
  mutation LessonCreateOne($record: CreateOnelessonInput!) {
    LessonCreateOne(record: $record) {
      recordId
      record {
        _id
        title
        description
        order
        curriculum
        classificationType
        cover { type url }
      }
      error { message }
    }
  }
`);

export const LessonUpdateOneDocument = graphql(/* GraphQL */ `
  mutation LessonUpdateOne($_id: String!, $record: UpdateByIdlessonInput!) {
    LessonUpdateOne(_id: $_id, record: $record) {
      recordId
      record {
        _id
        title
        description
        order
        curriculum
        classificationType
        cover { type url }
      }
      error { message }
    }
  }
`);

// LessonDeleteOne returns a String, not a payload object — no inner selection set.
export const LessonDeleteOneDocument = graphql(/* GraphQL */ `
  mutation LessonDeleteOne($_id: String!) {
    LessonDeleteOne(_id: $_id)
  }
`);
