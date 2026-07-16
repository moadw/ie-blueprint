import { graphql } from "~/gql";

export const UsersFindOneDocument = graphql(`
  query UsersFindOne($_id: String) {
    UsersFindOne(_id: $_id) {
      _id
      firstName
      lastName
      email
      userName
      createdAt
      type
      typeObj {
        identifier
      }
      organization
      platform
      profilePicture {
        url
      }
    }
  }
`);

export const UserSearchDocument = graphql(`
  query UserSearch(
    $districtId: String
    $schoolId: String
    $type: String
    $search: String
    $sortBy: String
    $sortOrder: Int
    $limit: Int
    $skip: Int
    $platformId: String
    $organizationId: String
  ) {
    UserSearch(
      districtId: $districtId
      schoolId: $schoolId
      type: $type
      search: $search
      sortBy: $sortBy
      sortOrder: $sortOrder
      limit: $limit
      skip: $skip
      platformId: $platformId
      organizationId: $organizationId
    ) {
      total
      data {
        userId
        firstName
        lastName
        email
        organization_id
        organization_name
        type_id
        type_name
        createdAt
        updatedAt
        lastLogin
        schools {
          school_id
          school_name
          region_id
          region_name
        }
        groups {
          group_id
          group_name
        }
      }
    }
  }
`);

// District-home engagement gauge: the real total-users count for an org. Used
// as the gauge's center number ("Users") and the Active User Rate denominator.
// `UserTotalsFindMany.students` is unreliable (returns 0), so this is the live
// org user count. `total` is the headline; `type` (optional, unused here) could
// later scope to a single user type.
export const UsersByOrganizationTotalDocument = graphql(`
  query UsersByOrganizationTotal($organization: String!) {
    UsersByOrganizationFindMany(organization: $organization) {
      total
    }
  }
`);

export const UserTypesFindManyDocument = graphql(`
  query UserTypesFindMany(
    $filter: FilterFindManyusertypesInput
    $limit: Int
    $skip: Int
    $sort: SortFindManyusertypesInput
  ) {
    UserTypesFindMany(filter: $filter, limit: $limit, skip: $skip, sort: $sort) {
      _id
      identifier
      label
    }
  }
`);
