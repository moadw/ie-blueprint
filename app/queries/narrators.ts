import { graphql } from "~/gql";

export const NarratorsFindManyDocument = graphql(/* GraphQL */ `
  query narratorsFindMany(
    $filter: FilterFindManynarratorsInput
    $skip: Int
    $limit: Int
  ) {
    narratorsFindMany(filter: $filter, skip: $skip, limit: $limit) {
      _id
      name
      bio
      avatar {
        url
        type
      }
      languages
      active
      order
      createdAt
      updatedAt
    }
  }
`);

export const NarratorsFindOneDocument = graphql(/* GraphQL */ `
  query narratorsFindOne($filter: FilterFindOnenarratorsInput) {
    narratorsFindOne(filter: $filter) {
      _id
      name
      bio
      avatar {
        url
        type
      }
      languages
      active
      order
      createdAt
      updatedAt
    }
  }
`);

export const NarratorsCreateOneDocument = graphql(/* GraphQL */ `
  mutation narratorsCreateOne($record: CreateOnenarratorsInput!) {
    narratorsCreateOne: NarratorsCreateOne(record: $record) {
      recordId
      record {
        _id
        name
        bio
        avatar {
          url
          type
        }
        languages
        active
        order
        createdAt
        updatedAt
      }
      error {
        message
      }
    }
  }
`);

export const NarratorsUpdateOneDocument = graphql(/* GraphQL */ `
  mutation narratorsUpdateOne(
    $_id: String!
    $record: UpdateByIdnarratorsInput!
  ) {
    narratorsUpdateOne: NarratorsUpdateOne(_id: $_id, record: $record) {
      recordId
      record {
        _id
        name
        bio
        avatar {
          url
          type
        }
        languages
        active
        order
        createdAt
        updatedAt
      }
      error {
        message
      }
    }
  }
`);

export const NarratorsDeleteOneDocument = graphql(/* GraphQL */ `
  mutation narratorsDeleteOne($id: String!) {
    narratorsDeleteOne: NarratorsDeleteOne(id: $id)
  }
`);
