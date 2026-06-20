// Static defaults for the achievement (milestone) step.
//
// A class's `pin` supplies the achievement title (`pin.label`) and optional
// celebration media (`pin.video` / `pin.cover`), but the schema has no fields
// for the badge's body copy, icon, or gradient colors. These named constants
// fill that gap — they are the former milestone-fixture literals promoted to
// the canonical defaults so the achievement step renders complete chrome
// without a fixture import.
//
// `iconKey` indexes the small icon map in `milestone-badge.tsx` (falls back to
// Trophy on miss); `color` / `glowColor` drive the gradient badge tile + glow.

export interface AchievementDefaults {
  /** Body copy under the badge. */
  message: string;
  /** Key into the milestone icon map (falls back to `trophy`). */
  iconKey: string;
  /** Badge tile gradient seed color. */
  color: string;
  /** Badge glow color. */
  glowColor: string;
}

export const ACHIEVEMENT_DEFAULTS: AchievementDefaults = {
  message:
    "Three days of showing up for yourself. Each breath you notice builds a calmer, more focused mind.",
  iconKey: "trophy",
  color: "hsl(45, 90%, 55%)",
  glowColor: "rgba(234, 179, 8, 0.4)",
};
