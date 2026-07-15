// Where a curriculum should open / resume: the "current practice".
//
// We derive this from `finishedClasses` (the classes the teacher has completed)
// rather than the backend's `groupprogress.nextClass`. `nextClass` is
// unreliable for a fresh classroom — the backend seeds it to the SECOND class
// before anything is completed, so trusting it opens the slider on Day 2. See
// project memory "groupprogress is backend-generated".
//
// The current practice = the first class, in the given order, that isn't
// finished yet. That is Day 1 for a brand-new classroom, and the next
// not-yet-done practice for one in progress. When every class is finished we
// clamp to the last one (review the end rather than snapping back to Day 1);
// an empty list falls back to 0.

/**
 * Index of the current practice — the first not-yet-finished class in `classIds`
 * order. See file header for the semantics + why `finishedClasses` (not
 * `nextClass`) is the source.
 */
export function currentPracticeIndex(
  classIds: readonly (string | null | undefined)[],
  finishedClasses: readonly (string | null | undefined)[] | null | undefined,
): number {
  if (classIds.length === 0) return 0;
  const finished = new Set(
    (finishedClasses ?? []).filter((id): id is string => Boolean(id)),
  );
  const idx = classIds.findIndex((id) => !id || !finished.has(id));
  return idx >= 0 ? idx : classIds.length - 1;
}
