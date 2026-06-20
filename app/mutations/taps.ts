import { graphql } from "~/gql";

export const TapCreateOneDocument = graphql(/* GraphQL */ `
  mutation TapCreateOne($record: CreateOnetapInput!) {
    TapCreateOne(record: $record) {
      recordId
      record {
        _id
        title
        order
      }
      error { message }
    }
  }
`);

// Selecting videos { _id } lets callers read back server-assigned video
// subdocument ids after save (required by the thumbnail/caption upload
// endpoints, which take the video subdocument _id).
export const TapUpdateOneDocument = graphql(/* GraphQL */ `
  mutation TapUpdateOne($_id: String!, $record: UpdateByIdtapInput!) {
    TapUpdateOne(_id: $_id, record: $record) {
      recordId
      record {
        _id
        title
        order
        videos { _id }
      }
      error { message }
    }
  }
`);

// No TapDeleteOne document — deletion is soft (TapUpdateOne with
// { deleted: true }), mirroring the classes convention.
