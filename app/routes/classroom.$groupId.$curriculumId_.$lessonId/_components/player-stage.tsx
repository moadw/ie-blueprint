import { X } from "lucide-react";
import { MOCK_LESSON } from "./fixtures";

interface PlayerStageProps {
  /** Day-N order, surfaced so the shell can prove fixtures + params wired up. */
  order: number;
  groupId: string;
  curriculumId: string;
  lessonId: string;
  media: "audio" | "video";
  after: "journal" | "milestone" | "feedback";
  /** Close (X) → curriculum page. */
  onExit: () => void;
  /** Playback finished → parent advances `stage` to `after`. */
  onEnded: () => void;
}

/**
 * STUB. Step-7 replaces this with the real fullscreen <video>/<audio> player
 * + transport controls. For now it renders enough to confirm the fullscreen
 * dark shell, the parsed params/fixtures, and the stage transition.
 */
export function PlayerStage({
  order,
  groupId,
  curriculumId,
  lessonId,
  media,
  after,
  onExit,
  onEnded,
}: PlayerStageProps) {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center px-6 text-center">
      <button
        type="button"
        onClick={onExit}
        aria-label="Close lesson"
        className="absolute right-5 top-5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/80 transition-colors hover:bg-white/20 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
      >
        <X className="h-5 w-5" />
      </button>

      <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-white/50">
        Day {order} · {MOCK_LESSON.gradeLabel}
      </p>
      <h1 className="mb-3 font-serif text-3xl text-white sm:text-4xl">
        {MOCK_LESSON.title}
      </h1>
      <p className="mb-8 max-w-md text-sm text-white/60">
        {MOCK_LESSON.description}
      </p>

      <p className="mb-6 text-xs text-white/40">
        player stub · media={media} · after={after} ·{" "}
        {groupId}/{curriculumId}/{lessonId}
      </p>

      <button
        type="button"
        onClick={onEnded}
        className="inline-flex h-12 items-center justify-center rounded-full bg-white px-7 text-sm font-medium text-slate-900 transition-colors hover:bg-white/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
      >
        Simulate playback end
      </button>
    </div>
  );
}
