// Shared fixtures for the lesson post-playback screens (journal + milestone)
// and the standalone journal / achievement routes.
//
// UI + navigation ONLY — there is no backend wiring at this stage. These
// values are the single source of truth for the seed data the screens and the
// standalone routes share; the lesson route's `_components/fixtures.ts`
// re-exports them so existing importers (player, in-player stage) keep working
// unchanged. See `thoughts/sergio/plans/2026-06-13-journal-and-achievement-routes.md`.

// Bundled sample media lives under `public/media/` so it resolves as a static
// absolute URL (no bundler import needed for the <video> src).
export const SAMPLE_VIDEO_URL = "/media/sample-lesson.mp4";

// Milestone / achievement fixture for the post-playback "milestone" screen and
// the standalone achievement route. Stands in for the future achievements
// document. `iconKey` indexes the small icon map in `milestone-badge.tsx`
// (defaults to Trophy on miss); `color` / `glowColor` drive the gradient badge
// tile and its glow.
export interface MockMilestone {
  /** Badge title (large serif). */
  title: string;
  /** Body copy under the badge. */
  message: string;
  /** Key into the milestone icon map (falls back to `trophy`). */
  iconKey: string;
  /** Badge tile gradient seed color. */
  color: string;
  /** Badge glow color. */
  glowColor: string;
}

export const MOCK_MILESTONE: MockMilestone = {
  title: "Steady Progress",
  message:
    "Three days of showing up for yourself. Each breath you notice builds a calmer, more focused mind.",
  iconKey: "trophy",
  color: "hsl(45, 90%, 55%)",
  glowColor: "rgba(234, 179, 8, 0.4)",
};

// "Day N Complete" subtitle for the standalone achievement route; mirrors
// today's `MOCK_LESSON.order`.
export const SAMPLE_MILESTONE_DAY = 3;
