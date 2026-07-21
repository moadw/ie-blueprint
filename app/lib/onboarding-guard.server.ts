import { redirect } from "react-router";

import { gqlClient } from "~/lib/graphql";
import { safe } from "~/lib/safe-loader";
import { SchoolByUsersFindManyDocument } from "~/queries/schools";
import type { UsersFindOneQuery } from "~/gql/graphql";

type OnboardingUser = NonNullable<UsersFindOneQuery["UsersFindOne"]>;

/**
 * Force a self-signed-up teacher who has not yet picked a school back into the
 * onboarding flow.
 *
 * This applies ONLY to **org-joined** teachers — i.e. accounts minted through
 * the `/join/:code` invite flow, which carry a non-null `user.organization`.
 * Normal district-provisioned teachers and admins (no `organization`) are never
 * touched, so the ordinary classroom experience is unaffected.
 *
 * Membership is read via `SchoolByUsersFindMany` (a non-null, non-empty array
 * means the teacher belongs to at least one school). An org-joined teacher with
 * an empty membership is redirected to `/onboarding/account` to finish picking
 * a school.
 *
 * Fail-open on a transient backend error (CLAUDE.md resilient-loader rule): the
 * membership call is `safe()`-wrapped and a `safe()` error returns WITHOUT
 * redirecting, so a flaky Blueprint 500 never traps the teacher in a redirect.
 *
 * No redirect loop: `/onboarding/account` does not call this guard, so it is
 * naturally exempt — the guard is applied only in the classroom-entry loaders.
 *
 * @param request  The loader request (reserved; not read today).
 * @param token    The session `access-token` for the GraphQL call.
 * @param user     The caller's already-fetched `UsersFindOne` record.
 */
export async function requireSchoolAssigned(
  request: Request,
  token: string,
  user: OnboardingUser,
): Promise<void> {
  // Only org-joined teachers are subject to the school-assignment gate. Non-org
  // teachers (district-provisioned) and any non-teacher caller pass through.
  if (user.typeObj?.identifier !== "teacher") return;
  if (!user.organization) return;

  const membershipRes = await safe(
    gqlClient.request(
      SchoolByUsersFindManyDocument,
      { user: user._id },
      { "access-token": token },
    ),
  );

  // Fail open: never redirect (and never trap a teacher) on a transient 500 —
  // we can't distinguish "no school" from "backend errored" here.
  if (!membershipRes.ok) return;

  const memberships = membershipRes.data.SchoolByUsersFindMany ?? [];
  const hasSchool = memberships.some((s) => s != null);
  if (!hasSchool) {
    throw redirect("/onboarding/account");
  }
}
