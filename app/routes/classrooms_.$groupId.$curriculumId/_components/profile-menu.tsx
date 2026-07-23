import { useEffect, useRef } from "react";
import { useFetcher, useNavigate } from "react-router";
import { Building2, ChevronRight, LogOut, Settings, User } from "lucide-react";
import { setToken } from "~/lib/auth";
import { setSettingsOrigin } from "~/lib/last-curriculum";
import { isDistrictOrSchoolAdmin } from "~/lib/user";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

export interface ProfileMenuUser {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  userName?: string | null;
  profilePicture?: { url?: string | null } | null;
  typeObj?: { identifier?: string | null } | null;
}

/**
 * Shape consumed by the header progress bar + lesson-card badges (one shared
 * `GroupProgressFindOne` fetch in the series loader). `nextClass` /
 * `finishedClasses` drive the per-card Current / Watched badges; the dropdown
 * bar fill is derived from `finishedClasses.length / totalClasses` (the
 * backend `progress` scalar is unreliable — 0/null for manually-created
 * curriculums — so it's no longer bound to the bar).
 */
export interface GroupProgress {
  progress?: number | null;
  finishedClasses?: (string | null)[] | null;
  nextClass?: string | null;
}

interface ProfileMenuProps {
  user: ProfileMenuUser | null | undefined;
  groupProgress: GroupProgress | null | undefined;
  curriculumTitle: string | null | undefined;
  totalClasses: number;
}

// Glass dropdown literals ported verbatim from the prototype's `ProfileMenu`
// Radix `PopoverContent` (research §1.4 / `PlayerThemeContext.glass`).
const MENU_BG =
  "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)";
const MENU_BORDER = "1px solid rgba(255, 255, 255, 0.3)";
const MENU_SHADOW =
  "inset 0 1px 1px rgba(255,255,255,0.5), 0 12px 40px rgba(0,0,0,0.25), 0 2px 8px rgba(0,0,0,0.12)";
const AVATAR_BG = "rgba(255, 255, 255, 0.2)";
const AVATAR_BORDER = "2px solid rgba(255, 255, 255, 0.4)";

function displayName(user: ProfileMenuUser | null | undefined): string {
  if (!user) return "Account";
  const full = [user.firstName, user.lastName]
    .filter((part): part is string => Boolean(part))
    .join(" ")
    .trim();
  return full || user.userName || user.email || "Account";
}

function initial(name: string): string {
  return name.trim().charAt(0).toUpperCase() || "?";
}

export function ProfileMenu({
  user,
  groupProgress,
  curriculumTitle,
  totalClasses,
}: ProfileMenuProps) {
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const submittedRef = useRef(false);

  // Mirror admin-shell's sign-out: after the DELETE /api/session form settles,
  // clear the client token and bounce to /login.
  useEffect(() => {
    if (fetcher.state === "submitting") {
      submittedRef.current = true;
      return;
    }
    if (fetcher.state === "idle" && submittedRef.current) {
      submittedRef.current = false;
      setToken(null);
      navigate("/login");
    }
  }, [fetcher.state, navigate]);

  const name = displayName(user);
  const photo = user?.profilePicture?.url;
  const email = user?.email;
  const showDistrictAdmin = isDistrictOrSchoolAdmin(user?.typeObj?.identifier);

  const finished =
    groupProgress?.finishedClasses?.filter(Boolean).length ?? 0;
  // Bar fill mirrors the {finished}/{totalClasses} count instead of the
  // backend `progress` scalar. `progress` is backend-generated and stays
  // 0/null for manually-created curriculums (the frontend only reads it), so
  // binding to it left the bar empty while the count showed e.g. 4/180.
  // Deriving from finishedClasses keeps the bar and the count consistent.
  const pct =
    totalClasses > 0 ? Math.min(100, (finished / totalClasses) * 100) : 0;
  const progressLabel = curriculumTitle
    ? `${curriculumTitle} Progress`
    : "Your Progress";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Open account menu"
          className="flex items-center gap-2 rounded-full px-2 py-1 transition-colors duration-200 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
        >
          <span
            className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full text-sm font-semibold text-white"
            style={{ background: AVATAR_BG, border: AVATAR_BORDER }}
          >
            {photo ? (
              <img
                src={photo}
                alt=""
                className="h-full w-full object-cover"
                draggable={false}
              />
            ) : (
              initial(name)
            )}
          </span>
          <span className="hidden max-w-[80px] truncate text-sm font-medium text-white drop-shadow-md md:block">
            {name}
          </span>
        </button>
      </PopoverTrigger>

      <PopoverContent
        side="bottom"
        align="end"
        sideOffset={12}
        className="w-72 rounded-[16px] p-2 text-white"
        style={{
          background: MENU_BG,
          backdropFilter: "blur(40px) saturate(1.8)",
          WebkitBackdropFilter: "blur(40px) saturate(1.8)",
          border: MENU_BORDER,
          boxShadow: MENU_SHADOW,
        }}
      >
        {/* Profile header */}
        <div className="flex items-center gap-3 px-3 py-3">
          <span
            className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-full text-lg font-semibold text-white"
            style={{ background: AVATAR_BG, border: AVATAR_BORDER }}
          >
            {photo ? (
              <img
                src={photo}
                alt=""
                className="h-full w-full object-cover"
                draggable={false}
              />
            ) : (
              initial(name)
            )}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">{name}</p>
            {email ? (
              <p className="truncate text-xs text-white/70">{email}</p>
            ) : null}
          </div>
        </div>

        {/* Curriculum progress — glass bar ported from the prototype
            `ProfileMenu` Progress Section. Inline (not the `Progress`
            primitive) because the glass track/fill needs literal
            white-translucent backgrounds the primitive's `bg-primary/15` +
            `bg-foreground` recipe can't cleanly override. Rendered only when
            there is at least one class. */}
        {totalClasses > 0 ? (
          <div
            className="mx-1 mb-4 mt-2 rounded-xl p-3"
            style={{ background: "rgba(255, 255, 255, 0.1)" }}
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="truncate text-xs font-medium text-white/70">
                {progressLabel}
              </span>
              <span className="ml-2 flex-shrink-0 text-xs font-semibold text-white">
                {finished}/{totalClasses}
              </span>
            </div>
            <div
              className="h-2 overflow-hidden rounded-full"
              style={{ background: "rgba(255, 255, 255, 0.15)" }}
              role="progressbar"
              aria-valuenow={Math.round(pct)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={progressLabel}
            >
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${pct}%`,
                  background:
                    "linear-gradient(90deg, rgba(255,255,255,0.6), rgba(255,255,255,0.9))",
                }}
              />
            </div>
          </div>
        ) : null}

        <div className="my-1 h-px bg-white/15" />

        {/* Action rows */}
        <button
          type="button"
          onClick={() => {
            setSettingsOrigin("classroom");
            navigate("/settings");
          }}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-white transition-colors duration-200 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
        >
          <Settings className="h-4 w-4 flex-shrink-0 text-white/80" />
          <span className="flex-1">All Settings</span>
          <ChevronRight className="h-4 w-4 flex-shrink-0 text-white/50" />
        </button>

        <button
          type="button"
          onClick={() => {
            setSettingsOrigin("classroom");
            navigate("/settings/profile");
          }}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-white transition-colors duration-200 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
        >
          <User className="h-4 w-4 flex-shrink-0 text-white/80" />
          <span className="flex-1">View Profile</span>
          <ChevronRight className="h-4 w-4 flex-shrink-0 text-white/50" />
        </button>

        {showDistrictAdmin ? (
          <button
            type="button"
            onClick={() => navigate("/district")}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-white transition-colors duration-200 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          >
            <Building2 className="h-4 w-4 flex-shrink-0 text-white/80" />
            <span className="flex-1">District Admin</span>
            <ChevronRight className="h-4 w-4 flex-shrink-0 text-white/50" />
          </button>
        ) : null}

        <div className="my-1 h-px bg-white/15" />

        <fetcher.Form method="delete" action="/api/session">
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-white transition-colors duration-200 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          >
            <LogOut className="h-4 w-4 flex-shrink-0 text-white/80" />
            <span className="flex-1">Sign Out</span>
            <ChevronRight className="h-4 w-4 flex-shrink-0 text-white/50" />
          </button>
        </fetcher.Form>
      </PopoverContent>
    </Popover>
  );
}
