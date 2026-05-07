export type CurriculumStatus = "draft" | "live";

export function statusFromActiveHidden(input: { active?: boolean | null | undefined; hidden?: boolean | null | undefined }): CurriculumStatus {
  return input.active && !input.hidden ? "live" : "draft";
}

export function activeHiddenFromStatus(status: CurriculumStatus): { active: boolean; hidden: boolean } {
  return status === "live" ? { active: true, hidden: false } : { active: false, hidden: false };
}
