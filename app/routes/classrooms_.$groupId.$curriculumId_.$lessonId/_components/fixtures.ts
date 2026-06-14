// Local fixtures for the lesson-player UI port.
//
// UI + navigation ONLY — there is no backend wiring at this stage. These
// values stand in for the future `LessonFindOne` / media documents and are
// consumed by the player + post-playback stub screens. See
// `thoughts/sergio/plans/2026-06-02-classroom-lesson-player.md` Phase 1.

// Shared seed data lives in `~/components/lesson/fixtures` (single source of
// truth, consumed by the screens + the standalone journal / achievement
// routes). Re-exported here so existing importers (player, in-player stage)
// keep their import paths unchanged.
export {
  SAMPLE_VIDEO_URL,
  MOCK_MILESTONE,
} from "~/components/lesson/fixtures";
export type { MockMilestone } from "~/components/lesson/fixtures";

export type LessonMediaType = "audio" | "video";

export interface MockLesson {
  title: string;
  description: string;
  /** 1-based position in the series; rendered as "Day {order}". */
  order: number;
  gradeLabel: string;
  /** Cover image used as the audio-path still background. */
  coverImageUrl: string;
  /** Background image for the audio path (no video). */
  backgroundImageUrl: string;
  /** Series / curriculum display name. */
  seriesName: string;
  journalPrompt: string;
  /** Default media type when the `?media` param is absent. */
  mediaType: LessonMediaType;
}

// Bundled sample media live under `public/media/` so they resolve as static
// absolute URLs (no bundler import needed for <video>/<audio> src).
//
// MEDIA SOURCING NOTE (step-6, no network for CC0 downloads, no ffmpeg
// available in this environment): `sample-lesson.mp4` is a short calm
// transition clip carried over from the prototype's bundled media. The audio
// path reuses the same valid, scrubbable media file as a placeholder source —
// the real short CC0 audio clip is a follow-up for the data-wiring plan. The
// audio-path still background reuses the existing `glass-background.webp`
// asset (served from `app/assets/`, imported where the still is rendered).
export const SAMPLE_AUDIO_URL = "/media/sample-lesson.mp4";

export const MOCK_LESSON: MockLesson = {
  title: "Noticing Your Breath",
  description:
    "A short grounding practice to help you settle in, notice the rhythm of your breath, and find a moment of calm before the day continues.",
  order: 3,
  gradeLabel: "Grades 3–5",
  coverImageUrl: "/media/sample-lesson.mp4",
  backgroundImageUrl: "/media/sample-lesson.mp4",
  seriesName: "Foundations of Mindfulness",
  journalPrompt:
    "What did you notice about your breath today? Was it easy or hard to stay focused on it?",
  mediaType: "video",
};

// Milestone / achievement seed data (`MockMilestone` + `MOCK_MILESTONE`) now
// lives in `~/components/lesson/fixtures` and is re-exported at the top of this
// file so the in-player milestone stage keeps importing it from here.
