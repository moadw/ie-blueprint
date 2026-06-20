import { graphql } from "~/gql";

export const PinCreateOneDocument = graphql(/* GraphQL */ `
  mutation PinCreateOne($record: CreateOnepinInput!) {
    PinCreateOne(record: $record) {
      recordId
      record {
        _id
        label
      }
      error { message }
    }
  }
`);

// PinUpdateOne is a filter-based UpdateMany on the live schema (no `_id` arg;
// payload is { numAffected, error } — NOT the `_id`/recordId shape that
// TapUpdateOne uses). Used to detach a pin from a class (relation-unset),
// since no pin delete endpoint exists.
export const PinUpdateOneDocument = graphql(/* GraphQL */ `
  mutation PinUpdateOne($filter: FilterUpdateManypinInput, $record: UpdateManypinInput!) {
    PinUpdateOne(filter: $filter, record: $record) {
      numAffected
      error { message }
    }
  }
`);
