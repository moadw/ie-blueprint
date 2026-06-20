import { graphql } from "~/gql";

/**
 * Queries de agregación del backend blueprint.kids para el dashboard de
 * analytics de distrito. Existen en el schema pero la app no las usaba aún.
 * Firmas verificadas contra app/gql/graphql.ts (2026-06-16).
 *
 * ESTADO RUNTIME (verificado 2026-06-16 con token district-admin de IDEA):
 *  - ✅ UserTotalsFindMany(district) → OK (schools/groups/districts reales;
 *       students/teachers vinieron en 0).
 *  - ❌ OrganizationUserHistoryFindMany → BUG backend (PlanExecutor 'newRoot'
 *       MISSING) con cualquier dateField.
 *  - ❌ UsersSparksTotals → BUG backend ("Invalid type" en getSparksTotals).
 *  - ❌ GroupProgressByOrganizationFindMany → Access denied (district-admin no
 *       tiene el rol requerido).
 *  Por eso v1 del dashboard va con MOCK; se conecta data real cuando el backend
 *  arregle los bugs / habilite el rol. Ver memoria district-analytics-backend-queries.
 *
 * Args clave:
 *  - `organization` → district.organization
 *  - `district`     → district._id
 *  - `dateField`    → nombre del campo de fecha a agrupar (p.ej. "lastLogin",
 *    "createdAt"); valor exacto pendiente de verificación en runtime.
 *  - `type`         → tipo de usuario (p.ej. teacher/student); pendiente runtime.
 */

// Serie temporal de usuarios activos por organización (count por fecha).
export const OrganizationUserHistoryFindManyDocument = graphql(`
  query OrganizationUserHistoryFindMany(
    $dateField: String!
    $organization: String
    $startDate: String
    $endDate: String
    $type: String
  ) {
    OrganizationUserHistoryFindMany(
      dateField: $dateField
      organization: $organization
      startDate: $startDate
      endDate: $endDate
      type: $type
    ) {
      date
      count
    }
  }
`);

// Totales de entidades (estudiantes, docentes, escuelas, grupos, distritos).
export const UserTotalsFindManyDocument = graphql(`
  query UserTotalsFindMany(
    $district: String
    $school: String
    $global: Boolean
  ) {
    UserTotalsFindMany(district: $district, school: $school, global: $global) {
      students
      teachers
      schools
      groups
      districts
    }
  }
`);

// Puntos (sparks) agregados por periodo — proxy de engagement.
export const UsersSparksTotalsDocument = graphql(`
  query UsersSparksTotals(
    $district: String
    $school: String
    $group: String
    $global: Boolean
    $startDate: String
    $endDate: String
    $type: String
  ) {
    UsersSparksTotals(
      district: $district
      school: $school
      group: $group
      global: $global
      startDate: $startDate
      endDate: $endDate
      type: $type
    ) {
      date
      week
      month
      year
      dailyPoints
      weeklyPoints
      monthlyPoints
      total
    }
  }
`);

// Progreso de grupos en la organización — proxy de adopción/avance de currículo.
export const GroupProgressByOrganizationFindManyDocument = graphql(`
  query GroupProgressByOrganizationFindMany(
    $organization: String!
    $startDate: String
    $endDate: String
  ) {
    GroupProgressByOrganizationFindMany(
      organization: $organization
      startDate: $startDate
      endDate: $endDate
    ) {
      _id
      group
      curriculum
      progress
      finishedClasses
      finishedLesson
      nextClass
      nextLesson
      createdAt
      updatedAt
    }
  }
`);
