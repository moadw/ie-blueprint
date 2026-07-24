import { graphql } from "~/gql";

/**
 * Mutation de creación del "Impact Hub" de distrito (tab /district/impact).
 *
 * El tipo `impact` es el único tipo "post-like" del backend blueprint.kids con
 * discriminador (`type`) + contenido; ver `~/queries/impact`. Esta mutation
 * habilita la creación desde el hub (modal "Share a Story"). Convención de
 * datos (acordada con backend, 2026-06-17): `user`/`userType`/`school` guardan
 * TEXTO directo (nombre de autor / rol / nombre de escuela), NO IDs. Para
 * `feedback`, el rating 1-5 se guarda en `title` (la costura lo parsea de ahí,
 * ver `parseRating` en `~/lib/district-impact.server`).
 *
 * Scoping (2026-07-23): cada registro se estampa con `organization` (la org del
 * distrito activo) + `platform` (`env.PLATFORM`) para que el hub lo lea filtrado
 * por distrito. Ambos valores llegan como props desde la costura del loader.
 */
export const ImpactCreateOneDocument = graphql(/* GraphQL */ `
  mutation ImpactCreateOne($record: CreateOneimpactInput!) {
    ImpactCreateOne(record: $record) {
      recordId
      record {
        _id
        type
        title
        description
        cover {
          type
          url
        }
        school
        user
        userType
        order
        deleted
        organization
        platform
        createdAt
      }
      error {
        message
      }
    }
  }
`);
