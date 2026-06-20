import { graphql } from "~/gql";

export const PinFindManyDocument = graphql(/* GraphQL */ `
  query PinFindMany($filter: FilterFindManypinInput, $limit: Int, $skip: Int, $sort: SortFindManypinInput) {
    PinFindMany(filter: $filter, limit: $limit, skip: $skip, sort: $sort) {
      _id
      label
      class
      curriculum
      platform
      order
      deletedAt
      cover { type url }
      video { type url }
    }
  }
`);

export const PinFindOneDocument = graphql(/* GraphQL */ `
  query PinFindOne($filter: FilterFindOnepinInput) {
    PinFindOne(filter: $filter) {
      _id
      label
      class
      curriculum
      platform
      order
      deletedAt
      cover { type url }
      video { type url }
    }
  }
`);
