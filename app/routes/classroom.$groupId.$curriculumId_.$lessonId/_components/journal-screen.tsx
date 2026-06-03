import { useState } from "react";
import { BookOpen } from "lucide-react";
import { ImmersiveVideoTransition } from "./immersive-video-transition";
import { RichTextEditor } from "./rich-text-editor";
import { JournalMediaUpload } from "./journal-media-upload";
import type { SelectedMedia } from "./journal-media-upload";
import { MOCK_LESSON, SAMPLE_VIDEO_URL } from "./fixtures";

interface JournalScreenProps {
  /** Submit & Skip both → curriculum page. */
  onExit: () => void;
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
 * a local-preview media dropzone. UI ONLY — Submit and Skip both exit to the
 * curriculum page; nothing is persisted at this stage.
 */
export function JournalScreen({ onExit }: JournalScreenProps) {
  const [content, setContent] = useState("");
  const [media, setMedia] = useState<SelectedMedia | null>(null);

  const today = dateFormatter.format(new Date());
  const prompt = MOCK_LESSON.journalPrompt.trim();

  return (
    <ImmersiveVideoTransition
      videoUrl={SAMPLE_VIDEO_URL}
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
              onClick={onExit}
              className="w-full rounded-full py-3.5 font-medium text-white shadow-lg transition-all hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 active:scale-[0.99]"
              style={{
                background:
                  "linear-gradient(135deg, hsl(160, 55%, 45%) 0%, hsl(145, 60%, 40%) 100%)",
              }}
            >
              Submit Journal Entry
            </button>
            <button
              type="button"
              onClick={onExit}
              className="w-full rounded-full py-2.5 text-sm text-white/50 transition-colors hover:text-white/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>
    </ImmersiveVideoTransition>
  );
}
