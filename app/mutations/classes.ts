import { graphql } from "~/gql";

export const ClassesCreateOneDocument = graphql(/* GraphQL */ `
  mutation ClassesCreateOne($record: CreateOneclassesInput!) {
    ClassesCreateOne(record: $record) {
      recordId
      record {
        _id
        title
        description
        order
        free
        deleted
        curriculum
        cover { type url }
      }
      error { message }
    }
  }
`);

export const ClassesUpdateOneDocument = graphql(/* GraphQL */ `
  mutation ClassesUpdateOne($_id: String!, $record: UpdateByIdclassesInput!) {
    ClassesUpdateOne(_id: $_id, record: $record) {
      recordId
      record {
        _id
        title
        description
        order
        free
        deleted
        curriculum
        cover { type url }
      }
      error { message }
    }
  }
`);

// ClassesDeleteOne returns a String, not a payload object — no inner selection set.
export const ClassesDeleteOneDocument = graphql(/* GraphQL */ `
  mutation ClassesDeleteOne($_id: String!) {
    ClassesDeleteOne(_id: $_id)
  }
`);

// ClassReorder moves a class to `order` (0-based rank in the ORDER_ASC list,
// verified against the backend) within its curriculum and cascades the order
// field of every subsequent class server-side, so a drag-and-drop reorder needs
// a single call rather than N per-row updates. Returns a String scalar — no
// inner selection set.
export const ClassReorderDocument = graphql(/* GraphQL */ `
  mutation ClassReorder($id: String!, $order: Int!) {
    ClassReorder(id: $id, order: $order)
  }
`);
