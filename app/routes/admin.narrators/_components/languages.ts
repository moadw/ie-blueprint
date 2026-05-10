// Hardcoded narrator language set for v1. The schema persists `languages` as a
// `[String]` array on read and `[String!]` on write. Convention:
// `languages[0]` is the narrator's PRIMARY language. The expanded edit panel
// reorders the array to put the primary at index 0 before saving.
export const NARRATOR_LANGUAGES = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
] as const;

export type NarratorLanguageCode = (typeof NARRATOR_LANGUAGES)[number]["code"];
