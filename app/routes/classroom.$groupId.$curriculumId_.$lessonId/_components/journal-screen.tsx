interface JournalScreenProps {
  /** Submit & Skip both → curriculum page. */
  onExit: () => void;
}

/**
 * STUB. Step-8 replaces this with the immersive journal-entry screen (glass
 * card, prompt, rich-text editor, media upload). For now it confirms the
 * stage transition and that both terminal actions exit to the curriculum.
 */
export function JournalScreen({ onExit }: JournalScreenProps) {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/40">
        journal stub
      </p>
      <h1 className="font-serif text-3xl text-white sm:text-4xl">
        Today&apos;s Reflection
      </h1>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onExit}
          className="inline-flex h-12 items-center justify-center rounded-full bg-white px-7 text-sm font-medium text-slate-900 transition-colors hover:bg-white/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        >
          Submit Journal Entry
        </button>
        <button
          type="button"
          onClick={onExit}
          className="inline-flex h-12 items-center justify-center rounded-full px-5 text-sm font-medium text-white/70 transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
