import { graphql } from "~/gql";

export const CreateUserDocument = graphql(`
  mutation CreateUser(
    $firstName: String!
    $lastName: String!
    $email: String!
    $type: String!
    $organization: String
    $password: String
    $platform: String
    $sendEmail: Boolean
  ) {
    CreateUser(
      firstName: $firstName
      lastName: $lastName
      email: $email
      type: $type
      organization: $organization
      password: $password
      platform: $platform
      sendEmail: $sendEmail
    )
  }
`);

export const UserUpdateOneDocument = graphql(`
  mutation UserUpdateOne($_id: String!, $record: UpdateByIduserInput!) {
    UserUpdateOne(_id: $_id, record: $record) {
      recordId
      record {
        _id
        firstName
        lastName
        email
        type
        organization
      }
      error {
        message
      }
    }
  }
`);

export const DeleteUsersManyDocument = graphql(`
  mutation DeleteUsersMany(
    $users: [String]
    $organization: String
    $school: String
  ) {
    DeleteUsersMany(users: $users, organization: $organization, school: $school)
  }
`);

export const UsersSetPasswordAdminDocument = graphql(`
  mutation UsersSetPasswordAdmin($user: String!, $password: String!) {
    UsersSetPasswordAdmin(user: $user, password: $password)
  }
`);

export const SchoolUserDeleteOneDocument = graphql(`
  mutation SchoolUserDeleteOne($school: String!, $user: String!) {
    SchoolUserDeleteOne(school: $school, user: $user)
  }
`);

export const SetUserSchoolDocument = graphql(`
  mutation SetUserSchool($school: String!, $user: String!) {
    SetUserSchool(school: $school, user: $user)
  }
`);

export const UserJoinByCodeDocument = graphql(`
  mutation UserJoinByCode($code: String!) {
    UserJoinByCode(code: $code)
  }
`);
