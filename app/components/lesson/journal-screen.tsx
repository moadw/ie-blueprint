import { useState } from "react";
import type { ReactNode } from "react";
import { BookOpen, Loader2 } from "lucide-react";
import { ImmersiveVideoTransition } from "./immersive-video-transition";
import { RichTextEditor } from "./rich-text-editor";
import { JournalMediaUpload } from "./journal-media-upload";
import type { SelectedMedia } from "./journal-media-upload";

/**
 * Shared intro video played before every journal form (the "special video,
 * same for all journals"). Lives in `ie/public/videos/`. Defaulted onto
 * `videoUrl` so every caller gets the transition without re-specifying it.
 */
export const JOURNAL_INTRO_VIDEO_URL = "/videos/journal-transition.mp4";

interface JournalScreenProps {
  /** Rendered in the prompt block; falsy hides it. `ReactNode` so a caller can italicize a word. */
  prompt?: ReactNode;
  /** Passed to `ImmersiveVideoTransition`. Defaults to the shared intro video. */
  videoUrl?: string | undefined;
  /** Called with the editor content on Submit (the caller persists + advances). */
  onSubmit: (content: string) => void;
  /** Skip → advance without saving. */
  onSkip: () => void;
  /** While true, both action buttons are disabled and Submit shows a spinner. */
  submitting?: boolean;
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "2-digit",
  year: "numeric",
});

/**
 * Post-playback journal-entry screen. Rebuilt from the prototype's
 * `JournalCard` + `JournalEntry` page (visual reference only) with the shared
 * `ImmersiveVideoTransition` background. A glass card holds the date header,
 * the optional lesson journal prompt, a contentEditable rich-text editor, and
 * a local-preview media dropzone. Submit hands the editor content to the
 * caller (which persists via `JournalsCreateOne` and advances); Skip advances
 * without saving. The media dropzone is still local-preview only — the create
 * mutation has no media argument, so uploads are not persisted.
 */
export function JournalScreen({
  prompt,
  videoUrl = JOURNAL_INTRO_VIDEO_URL,
  onSubmit,
  onSkip,
  submitting = false,
}: JournalScreenProps) {
  const [content, setContent] = useState("");
  const [media, setMedia] = useState<SelectedMedia | null>(null);

  const today = dateFormatter.format(new Date());
  // Don't persist empty entries; this also keeps the required `body` non-empty.
  const canSubmit = content.trim().length > 0 && !submitting;

  return (
    <ImmersiveVideoTransition
      videoUrl={videoUrl}
      glowColors={["rgba(134, 239, 172, 0.15)", "rgba(96, 165, 250, 0.12)"]}
      entranceDelay={400}
      endingDuration={1000}
    >
      <div className="w-full px-4">
        <div
          className="mx-auto w-full max-w-xl overflow-hidden rounded-3xl border border-white/20 bg-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-xl"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.05) 100%)",
          }}
        >
          {/* Header */}
          <div className="flex items-start justify-between px-8 pb-4 pt-8">
            <div>
              <h2 className="mb-1 font-serif text-2xl text-white/90">
                Today&apos;s Reflection
              </h2>
              <p className="text-sm text-white/50">{today}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
              <BookOpen className="h-5 w-5 text-white/60" />
            </div>
          </div>

          {/* Journal prompt */}
          {prompt ? (
            <div className="px-8 pb-4">
              <p className="mb-1.5 text-xs uppercase tracking-wider text-white/40">
                Journal Prompt
              </p>
              <p className="font-sans text-base text-white/80">{prompt}</p>
            </div>
          ) : null}

          {/* Rich-text editor */}
          <div className="px-8 pb-4">
            <RichTextEditor
              value={content}
              onChange={setContent}
              placeholder="Write your reflection..."
            />
          </div>

          {/* Media upload */}
          <div className="px-8 pb-6">
            <JournalMediaUpload value={media} onChange={setMedia} />
          </div>

          {/* Footer */}
          <div className="flex flex-col gap-3 px-8 pb-8">
            <button
              type="button"
              onClick={() => onSubmit(content)}
              disabled={!canSubmit}
              className="w-full rounded-full py-3.5 font-medium text-white shadow-lg transition-all hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100"
              style={{
                background:
                  "linear-gradient(135deg, hsl(160, 55%, 45%) 0%, hsl(145, 60%, 40%) 100%)",
              }}
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving…
                </span>
              ) : (
                "Submit Journal Entry"
              )}
            </button>
            <button
              type="button"
              onClick={onSkip}
              disabled={submitting}
              className="w-full rounded-full py-2.5 text-sm text-white/50 transition-colors hover:text-white/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>
    </ImmersiveVideoTransition>
  );
}
