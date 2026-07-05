import { useCallback, useSyncExternalStore } from "react";
import { useHydrated } from "~/hooks/use-hydrated";
import {
  getSnapshot,
  setPreference,
  subscribe,
  type AudioPref,
} from "~/lib/audio-preference";

/**
 * Reactive, per-curriculum audio-length preference. Reads the live-synced
 * external store (`app/lib/audio-preference.ts`) via `useSyncExternalStore`, so
 * flipping the preference on any consumer instantly re-renders every other
 * consumer of the same curriculum (sibling cards + the player).
 *
 * The client snapshot is gated behind `useHydrated()`: the server and the first
 * client render both resolve to the default (`"full-audio"`), so hydration
 * stays stable; the persisted value (from localStorage) is applied on the
 * post-mount re-render — mirroring the SSR-guarded volume pref in
 * `use-media-player.ts`.
 */
export function useAudioPreference(
  curriculumId: string,
): [AudioPref, (pref: AudioPref) => void] {
  const hydrated = useHydrated();
  const value = useSyncExternalStore(
    subscribe,
    (): AudioPref => (hydrated ? getSnapshot(curriculumId) : "full-audio"),
    (): AudioPref => "full-audio",
  );
  const set = useCallback(
    (pref: AudioPref) => setPreference(curriculumId, pref),
    [curriculumId],
  );
  return [value, set];
}
