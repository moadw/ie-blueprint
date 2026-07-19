import { graphql } from "~/gql";

export const SchoolFindManyDocument = graphql(`
  query SchoolFindMany($filter: schoolsDataInput, $limit: Int, $skip: Int) {
    SchoolFindMany(filter: $filter, limit: $limit, skip: $skip) {
      _id
      name
      district
      city
      state
      country
      platform
      createdAt
      updatedAt
      deletedAt
    }
  }
`);

export const SchoolFindOneDocument = graphql(`
  query SchoolFindOne($filter: schoolsDataInput) {
    SchoolFindOne(filter: $filter) {
      _id
      name
      district
      city
      state
      country
      platform
      createdAt
      deletedAt
    }
  }
`);

export const SchoolByUsersFindManyDocument = graphql(`
  query SchoolByUsersFindMany($user: String) {
    SchoolByUsersFindMany(user: $user) {
      _id
      name
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
