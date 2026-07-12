import { Link } from "react-router";

export interface SidebarCurriculum {
  _id: string;
  title?: string | null;
  totalLesson?: number | null;
}

interface CurriculumSidebarProps {
  curriculums: SidebarCurriculum[];
  groupId: string;
  curriculumId: string;
  /**
   * Per-curriculum practice (class) count, keyed by curriculum `_id`. Derived
   * loader-side because `curriculum.totalLesson` is null on this platform;
   * falls back to `totalLesson ?? 0` for any id not present in the map.
   */
  counts: Record<string, number>;
}

/**
 * Mobile (`<lg`) horizontal scrollable tab strip. Rendered full-width *above*
 * the desktop flex rail (prototype `PracticesPageLayout` places it outside the
 * flex container). Glass theme only — the prototype's `themeStyles.grid*`
 * tokens resolve to the zinc/white literals used here.
 */
export function CurriculumTabs({
  curriculums,
  groupId,
  curriculumId,
  counts,
}: CurriculumSidebarProps) {
  if (curriculums.length === 0) return null;

  return (
    <div className="px-4 pt-6 lg:hidden">
      <div className="flex gap-2 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {curriculums.map((c) => {
          const isActive = c._id === curriculumId;
          return (
            <Link
              key={c._id}
              to={`/classrooms/${groupId}/${c._id}`}
              className={`flex-shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 ${
                isActive
                  ? "bg-white text-zinc-900"
                  : "bg-white/10 text-white/70 hover:opacity-80"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              {c.title} ({counts[c._id] ?? c.totalLesson ?? 0})
            </Link>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Desktop (`lg+`) sticky left rail listing every curriculum as a `<Link>` row
 * (active = current `:curriculumId`), with the lesson count from `totalLesson`.
 * Hidden below `lg`, where `CurriculumTabs` takes over.
 */
export function CurriculumSidebar({
  curriculums,
  groupId,
  curriculumId,
  counts,
}: CurriculumSidebarProps) {
  if (curriculums.length === 0) return null;

  return (
    <aside className="sticky top-0 hidden h-screen w-64 flex-shrink-0 overflow-y-auto border-r border-zinc-800 px-6 py-8 lg:block">
      <h3 className="mb-6 text-xs font-sans uppercase tracking-wider text-zinc-500">
        Series
      </h3>
      <nav className="flex flex-col gap-1">
        {curriculums.map((c) => {
          const isActive = c._id === curriculumId;
          return (
            <Link
              key={c._id}
              to={`/classrooms/${groupId}/${c._id}`}
              className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 ${
                isActive
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-400 hover:text-white"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <span className="truncate font-sans text-sm">{c.title}</span>
              <span className="ml-2 flex-shrink-0 text-xs text-zinc-500">
                {counts[c._id] ?? c.totalLesson ?? 0}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
