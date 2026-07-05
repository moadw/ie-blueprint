import { useState } from "react";
import { MessageSquare, X } from "lucide-react";
import { MoodSelector } from "./mood-selector";
import type { MoodValue } from "./mood-selector";
import { GlassTextarea } from "./glass-textarea";

interface FeedbackOverlayProps {
  onSubmit: (state: MoodValue, comment: string) => void;
  onClose: () => void;
  submitting?: boolean;
}

/**
 * Inline feedback overlay layered over the still-mounted, dimmed/blurred
 * player. Rebuilt from the prototype's `FeedbackOverlay` (visual reference
 * only) with CSS entrances instead of a JS animation lib: a heavy-glass card with
 * two decorative orbs, a header (`MessageSquare` + "Feedback" + close X), the
 * 5-mood selector, a glass comment textarea (`maxLength=500`), and a green
 * "Submit Now" pill disabled until a mood is chosen. Controlled: `onSubmit`
 * fires the mood + comment (parent persists then advances), while `onClose`
 * (backdrop + close X) dismisses without saving.
 */
export function FeedbackOverlay({
  onSubmit,
  onClose,
  submitting,
}: FeedbackOverlayProps) {
  const [mood, setMood] = useState<MoodValue | null>(null);
  const [comment, setComment] = useState("");

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <style>{`
        @keyframes feedback-backdrop-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes feedback-modal-in {
          from { opacity: 0; transform: scale(0.92) translateY(30px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>

      {/* Backdrop — transparent blur so the paused player shows through. */}
      <button
        type="button"
        aria-label="Close feedback"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
        style={{
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          animation: "feedback-backdrop-in 300ms ease-out both",
        }}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-xl overflow-hidden rounded-3xl"
        style={{
          background:
            "linear-gradient(165deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.1) 100%)",
          backdropFilter: "blur(40px)",
          WebkitBackdropFilter: "blur(40px)",
          border: "1px solid rgba(255,255,255,0.4)",
          boxShadow:
            "0 25px 80px rgba(0,0,0,0.2), 0 10px 30px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(255,255,255,0.1)",
          animation:
            "feedback-modal-in 400ms cubic-bezier(0.16, 1, 0.3, 1) 50ms both",
        }}
      >
        {/* Decorative orbs */}
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(160,200,180,0.25) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <div
          className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(180,200,220,0.2) 0%, transparent 70%)",
            filter: "blur(30px)",
          }}
        />

        {/* Content */}
        <div className="relative z-10 p-8 sm:p-10">
          {/* Header */}
          <div
            className="mb-6 flex items-center justify-between pb-5"
            style={{ borderBottom: "1px solid rgba(200,200,200,0.25)" }}
          >
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{
                  background:
                    "linear-gradient(145deg, rgba(50,50,50,0.9), rgba(30,30,30,0.95))",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                }}
              >
                <MessageSquare className="h-5 w-5 text-white" />
              </div>
              <h2
                className="font-sans text-xl font-semibold text-white"
                style={{
                  letterSpacing: "-0.02em",
                  textShadow: "0 1px 2px rgba(0,0,0,0.2)",
                }}
              >
                Feedback
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close feedback"
              className="flex h-10 w-10 items-center justify-center rounded-full transition-all hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 active:scale-95"
              style={{ background: "rgba(255,255,255,0.15)" }}
            >
              <X className="h-5 w-5 text-white/80" />
            </button>
          </div>

          {/* Question */}
          <div className="mb-8 text-left">
            <h3
              className="mb-3 font-sans text-2xl font-semibold text-white sm:text-3xl"
              style={{
                letterSpacing: "-0.03em",
                textShadow: "0 2px 4px rgba(0,0,0,0.2)",
              }}
            >
              How are you feeling?
            </h3>
            <p className="max-w-sm font-sans text-base leading-snug text-white/70">
              Your input is valuable in helping us better understand your needs
              and tailor our service accordingly.
            </p>
          </div>

          {/* Mood selector */}
          <div className="mb-8">
            <MoodSelector value={mood} onChange={setMood} />
          </div>

          {/* Comment */}
          <div className="mb-8">
            <GlassTextarea
              placeholder="Add a Comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={500}
            />
          </div>

          {/* Submit */}
          <button
            type="button"
            onClick={() => {
              if (mood) onSubmit(mood, comment);
            }}
            disabled={!mood || submitting}
            className="w-full rounded-2xl py-4 font-sans text-lg font-semibold text-white transition-all hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
            style={{
              background:
                "linear-gradient(135deg, hsl(160, 55%, 45%) 0%, hsl(145, 60%, 40%) 100%)",
              boxShadow: mood
                ? "0 8px 30px rgba(45, 150, 100, 0.35), inset 0 1px 0 rgba(255,255,255,0.2)"
                : "0 4px 15px rgba(45, 150, 100, 0.2)",
            }}
          >
            {submitting ? "Submitting..." : "Submit Now"}
          </button>
        </div>
      </div>
    </div>
  );
}
