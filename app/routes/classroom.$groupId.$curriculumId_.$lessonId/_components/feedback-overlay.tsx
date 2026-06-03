import { X } from "lucide-react";

interface FeedbackOverlayProps {
  /** Submit & close (X) both → curriculum page. */
  onExit: () => void;
}

/**
 * STUB. Step-8 replaces this with the inline feedback overlay (mood selector
 * + comment field) layered over the dimmed player. For now it confirms the
 * stage transition and that both terminal actions exit to the curriculum.
 */
export function FeedbackOverlay({ onExit }: FeedbackOverlayProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 px-6 backdrop-blur-sm">
      <div className="relative flex w-full max-w-xl flex-col items-center gap-6 rounded-3xl border border-white/15 bg-white/10 p-8 text-center backdrop-blur-xl">
        <button
          type="button"
          onClick={onExit}
          aria-label="Close feedback"
          className="absolute right-5 top-5 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/80 transition-colors hover:bg-white/20 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        >
          <X className="h-4 w-4" />
        </button>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/40">
          feedback stub
        </p>
        <h1 className="font-serif text-2xl text-white sm:text-3xl">
          How are you feeling?
        </h1>
        <button
          type="button"
          onClick={onExit}
          className="inline-flex h-12 items-center justify-center rounded-full bg-white px-7 text-sm font-medium text-slate-900 transition-colors hover:bg-white/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        >
          Submit Now
        </button>
      </div>
    </div>
  );
}
