import { graphql } from "~/gql";

export const DistrictFindManyDocument = graphql(`
  query DistrictFindMany(
    $filter: FilterFindManydistrictInput
    $limit: Int
    $skip: Int
    $sort: SortFindManydistrictInput
  ) {
    DistrictFindMany(filter: $filter, limit: $limit, skip: $skip, sort: $sort) {
      _id
      name
      state
      country
      platform
      organization
      courses
      coursesCollections
      licenseLabel
      licenseExpDate
      userTotal
      schoolLicense
      coverPhoto {
        type
        url
      }
      logo {
        type
        url
      }
      createdAt
      updatedAt
    }
  }
`);

export const DistrictCreateOneDocument = graphql(`
  mutation DistrictCreateOne($record: CreateOnedistrictInput!) {
    DistrictCreateOne(record: $record) {
      error {
        message
      }
      record {
        _id
        name
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

export const DistrictUpdateOneDocument = graphql(`
  mutation DistrictUpdateOne(
    $_id: String!
    $record: UpdateByIddistrictInput!
  ) {
    DistrictUpdateOne(_id: $_id, record: $record) {
      error {
        message
      }
      record {
        _id
        name
        state
        country
        platform
        organization
        courses
        coursesCollections
        licenseLabel
        licenseExpDate
        userTotal
        schoolLicense
        createdAt
        updatedAt
      }
      recordId
    }
  }
`);

export const DistrictProfileFindManyDocument = graphql(`
  query DistrictProfileFindMany(
    $filter: FilterFindManydistrictprofileInput
    $limit: Int
    $skip: Int
  ) {
    DistrictProfileFindMany(filter: $filter, limit: $limit, skip: $skip) {
      _id
      district
      city
      address
      website
      cover {
        type
        url
      }
      logo {
        type
        url
      }
    }
  }
`);

export const DistrictProfileFindOneDocument = graphql(`
  query DistrictProfileFindOne($filter: FilterFindOnedistrictprofileInput) {
    DistrictProfileFindOne(filter: $filter) {
      _id
      district
      city
      address
      website
      cover {
        type
        url
      }
      logo {
        type
        url
      }
    }
  }
`);

export const DistrictFindOneDocument = graphql(`
  query DistrictFindOne($filter: FilterFindOnedistrictInput) {
    DistrictFindOne(filter: $filter) {
      _id
      name
      organization
      coverPhoto {
        type
        url
      }
      logo {
        type
        url
      }
    }
  }
`);

export const DistrictProfileCreateOneDocument = graphql(`
  mutation DistrictProfileCreateOne($record: districtprofileInput) {
    DistrictProfileCreateOne(record: $record) {
      _id
      district
      city
      address
      website
      cover {
        type
        url
      }
      logo {
        type
        url
      }
    }
  }
`);

export const DistrictProfileUpdateOneDocument = graphql(`
  mutation DistrictProfileUpdateOne(
    $_id: String!
    $record: districtprofileInput
  ) {
    DistrictProfileUpdateOne(_id: $_id, record: $record)
  }
`);

export const UserDistrictFindOneDocument = graphql(`
  query UserDistrictFindOne {
    UserDistrictFindOne {
      _id
      name
      state
      country
      organization
      platform
      exemptionDates
      extraCourse
      slug
      courses
      coursesCollections
      licenseLabel
      address
      website
      city
      deletedAt
      createdAt
      updatedAt
      coverPhoto {
        url
        type
      }
      logo {
        url
        type
      }
    }
  }
`);
