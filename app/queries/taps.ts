import { graphql } from "~/gql";

export const TapFindManyDocument = graphql(/* GraphQL */ `
  query TapFindMany($filter: FilterFindManytapInput, $limit: Int, $skip: Int, $sort: SortFindManytapInput) {
    TapFindMany(filter: $filter, limit: $limit, skip: $skip, sort: $sort) {
      _id
      class
      title
      order
      type
      points
      intro
      description
      platform
      slug
      deleted
      time
      createdAt
      updatedAt
      cover { url type }
      videos {
        _id
        url
        skip
        type
        narrator
        thumbnail { url type }
        captions {
          language
          available
          file { url }
        }
      }
      extraQuestions {
        question
        points
      }
    }
  }
`);

export const TapTypeFindManyDocument = graphql(/* GraphQL */ `
  query TapTypeFindMany($filter: FilterFindManytaptypeInput, $limit: Int, $sort: SortFindManytaptypeInput) {
    TapTypeFindMany(filter: $filter, limit: $limit, sort: $sort) {
      _id
      identifier
      label
    }
  }
`);
