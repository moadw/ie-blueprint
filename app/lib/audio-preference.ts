// Per-curriculum audio-length preference. A module-level, live-synced external
// store — the same shape as the auth-token store (`app/lib/auth.ts`): a
// module-level mirror + a listener set, notified on every write so ALL
// consumers (sibling cards + the player) re-render immediately with no reload.
//
// The persisted value is the tap TYPE (`"full-audio"` | `"5min-audio"`), not a
// duration label; the default is `"full-audio"`. It is stored in localStorage
// under `ie:audio-pref:<curriculumId>` so a choice survives reloads and is read
// back by the player (step-4).
//
// SSR-safe: never touches `window` during module init. Reads are lazy and
// window-guarded; the hook layer (`use-audio-preference.ts`) additionally gates
// the first client read behind `useHydrated()` to avoid a hydration mismatch,
// mirroring the volume pref in `use-media-player.ts`.

export type AudioPref = "full-audio" | "5min-audio";

const DEFAULT_PREF: AudioPref = "full-audio";
const KEY_PREFIX = "ie:audio-pref:";

type Listener = () => void;

// In-memory mirror of each curriculum's preference. Seeded lazily from
// localStorage on first read (client only); writes update it synchronously so
// `getSnapshot` returns a stable primitive between notifications (required by
// `useSyncExternalStore` to avoid render loops).
const mirror = new Map<string, AudioPref>();
const listeners = new Set<Listener>();

function storageKey(curriculumId: string): string {
  return `${KEY_PREFIX}${curriculumId}`;
}

function isAudioPref(value: string | null): value is AudioPref {
  return value === "full-audio" || value === "5min-audio";
}

/**
 * Current preference for a curriculum. Returns the in-memory mirror if present,
 * else lazily seeds it from localStorage (client only), else the default
 * (`"full-audio"`). Referentially stable: repeated calls with no intervening
 * {@link setPreference} return the same primitive, which keeps
 * `useSyncExternalStore` from looping.
 */
export function getSnapshot(curriculumId: string): AudioPref {
  const cached = mirror.get(curriculumId);
  if (cached !== undefined) return cached;
  if (typeof window !== "undefined") {
    const stored = window.localStorage.getItem(storageKey(curriculumId));
    if (isAudioPref(stored)) {
      mirror.set(curriculumId, stored);
      return stored;
    }
  }
  return DEFAULT_PREF;
}

/**
 * Persist + broadcast a curriculum's preference. Updates the in-memory mirror,
 * writes localStorage (client only), then notifies every subscriber so all
 * consumers re-render with the new value — live-synced, no reload.
 */
export function setPreference(curriculumId: string, pref: AudioPref): void {
  mirror.set(curriculumId, pref);
  if (typeof window !== "undefined") {
    window.localStorage.setItem(storageKey(curriculumId), pref);
  }
  for (const fn of listeners) {
    fn();
  }
}

/** Subscribe to preference changes; returns an unsubscribe fn (store contract). */
export function subscribe(fn: Listener): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
