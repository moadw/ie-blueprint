/**
 * Per-school registered-user roster total (step-5).
 *
 * Background: the district-home adoption funnel's "Registered" stage and the
 * analytics tab's "Registered" stage / "Engagement rate" Insight denominator
 * are both, today, `UserTotalsFindMany({district}).students + .teachers`.
 * There is no *proven* school-scoped equivalent:
 *  - `UserTotalsFindMany` DOES declare a `school` arg in the schema (it has
 *    existed since `queries/analytics.ts` was first authored — see that
 *    file's header comment), but no caller has ever passed it, so it has
 *    never been runtime-verified. Worse, `students`/`teachers` are already
 *    flagged UNRELIABLE elsewhere in this codebase (return 0) even for the
 *    long-proven `district` filter (see `queries/users.ts`'s
 *    `UsersByOrganizationTotalDocument` comment) — layering an unverified
 *    `school` filter on top of an already-flaky field is too risky to ship
 *    unverified.
 *  - `UsersBySchoolFindMany` also exists in the schema (a school-keyed twin
 *    of the proven `UsersByOrganizationFindMany`), but adding a NEW
 *    `type`-filtered variant of it would be a second unverified surface for
 *    the same problem.
 *
 * Instead this sums `UserSearch({schoolId, type}).total` per school × usertype
 * — the SAME live roster search the school-detail educator roster already
 * uses in production today (`routes/district.school.$schoolId.tsx`), just
 * resolving both the "teacher" and "student" usertypes (not only "teacher")
 * and summing across a multi-school aggregate. Pure frontend: no new GraphQL
 * document, no backend change, no codegen.
 */
import { gqlClient } from "~/lib/graphql";
import { safe } from "~/lib/safe-loader";
import { UserSearchDocument, UserTypesFindManyDocument } from "~/queries/users";

/**
 * Sum of per-school registered users (teachers + students) across `schoolIds`.
 * Each school × usertype call is `safe()`-wrapped independently so one failed
 * school/type contributes 0 rather than rejecting the whole total (CLAUDE.md
 * "Resilient loaders") — a partial outage undercounts rather than blanking
 * the card. Returns `null` only when NEITHER the "teacher" nor "student"
 * usertype id could be resolved (can't even attempt a count), or `schoolIds`
 * is empty.
 */
export async function getSchoolRosterTotal(
  token: string,
  schoolIds: string[],
): Promise<number | null> {
  if (schoolIds.length === 0) return null;

  const userTypesResult = await safe(
    gqlClient.request(
      UserTypesFindManyDocument,
      { limit: 100 },
      { "access-token": token },
    ),
  );
  const types = userTypesResult.ok
    ? (userTypesResult.data.UserTypesFindMany ?? [])
    : [];
  const typeIds = (["teacher", "student"] as const)
    .map((identifier) => types.find((t) => t?.identifier === identifier)?._id)
    .filter((id): id is string => Boolean(id));
  if (typeIds.length === 0) return null;

  const results = await Promise.all(
    schoolIds.flatMap((schoolId) =>
      typeIds.map((type) =>
        safe(
          gqlClient.request(
            UserSearchDocument,
            { schoolId, type, limit: 1, skip: 0 },
            { "access-token": token },
          ),
        ),
      ),
    ),
  );
  return results.reduce(
    (total, r) => total + (r.ok ? (r.data.UserSearch?.total ?? 0) : 0),
    0,
  );
}
