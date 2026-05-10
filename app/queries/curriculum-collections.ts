import { graphql } from "~/gql";

export const CurriculumCollectionFindManyDocument = graphql(/* GraphQL */ `
  query curriculumCollectionFindMany(
    $filter: CurriculumCollectionFilterInput
    $sort: curriculumCollectionSortEnum
    $limit: Int
    $offset: Int
  ) {
    curriculumCollectionFindMany(
      filter: $filter
      sort: $sort
      limit: $limit
      offset: $offset
    ) {
      items {
        _id
        name
        slug
        description
        gradeLevel
        color
        active
        createdAt
        updatedAt
      }
      total
      limit
      offset
    }
  }
`);

export const CurriculumCollectionFindOneDocument = graphql(/* GraphQL */ `
  query curriculumCollectionFindOne($id: String!) {
    curriculumCollectionFindOne(id: $id) {
      _id
      name
      slug
      description
      gradeLevel
      color
      active
      createdAt
      updatedAt
    }
  }
`);

export const CurriculumCollectionCreateOneDocument = graphql(/* GraphQL */ `
  mutation curriculumCollectionCreateOne($input: CurriculumCollectionCreateInput!) {
    curriculumCollectionCreateOne(input: $input) {
      _id
      name
      slug
      description
      gradeLevel
      color
      active
      createdAt
      updatedAt
    }
  }
`);

export const CurriculumCollectionUpdateOneDocument = graphql(/* GraphQL */ `
  mutation curriculumCollectionUpdateOne(
    $id: String!
    $input: CurriculumCollectionUpdateInput!
  ) {
    curriculumCollectionUpdateOne(id: $id, input: $input) {
      _id
      name
      slug
      description
      gradeLevel
      color
      active
      createdAt
      updatedAt
    }
  }
`);

export const CurriculumCollectionDeleteOneDocument = graphql(/* GraphQL */ `
  mutation curriculumCollectionDeleteOne($id: String!) {
    curriculumCollectionDeleteOne(id: $id) {
      id
      success
    }
  }
`);
