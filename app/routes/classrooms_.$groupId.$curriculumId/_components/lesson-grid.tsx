import { Check, Play } from "lucide-react";
import { useNavigate } from "react-router";
import { useAudioPreference } from "~/hooks/use-audio-preference";
import {
  audioTabOptions,
  primaryDurationMinutes,
  type CardMediaDescriptor,
} from "./card-media";
import { DurationPill, DurationTabs } from "./duration-pill";
import type { GroupProgress } from "./profile-menu";

export interface GridLesson {
  _id?: string | null;
  title?: string | null;
  description?: string | null;
  order?: number | null;
  cover?: { url?: string | null } | null;
  /** Per-class media descriptor (shape + durations) for the duration pill. */
  media?: CardMediaDescriptor | null;
}

interface LessonGridProps {
  lessons: GridLesson[];
  groupId: string;
  curriculumId: string;
  groupProgress: GroupProgress | null | undefined;
}

/**
 * Below-the-fold responsive lesson grid (glass theme only). Custom card —
 * distinct from the slider's `LessonGlassCard`: a square cover tile with a
 * hover play button + "Day {order}" badge, serif title, clamped description.
 *
 * The `fadeInUp` stagger keyframe is defined in a component-scoped `<style>`
 * block — NEVER in `app/styles/app.css` — because the lesson-player track runs
 * in parallel and also appends keyframes; a shared global edit would conflict
 * at integration (root.md single-owner-globals rule).
 *
 * Clicking a card opens the practice detail route for that class id.
 */
export function LessonGrid({
  lessons,
  groupId,
  curriculumId,
  groupProgress,
}: LessonGridProps) {
  const navigate = useNavigate();
  // Per-curriculum audio-length preference (live-synced). Shared module store,
  // so the grid stays in sync with the slider's tabs on the same page.
  const [audioPref, setAudioPref] = useAudioPreference(curriculumId);
  // Client-side membership (Blueprint array filters are exact-match, not
  // "contains"). Grid surfaces Watched only — no Current badge (intentional
  // per-surface difference from the carousel).
  const finishedClasses = (groupProgress?.finishedClasses ?? []).filter(
    (id): id is string => Boolean(id),
  );
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {lessons.map((lesson, index) => {
        const image = lesson.cover?.url;
        const day = lesson.order ?? index + 1;
        const watched = lesson._id
          ? finishedClasses.includes(lesson._id)
          : false;
        // Single "N min" pill for video-only / full-audio-only practices;
        // two-segment "5 min | 9 min" tabs for both-audios; none renders nothing.
        const durationMinutes =
          lesson.media &&
          (lesson.media.shape === "video" ||
            lesson.media.shape === "full-audio" ||
            lesson.media.shape === "5min-audio")
            ? primaryDurationMinutes(lesson.media)
            : null;
        const tabOptions = lesson.media
          ? audioTabOptions(lesson.media)
          : null;
        return (
          <div
            key={lesson._id ?? index}
            className="group cursor-pointer"
            style={{ animation: `lessonFadeInUp 0.5s ease-out ${index * 0.05}s both` }}
            onClick={() => {
              if (lesson._id)
                navigate(
                  `/classrooms/${groupId}/${curriculumId}/${lesson._id}`,
                );
            }}
          >
            <div className="relative mb-3 aspect-square overflow-hidden rounded-xl transition-transform duration-300 group-hover:scale-105">
              {image ? (
                <img
                  src={image}
                  alt={lesson.title ?? ""}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-white/5 px-3 text-center font-serif text-sm text-white/60">
                  {lesson.title}
                </div>
              )}

              {/* Hover darken + centered play button */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/30 backdrop-blur-sm">
                  <Play className="ml-0.5 h-5 w-5 text-white" />
                </div>
              </div>

              {/* Day badge */}
              <div className="absolute left-2 top-2 rounded-[14px] bg-black/40 px-2 py-1 text-xs font-sans text-white/80 backdrop-blur-sm">
                Day {day}
              </div>

              {/* Watched badge (top-right). Ported from the prototype
                  `ThemedPracticesGrid`. Watched-only — no Current here. */}
              {watched ? (
                <div
                  className="absolute right-2 top-2 z-10 flex items-center gap-1 rounded-full px-2 py-1"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(134,239,172,0.4) 0%, rgba(74,222,128,0.3) 100%)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                    border: "1px solid rgba(134,239,172,0.5)",
                    boxShadow: "0 2px 8px rgba(74,222,128,0.2)",
                  }}
                >
                  <div
                    className="flex h-3.5 w-3.5 items-center justify-center rounded-full"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(134,239,172,0.9) 0%, rgba(74,222,128,1) 100%)",
                      boxShadow: "0 0 6px rgba(134,239,172,0.6)",
                    }}
                  >
                    <Check className="h-2 w-2 text-white" strokeWidth={3} />
                  </div>
                  <span className="text-[9px] font-semibold uppercase tracking-wider text-white/95">
                    Watched
                  </span>
                </div>
              ) : null}

              {/* Duration pill (bottom-center). Single "N min" for
                  video/full-audio; two-segment "5 min | 9 min" tabs for
                  both-audios. Tab clicks stopPropagation so they never trigger
                  the card's navigate `onClick`. */}
              {tabOptions ? (
                <DurationTabs
                  options={tabOptions}
                  value={audioPref}
                  onChange={setAudioPref}
                  size="sm"
                />
              ) : durationMinutes != null ? (
                <DurationPill minutes={durationMinutes} size="sm" />
              ) : null}
            </div>

            <h4 className="mb-1 font-serif text-base text-white transition-colors group-hover:text-primary">
              {lesson.title}
            </h4>
            <p className="line-clamp-2 font-sans text-xs text-zinc-400">
              {lesson.description ||
                "A mindfulness practice to help you find calm and focus."}
            </p>
          </div>
        );
      })}

      <style>{`
        @keyframes lessonFadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
