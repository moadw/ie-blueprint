import { graphql } from "~/gql";

/**
 * Query del "Impact Hub" de distrito (tab /district/impact). El tipo `impact`
 * es el único tipo "post-like" del backend blueprint.kids con discriminador
 * (`type`) + contenido; respalda los cards de historias (testimonial, journal,
 * photo, milestone, feedback). NO existe ningún query `review/post/story`
 * separado — `impact` es la fuente.
 *
 * ESTADO RUNTIME (verificado 2026-06-17 con token district-admin de IDEA):
 *  - ✅ ImpactFindMany → OK (sin bug de backend, a diferencia de las queries de
 *       agregación de analytics).
 *  - ⚠️ VACÍO: 0 registros en todo corte (sin filtro, por escuela, por user,
 *       deleted:false). Por eso la vista cae a samples mientras no haya data real.
 *
 * Scoping (actualizado 2026-07-23): el backend agregó `organization` + `platform`
 * al tipo `impact` (ambos filtrables y seteables en create). El hub ahora se scopea
 * por distrito filtrando `{ organization, platform, deleted:false }` — la org sale
 * de `resolveDistrictAdmin` (el distrito del usuario logeado, o el distrito
 * previsualizado cuando un master admin navega como distrito). Ver
 * `~/lib/district-impact.server`.
 */
export const ImpactFindManyDocument = graphql(`
  query ImpactFindMany($filter: FilterFindManyimpactInput, $limit: Int) {
    ImpactFindMany(filter: $filter, limit: $limit) {
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
  }
`);
