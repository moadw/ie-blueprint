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
