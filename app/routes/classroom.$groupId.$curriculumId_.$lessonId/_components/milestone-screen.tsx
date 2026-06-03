import { ImmersiveVideoTransition } from "./immersive-video-transition";
import { MilestoneBadge } from "./milestone-badge";
import { MOCK_LESSON, MOCK_MILESTONE } from "./fixtures";

interface MilestoneScreenProps {
  /** Continue → curriculum page. */
  onContinue: () => void;
}

/**
 * Post-playback milestone / achievement screen. Rebuilt from the prototype's
 * `MilestoneRewardCard` + `MilestoneReward` page no-video case (visual
 * reference only). Uses the shared `ImmersiveVideoTransition` with no
 * `videoUrl` (warm-gradient path) so it skips straight to content. A centered
 * column holds the gradient badge tile, fixture title + message, and a glass
 * Continue pill → curriculum page. UI ONLY.
 */
export function MilestoneScreen({ onContinue }: MilestoneScreenProps) {
  return (
    <ImmersiveVideoTransition
      glowColors={[MOCK_MILESTONE.glowColor, "rgba(168, 85, 247, 0.12)"]}
      entranceDelay={300}
      endingDuration={800}
    >
      <div className="w-full px-6">
        <div className="mx-auto flex w-full max-w-md flex-col items-center">
          <style>{`
            @keyframes milestone-screen-fade-up {
              from { opacity: 0; transform: translateY(20px); }
              to   { opacity: 1; transform: translateY(0); }
            }
          `}</style>

          <MilestoneBadge
            iconKey={MOCK_MILESTONE.iconKey}
            title={MOCK_MILESTONE.title}
            subtitle={`Day ${MOCK_LESSON.order} Complete`}
            color={MOCK_MILESTONE.color}
            glowColor={MOCK_MILESTONE.glowColor}
          />

          <p
            className="mt-8 max-w-sm text-center font-sans text-lg leading-relaxed text-white/80"
            style={{
              animation:
                "milestone-screen-fade-up 500ms cubic-bezier(0.16, 1, 0.3, 1) 700ms both",
            }}
          >
            {MOCK_MILESTONE.message}
          </p>

          <button
            type="button"
            onClick={onContinue}
            className="group relative mt-10 overflow-hidden rounded-full px-14 py-4 font-sans text-lg font-medium text-white/90 transition-transform hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 active:scale-[0.98]"
            style={{
              background:
                "linear-gradient(165deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.08) 100%)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.2)",
              boxShadow:
                "0 4px 24px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.25)",
              animation:
                "milestone-screen-fade-up 500ms cubic-bezier(0.16, 1, 0.3, 1) 1000ms both",
            }}
          >
            <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
              Continue
            </span>
          </button>
        </div>
      </div>
    </ImmersiveVideoTransition>
  );
}
