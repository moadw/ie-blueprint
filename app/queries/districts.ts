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

// Federated (payment subgraph) fuzzy search + pagination over districts.
// Platform is forced from the session (no `platform` arg): platform admins see
// only their platform, global admins see all. With `query` present the primary
// order is relevance and `sortBy` is the tiebreaker; without `query` it returns
// every district ordered purely by `sortBy`. `total` reflects the fuzzy match
// count — use it for the paginator, don't compare it against a client count.
export const DistrictSearchDocument = graphql(`
  query DistrictSearch(
    $query: String
    $sortBy: String
    $sortOrder: Int
    $limit: Int
    $skip: Int
  ) {
    DistrictSearch(
      query: $query
      sortBy: $sortBy
      sortOrder: $sortOrder
      limit: $limit
      skip: $skip
    ) {
      total
      data {
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
  }
`);

// Lean projection of DistrictSearch for combobox/autocomplete options — just
// enough to display (name/state) and connect a user to its org (organization).
// Powers `<DistrictCombobox />` via the `/resources/district-search` route.
export const DistrictSearchOptionsDocument = graphql(`
  query DistrictSearchOptions(
    $query: String
    $sortBy: String
    $sortOrder: Int
    $limit: Int
    $skip: Int
  ) {
    DistrictSearch(
      query: $query
      sortBy: $sortBy
      sortOrder: $sortOrder
      limit: $limit
      skip: $skip
    ) {
      total
      data {
        _id
        name
        state
        organization
      }
    }
  }
`);

// Exact district lookup for combobox preselection (e.g. resolve the district a
// user already belongs to from its `organization`). Lean, same option shape.
export const DistrictOptionsFindManyDocument = graphql(`
  query DistrictOptionsFindMany(
    $filter: FilterFindManydistrictInput
    $limit: Int
  ) {
    DistrictFindMany(filter: $filter, limit: $limit) {
      _id
      name
      state
      organization
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
