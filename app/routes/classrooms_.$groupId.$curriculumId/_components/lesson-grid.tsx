import { Play } from "lucide-react";

export interface GridLesson {
  _id?: string | null;
  title?: string | null;
  description?: string | null;
  order?: number | null;
  cover?: { url?: string | null } | null;
}

interface LessonGridProps {
  lessons: GridLesson[];
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
 * Card click is intentionally a no-op for this step.
 */
export function LessonGrid({ lessons }: LessonGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {lessons.map((lesson, index) => {
        const image = lesson.cover?.url;
        const day = lesson.order ?? index + 1;
        return (
          <div
            key={lesson._id ?? index}
            className="group cursor-pointer"
            style={{ animation: `lessonFadeInUp 0.5s ease-out ${index * 0.05}s both` }}
            onClick={() => {
              // TODO(lesson-detail): open the lesson player. Intentionally a
              // no-op for this step — the lesson route is a separate follow-up.
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
