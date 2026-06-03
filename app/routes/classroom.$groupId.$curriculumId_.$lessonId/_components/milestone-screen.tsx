import { MOCK_LESSON } from "./fixtures";

interface MilestoneScreenProps {
  /** Continue → curriculum page. */
  onContinue: () => void;
}

/**
 * STUB. Step-8 replaces this with the milestone/achievement reward screen
 * (badge tile, title, subtitle, message). For now it confirms the stage
 * transition and that Continue exits to the curriculum.
 */
export function MilestoneScreen({ onContinue }: MilestoneScreenProps) {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/40">
        milestone stub
      </p>
      <h1 className="font-serif text-3xl text-white sm:text-4xl">
        Lesson Complete!
      </h1>
      <p className="text-sm uppercase tracking-[0.2em] text-white/50">
        Day {MOCK_LESSON.order} Complete
      </p>
      <button
        type="button"
        onClick={onContinue}
        className="inline-flex h-12 items-center justify-center rounded-full bg-white px-7 text-sm font-medium text-slate-900 transition-colors hover:bg-white/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
      >
        Continue
      </button>
    </div>
  );
}
