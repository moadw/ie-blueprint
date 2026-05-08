import { graphql } from "~/gql";

export const CurriculumsCreateOneDocument = graphql(/* GraphQL */ `
  mutation CurriculumsCreateOne($record: CreateOnecurriculumsInput!) {
    CurriculumsCreateOne(record: $record) {
      recordId
      record {
        _id
        title
        slug
        active
        hidden
      }
      error { message }
    }
  }
`);

export const CurriculumsUpdateOneDocument = graphql(/* GraphQL */ `
  mutation CurriculumsUpdateOne($_id: String!, $record: UpdateByIdcurriculumsInput!) {
    CurriculumsUpdateOne(_id: $_id, record: $record) {
      recordId
      record {
        _id
        title
        slug
        active
        hidden
        description
        grade
        order
        cover { type url }
      }
      error { message }
    }
  }
`);
