import { graphql } from "~/gql";

export const GroupFindManyDocument = graphql(`
  query GroupFindMany($filter: groupsInput) {
    GroupFindMany(filter: $filter) {
      _id
      name
      manager
      organization
      platform
      curriculums
    }
  }
`);

export const GroupCreateOneDocument = graphql(`
  mutation GroupCreateOne(
    $name: String!
    $teacher: String
    $platform: String
    $organization: String
    $curriculums: [String]
  ) {
    GroupCreateOne(
      name: $name
      teacher: $teacher
      platform: $platform
      organization: $organization
      curriculums: $curriculums
    ) {
      _id
      name
      manager
      organization
      platform
      curriculums
    }
  }
`);
