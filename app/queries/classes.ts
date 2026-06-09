import { graphql } from "~/gql";

export const ClassesAdminFindManyDocument = graphql(/* GraphQL */ `
  query ClassesAdminFindMany($filter: FilterFindManyclassesInput, $limit: Int, $sort: [SortFindManyclassesInput!]) {
    ClassesAdminFindMany(filter: $filter, limit: $limit, sort: $sort) {
      _id
      title
      description
      order
      free
      deleted
      curriculum
      cover { type url }
    }
  }
`);

export const ClassesAdminFindOneDocument = graphql(/* GraphQL */ `
  query ClassesAdminFindOne($filter: FilterFindOneclassesInput) {
    ClassesAdminFindOne(filter: $filter) {
      _id
      title
      description
      order
      free
      deleted
      curriculum
      cover { type url }
    }
  }
`);
