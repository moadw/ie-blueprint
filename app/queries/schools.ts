import { graphql } from "~/gql";

export const SchoolFindManyDocument = graphql(`
  query SchoolFindMany($filter: schoolsDataInput, $limit: Int, $skip: Int) {
    SchoolFindMany(filter: $filter, limit: $limit, skip: $skip) {
      _id
      name
      district
      state
      country
      platform
      createdAt
      updatedAt
    }
  }
`);

export const SchoolCreateOneDocument = graphql(`
  mutation SchoolCreateOne($record: CreateOneschoolsDataInput!) {
    SchoolCreateOne(record: $record) {
      error {
        message
      }
      record {
        _id
        name
        district
        state
        country
        platform
        createdAt
        updatedAt
      }
      recordId
    }
  }
`);

export const SchoolUpdateOneDocument = graphql(`
  mutation SchoolUpdateOne($_id: String!, $record: UpdateByIdschoolsDataInput!) {
    SchoolUpdateOne(_id: $_id, record: $record) {
      error {
        message
      }
      record {
        _id
        name
        district
        state
        country
        platform
        createdAt
        updatedAt
      }
      recordId
    }
  }
`);
