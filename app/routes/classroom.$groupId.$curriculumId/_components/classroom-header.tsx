import { Link } from "react-router";
import { GraduationCap } from "lucide-react";
import { Logo } from "~/components/ui/logo";
import { ProfileMenu } from "./profile-menu";
import type { ProfileMenuUser } from "./profile-menu";

export interface HeaderCurriculum {
  _id?: string | null;
  title?: string | null;
}

export interface HeaderGroup {
  name?: string | null;
  curriculumsObj?: (HeaderCurriculum | null)[] | null;
}

interface ClassroomHeaderProps {
  group: HeaderGroup | null | undefined;
  groupId: string;
  curriculumId: string;
  user: ProfileMenuUser | null | undefined;
}

// Glass pill literals ported verbatim from the prototype's `ThemedNavbar`
// (research §1 / `PlayerThemeContext.glass`).
const PILL_BG =
  "linear-gradient(135deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.25) 100%)";
const PILL_BORDER = "1px solid rgba(255, 255, 255, 0.5)";
const PILL_SHADOW =
  "inset 0 1px 1px rgba(255,255,255,0.6), inset 0 -1px 1px rgba(255,255,255,0.2), 0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)";
const LINK_TEXT_SHADOW = "0 1px 3px rgba(0,0,0,0.4)";
const BADGE_BG = "rgba(255, 255, 255, 0.15)";
const BADGE_BORDER = "1px solid rgba(255, 255, 255, 0.25)";

/**
 * Prototype `getDisplayName()`: strip a trailing " Series" / " Practice" /
 * " Practices" and truncate anything over 12 chars to 10 + "…".
 */
function displayLabel(title: string | null | undefined): string {
  const cleaned = (title ?? "")
    .replace(/\s+(Series|Practices?|Practice)$/i, "")
    .trim();
  if (cleaned.length > 12) return `${cleaned.slice(0, 10)}…`;
  return cleaned;
}

export function ClassroomHeader({
  group,
  groupId,
  curriculumId,
  user,
}: ClassroomHeaderProps) {
  const curriculums = (group?.curriculumsObj ?? []).filter(
    (c): c is HeaderCurriculum => Boolean(c?._id),
  );

  return (
    <header className="relative z-50 px-4 pt-[calc(env(safe-area-inset-top)+16px)] sm:px-6">
      <div
        className="flex items-center gap-2 rounded-full px-3 py-2 sm:gap-3 sm:px-4"
        style={{
          background: PILL_BG,
          backdropFilter: "blur(40px) saturate(1.8)",
          WebkitBackdropFilter: "blur(40px) saturate(1.8)",
          border: PILL_BORDER,
          boxShadow: PILL_SHADOW,
        }}
      >
        {/* Logo */}
        <Link
          to="/classrooms"
          aria-label="Inner Explorer — back to classrooms"
          className="flex flex-shrink-0 items-center rounded-full transition-opacity duration-200 hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
        >
          <Logo variant="white" className="h-7 object-contain sm:h-8" />
        </Link>

        {/* Curriculum links */}
        <nav className="hidden flex-1 items-center justify-end gap-1 overflow-x-auto sm:flex">
          {curriculums.map((c) => {
            const isActive = c._id === curriculumId;
            return (
              <Link
                key={c._id}
                to={`/classroom/${groupId}/${c._id}`}
                className="whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold text-white transition-all duration-300 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 sm:px-4"
                style={{
                  background: isActive
                    ? "rgba(255, 255, 255, 0.25)"
                    : "transparent",
                  textShadow: LINK_TEXT_SHADOW,
                }}
                aria-current={isActive ? "page" : undefined}
              >
                {displayLabel(c.title)}
              </Link>
            );
          })}
        </nav>

        {/* Right cluster: group badge + divider + profile */}
        <div className="ml-auto flex items-center gap-2 sm:ml-0 sm:gap-3">
          <Link
            to="/classrooms"
            className="flex items-center gap-1.5 rounded-full px-2 py-1.5 transition-transform duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 sm:px-3"
            style={{ background: BADGE_BG, border: BADGE_BORDER }}
          >
            <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-white/20">
              <GraduationCap className="h-3 w-3 text-white" />
            </span>
            {group?.name ? (
              <span className="hidden max-w-[80px] truncate text-xs font-medium text-white sm:flex">
                {group.name}
              </span>
            ) : null}
          </Link>

          <div className="hidden h-6 w-px bg-white/20 sm:block" />

          <ProfileMenu user={user} />
        </div>
      </div>
    </header>
  );
}
