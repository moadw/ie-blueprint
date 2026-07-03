import { useState } from "react";
import { X } from "lucide-react";
import { dismissAnnouncement } from "~/lib/announcement-dismissal";

export type AnnouncementBarProps = {
  /** Announcement `_id` — the per-announcement dismissal cookie key. */
  id: string;
  message: string;
};

/**
 * Dismissible green announcement bar for a single announcement.
 *
 * Presentational + immediate-hide only. Whether a *dismissed* bar renders at
 * all is decided on the SERVER: the loader reads the dismissal cookie and
 * passes no announcement when it's set, so there is no first-paint flash.
 * Clicking X writes the cookie (persisting the dismissal for the next load)
 * and hides the bar immediately, without a reload.
 */
export function AnnouncementBar({ id, message }: AnnouncementBarProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const handleDismiss = () => {
    dismissAnnouncement(id);
    setDismissed(true);
  };

  return (
    <div className="relative flex w-full shrink-0 items-center justify-center gap-2 bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground">
      <span className="flex-1">{message}</span>
      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Dismiss announcement"
        className="absolute right-3 top-1/2 -translate-y-1/2 opacity-70 transition-opacity hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground/60"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
