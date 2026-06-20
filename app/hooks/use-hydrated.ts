import { useEffect, useState } from "react";

/**
 * Returns `false` on the server and on the first client render, then `true`
 * after the component has mounted. Used to gate media elements, auto-play,
 * and `localStorage` access so the SSR render stays inert (no `<video>` /
 * `<audio>` server-side; no hydration mismatch).
 */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);
  return hydrated;
}
