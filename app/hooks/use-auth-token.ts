import { useSyncExternalStore } from "react";
import { getToken, subscribe } from "~/lib/auth";

/**
 * Reactive read of the in-memory auth token. Re-renders the consumer whenever
 * `setToken` runs, which lets consumers gate work on the token actually being
 * present (it's populated by the root `App` effect *after* mount). Returns
 * `null` on the server (`getServerSnapshot`).
 */
export function useAuthToken(): string | null {
  return useSyncExternalStore(subscribe, getToken, () => null);
}
