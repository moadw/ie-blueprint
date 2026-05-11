import { graphql } from "~/gql";

export const CurriculumCollectionFindManyDocument = graphql(/* GraphQL */ `
  query curriculumCollectionFindMany(
    $filter: FilterFindManycurriculumcollectionInput
    $skip: Int
    $limit: Int
  ) {
    curriculumCollectionFindMany(filter: $filter, skip: $skip, limit: $limit) {
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

export const CurriculumCollectionFindOneDocument = graphql(/* GraphQL */ `
  query curriculumCollectionFindOne(
    $filter: FilterFindOnecurriculumcollectionInput
  ) {
    curriculumCollectionFindOne(filter: $filter) {
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
  mutation curriculumCollectionCreateOne($record: curriculumcollectionInput!) {
    curriculumCollectionCreateOne(record: $record) {
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
    $record: curriculumcollectionInput!
  ) {
    curriculumCollectionUpdateOne(id: $id, record: $record)
  }
`);

export const CurriculumCollectionDeleteOneDocument = graphql(/* GraphQL */ `
  mutation curriculumCollectionDeleteOne($id: String!) {
    curriculumCollectionDeleteOne(id: $id)
  }
`);
