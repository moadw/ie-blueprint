import { graphql } from "~/gql";

export const LicensePresetFindManyDocument = graphql(/* GraphQL */ `
  query LicensePresetFindMany(
    $filter: FilterFindManylicensepresetInput
    $skip: Int
    $limit: Int
    $sort: SortFindManylicensepresetInput
  ) {
    LicensePresetFindMany(
      filter: $filter
      skip: $skip
      limit: $limit
      sort: $sort
    ) {
      _id
      identifier
      label
      description
      platform
      courses
      createdAt
      updatedAt
    }
  }
`);

export const LicensePresetFindOneDocument = graphql(/* GraphQL */ `
  query LicensePresetFindOne($filter: FilterFindOnelicensepresetInput) {
    LicensePresetFindOne(filter: $filter) {
      _id
      identifier
      label
      description
      platform
      courses
      createdAt
      updatedAt
    }
  }
`);

export const LicensePresetCreateOneDocument = graphql(/* GraphQL */ `
  mutation LicensePresetCreateOne($record: CreateOnelicensepresetInput!) {
    LicensePresetCreateOne(record: $record) {
      recordId
      record {
        _id
        identifier
        label
        description
        platform
        courses
        createdAt
        updatedAt
      }
      error {
        message
      }
    }
  }
`);

export const LicensePresetUpdateOneDocument = graphql(/* GraphQL */ `
  mutation LicensePresetUpdateOne(
    $_id: String!
    $record: UpdateByIdlicensepresetInput!
  ) {
    LicensePresetUpdateOne(_id: $_id, record: $record) {
      recordId
      record {
        _id
        identifier
        label
        description
        platform
        courses
        createdAt
        updatedAt
      }
      error {
        message
      }
    }
  }
`);

export const LicensePresetDeleteOneDocument = graphql(/* GraphQL */ `
  mutation LicensePresetDeleteOne($_id: String!) {
    LicensePresetDeleteOne(_id: $_id)
  }
`);
