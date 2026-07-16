// Per-group "last visited curriculum" memory. A tiny client-only localStorage
// store: the card selector reads it (in a click handler) to reopen a group on
// its last-viewed curriculum, and the series view writes it (in an effect) on
// every visit.
//
// Modeled on `app/lib/audio-preference.ts` but deliberately simpler — there is
// NO in-memory mirror, listener set, or `useSyncExternalStore` here. Read and
// write happen in different components at different times (no live
// cross-component sync is needed), so the store contract would be dead weight.
//
// SSR-safe: never touches `window` at module scope; both accessors guard on
// `typeof window`. Key prefix mirrors the `ie:audio-pref:` convention.

const KEY_PREFIX = "ie:last-curriculum:";
// Single global key for the last classroom curriculum viewed across ALL groups.
// Unlike the per-group `KEY_PREFIX` store (which the card selector uses to
// reopen a specific group), this remembers the one place the user was last so a
// context-free surface (the settings modal's Done button) can return them there.
const LAST_LOCATION_KEY = "ie:last-location";

function storageKey(groupId: string): string {
  return `${KEY_PREFIX}${groupId}`;
}

/**
 * Last curriculum id viewed for a group, or `null` when nothing is saved (or on
 * the server). Callers validate that the returned id is still assigned to the
 * group before using it, and fall back to the first curriculum otherwise.
 */
export function getLastCurriculum(groupId: string): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(storageKey(groupId));
}

/** Persist the last curriculum id viewed for a group (client only). */
export function setLastCurriculum(groupId: string, curriculumId: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(storageKey(groupId), curriculumId);
}

/**
 * The last classroom curriculum the user viewed (group + curriculum), or `null`
 * when nothing is saved (or on the server). Used by the settings modal's Done
 * button to return the user to where they were rather than the classrooms index.
 */
export function getLastLocation(): {
  groupId: string;
  curriculumId: string;
} | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(LAST_LOCATION_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (
      parsed &&
      typeof parsed === "object" &&
      typeof (parsed as { groupId?: unknown }).groupId === "string" &&
      typeof (parsed as { curriculumId?: unknown }).curriculumId === "string"
    ) {
      return parsed as { groupId: string; curriculumId: string };
    }
  } catch {
    // Corrupt/legacy value — treat as absent.
  }
  return null;
}

/** Persist the last classroom curriculum the user viewed, globally (client only). */
export function setLastLocation(groupId: string, curriculumId: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    LAST_LOCATION_KEY,
    JSON.stringify({ groupId, curriculumId }),
  );
}
