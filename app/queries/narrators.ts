import { graphql } from "~/gql";

export const NarratorsFindManyDocument = graphql(/* GraphQL */ `
  query narratorsFindMany(
    $filter: NarratorFilterInput
    $sort: narratorSortEnum
    $limit: Int
    $offset: Int
  ) {
    narratorsFindMany(
      filter: $filter
      sort: $sort
      limit: $limit
      offset: $offset
    ) {
      items {
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
      total
      limit
      offset
    }
  }
`);

export const NarratorsFindOneDocument = graphql(/* GraphQL */ `
  query narratorsFindOne($id: String!) {
    narratorsFindOne(id: $id) {
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
  mutation narratorsCreateOne($input: NarratorCreateInput!) {
    narratorsCreateOne(input: $input) {
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

export const NarratorsUpdateOneDocument = graphql(/* GraphQL */ `
  mutation narratorsUpdateOne($id: String!, $input: NarratorUpdateInput!) {
    narratorsUpdateOne(id: $id, input: $input) {
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

export const NarratorsDeleteOneDocument = graphql(/* GraphQL */ `
  mutation narratorsDeleteOne($id: String!) {
    narratorsDeleteOne(id: $id) {
      id
      success
    }
  }
`);
