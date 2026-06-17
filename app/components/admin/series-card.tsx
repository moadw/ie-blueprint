import { NavLink } from "react-router";
import { Folder } from "lucide-react";
import { cn } from "~/lib/utils";
import { statusFromActiveHidden } from "~/lib/curriculum";
import type { CurriculumsFindManyQuery } from "~/gql/graphql";

type Curriculum = NonNullable<
  NonNullable<CurriculumsFindManyQuery["CurriculumsFindMany"]>[number]
>;

export interface SeriesCardProps {
  curriculum: Curriculum;
  /**
   * Live count of non-deleted practices for this series (matches the detail
   * route). `undefined` when the per-series fetch failed — we then fall back
   * to the curriculum's stale `totalLesson` aggregate.
   */
  practiceCount: number | undefined;
}

export function SeriesCard({ curriculum, practiceCount }: SeriesCardProps) {
  const status = statusFromActiveHidden({
    active: curriculum.active,
    hidden: curriculum.hidden,
  });
  const isLive = status === "live";
  const total = practiceCount ?? curriculum.totalLesson ?? 0;
  const description = curriculum.description?.trim()
    ? curriculum.description
    : "No description";

  return (
    <NavLink
      to={`/admin/content/series/${curriculum._id}`}
      className={cn(
        "flex gap-4 rounded-xl border-2 bg-card p-5 shadow-sm transition-all hover:shadow-md hover:scale-[1.01] active:scale-[0.99]",
        isLive ? "border-emerald-200" : "border-amber-200",
      )}
    >
      {curriculum.cover?.url ? (
        <img
          src={curriculum.cover.url}
          alt=""
          className="h-20 w-20 rounded-lg object-cover"
        />
      ) : (
        <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-stone-100">
          <Folder className="h-8 w-8 text-stone-400" />
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <h3 className="truncate font-serif text-lg text-stone-900">
            {curriculum.title ?? "Untitled"}
          </h3>
          <span
            className={cn(
              "shrink-0 rounded-full px-2 py-0.5 text-xs font-medium",
              isLive
                ? "bg-emerald-100 text-emerald-700"
                : "bg-amber-100 text-amber-700",
            )}
          >
            {isLive ? "Live" : "Draft"}
          </span>
        </div>
        <p className="mt-1 text-sm text-stone-500 line-clamp-2">
          {description}
        </p>
        <div className="mt-auto flex justify-end pt-2">
          <span className="text-xs text-stone-400">
            {total} {total === 1 ? "practice" : "practices"}
          </span>
        </div>
      </div>
    </NavLink>
  );
}

export default SeriesCard;
