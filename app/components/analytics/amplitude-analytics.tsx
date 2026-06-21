import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useHydrated } from "~/hooks/use-hydrated";
import { useAuthToken } from "~/hooks/use-auth-token";
import { useCurrentUser } from "~/hooks/use-current-user";
import { gqlClient } from "~/lib/graphql";
import { initAnalytics } from "~/lib/analytics";
import { SchoolByUsersFindManyDocument } from "~/queries/schools";

/**
 * Client-only bootstrap that wires the resolved user into Amplitude. Renders
 * nothing. The current-user query is gated on hydration *and* the in-memory
 * token being present (set by the root `App` effect after mount) — defeating
 * the client-token race where a naively-mounted query fires with a null token.
 * `initAnalytics` is itself role-gated and single-init.
 */
export function AmplitudeAnalytics() {
  const hydrated = useHydrated();
  const token = useAuthToken();
  const { data: user } = useCurrentUser({ enabled: hydrated && Boolean(token) });

  // Fetch the user's schools to tag a multi-value `school` Amplitude group.
  // Gated on the same hydration/token preconditions plus a resolved user id.
  const userId = user?._id;
  const schoolsQuery = useQuery({
    queryKey: ["schoolsByUser", userId],
    // Only runs while `enabled` (userId present), so the fallback never reaches the API.
    queryFn: () =>
      gqlClient.request(SchoolByUsersFindManyDocument, { user: userId ?? "" }),
    enabled: hydrated && Boolean(token) && Boolean(userId),
  });

  useEffect(() => {
    if (!user) return;
    // Wait for the schools query to settle (success or error) before init so
    // membership is captured — but never block forever: a failed/empty query
    // falls back to `schoolIds: []`. The single-init guard in initAnalytics
    // keeps this to exactly one init per page load.
    if (schoolsQuery.isLoading) return;
    const schoolIds = (schoolsQuery.data?.SchoolByUsersFindMany ?? [])
      .map((s) => s?._id)
      .filter((id): id is string => Boolean(id));
    initAnalytics({ ...user, schoolIds });
  }, [user, schoolsQuery.isLoading, schoolsQuery.data]);

  return null;
}
