import { graphql } from "~/gql";

export const AnnouncementFindManyDocument = graphql(/* GraphQL */ `
  query AnnouncementFindMany(
    $filter: FilterFindManyannouncementInput
    $limit: Int
    $skip: Int
    $sort: SortFindManyannouncementInput
  ) {
    AnnouncementFindMany(filter: $filter, limit: $limit, skip: $skip, sort: $sort) {
      _id
      message
      type
      active
      createdAt
    }
  }
`);
