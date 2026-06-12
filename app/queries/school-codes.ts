import { graphql } from "~/gql";

export const SchoolCodeFindManyDocument = graphql(`
  query SchoolCodeFindMany($filter: FilterFindManyschoolcodeInput, $limit: Int) {
    SchoolCodeFindMany(filter: $filter, limit: $limit) {
      _id
      code
      district
      expirationDate
      createdAt
    }
  }
`);

export const SchoolCodeCreateOneDocument = graphql(`
  mutation SchoolCodeCreateOne($record: CreateOneschoolcodeInput!) {
    SchoolCodeCreateOne(record: $record) {
      error {
        message
      }
      recordId
      record {
        _id
        code
        district
        expirationDate
        createdAt
      }
    }
  }
`);

export const SchoolCodeDeleteOneDocument = graphql(`
  mutation SchoolCodeDeleteOne($schoolCode: String!) {
    SchoolCodeDeleteOne(schoolCode: $schoolCode)
  }
`);
