import { graphql } from "~/gql";

export const GroupFindManyDocument = graphql(`
  query GroupFindMany($filter: groupsInput, $limit: Int, $skip: Int) {
    GroupFindMany(filter: $filter, limit: $limit, skip: $skip) {
      _id
      name
      grade
      manager
      organization
      platform
      curriculums
      cover {
        url
        type
      }
      managerObj {
        _id
        firstName
        lastName
        email
      }
    }
  }
`);

export const GroupFindOneDocument = graphql(`
  query GroupFindOne($filter: groupsInput) {
    GroupFindOne(filter: $filter) {
      _id
      name
      grade
      manager
      organization
      platform
      curriculumsObj {
        _id
        title
        slug
        order
        grade
        totalLesson
        cover {
          type
          url
        }
        bgImage {
          type
          url
        }
        language {
          english { title description }
          spanish { title description }
        }
      }
    }
  }
`);

export const GroupProgressFindOneDocument = graphql(`
  query GroupProgressFindOne($filter: groupprogressInput) {
    GroupProgressFindOne(filter: $filter) {
      _id
      group
      curriculum
      progress
      finishedClasses
      nextClass
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
