import { useEffect } from "react";
import { useHydrated } from "~/hooks/use-hydrated";
import { useAuthToken } from "~/hooks/use-auth-token";
import { useCurrentUser } from "~/hooks/use-current-user";
import { initAnalytics } from "~/lib/analytics";

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

  useEffect(() => {
    if (user) initAnalytics(user);
  }, [user]);

  return null;
}
