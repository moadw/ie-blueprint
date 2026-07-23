import { useEffect, useRef } from "react";
import { useFetcher, useNavigate } from "react-router";
import { ChevronRight, LogOut, Settings, User } from "lucide-react";
import { setToken } from "~/lib/auth";
import { setSettingsOrigin } from "~/lib/last-curriculum";
import { getUserDisplayName, getUserInitials } from "~/lib/user";
import type { UserNameFields } from "~/lib/user";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

export interface DistrictAccountMenuUser extends UserNameFields {
  profilePicture?: { url?: string | null } | null;
}

interface DistrictAccountMenuProps {
  user: DistrictAccountMenuUser | null | undefined;
}

const rowClass =
  "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30";

/**
 * Account menu for the district portal header. Mirrors the teacher
 * `ProfileMenu` interaction (avatar → popover with View Profile + Sign Out)
 * but rendered in the portal's light theme rather than the player glass, and
 * without the curriculum-progress bar — district admins have no progress.
 */
export function DistrictAccountMenu({ user }: DistrictAccountMenuProps) {
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const submittedRef = useRef(false);

  // Same sign-out handshake as admin-shell / teacher ProfileMenu: once the
  // DELETE /api/session form settles, clear the client token and go to /login.
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

  const name = getUserDisplayName(user);
  const initials = getUserInitials(user);
  const photo = user?.profilePicture?.url;
  const email = user?.email;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Open account menu"
          className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-primary text-xs font-semibold transition-colors hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          {photo ? (
            <img
              src={photo}
              alt=""
              className="h-full w-full object-cover"
              draggable={false}
            />
          ) : (
            initials
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        side="bottom"
        align="end"
        sideOffset={12}
        className="w-64 rounded-2xl border border-border bg-card p-2 shadow-lg"
      >
        {/* Profile header */}
        <div className="flex items-center gap-3 px-3 py-2">
          <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-sm font-semibold text-primary">
            {photo ? (
              <img
                src={photo}
                alt=""
                className="h-full w-full object-cover"
                draggable={false}
              />
            ) : (
              initials
            )}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">
              {name}
            </p>
            {email ? (
              <p className="truncate text-xs text-muted-foreground">{email}</p>
            ) : null}
          </div>
        </div>

        <div className="my-1 h-px bg-border" />

        <button
          type="button"
          onClick={() => {
            setSettingsOrigin("district");
            navigate("/settings");
          }}
          className={rowClass}
        >
          <Settings className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
          <span className="flex-1">All Settings</span>
          <ChevronRight className="h-4 w-4 flex-shrink-0 text-muted-foreground/70" />
        </button>

        <button
          type="button"
          onClick={() => {
            setSettingsOrigin("district");
            navigate("/settings/profile");
          }}
          className={rowClass}
        >
          <User className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
          <span className="flex-1">View Profile</span>
          <ChevronRight className="h-4 w-4 flex-shrink-0 text-muted-foreground/70" />
        </button>

        <div className="my-1 h-px bg-border" />

        <fetcher.Form method="delete" action="/api/session">
          <button type="submit" className={rowClass}>
            <LogOut className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
            <span className="flex-1">Sign Out</span>
            <ChevronRight className="h-4 w-4 flex-shrink-0 text-muted-foreground/70" />
          </button>
        </fetcher.Form>
      </PopoverContent>
    </Popover>
  );
}

export default DistrictAccountMenu;
