export type CurriculumStatus = "draft" | "live";

/**
 * Product ceiling on practices per series. No real series should exceed this —
 * one that does signals a data/migration error, so the admin content card caps
 * the label at "{PRACTICE_COUNT_CAP}+" instead of showing a precise figure, and
 * the count fetch only reads `PRACTICE_COUNT_CAP + 1` rows (just enough to detect
 * the over-cap case). Shared so the display cap and the fetch limit can't drift.
 */
export const PRACTICE_COUNT_CAP = 200;

export function statusFromActiveHidden(input: { active?: boolean | null | undefined; hidden?: boolean | null | undefined }): CurriculumStatus {
  return input.active && !input.hidden ? "live" : "draft";
}

export function activeHiddenFromStatus(status: CurriculumStatus): { active: boolean; hidden: boolean } {
  return status === "live" ? { active: true, hidden: false } : { active: false, hidden: false };
}
