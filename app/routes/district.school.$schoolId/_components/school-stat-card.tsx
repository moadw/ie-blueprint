import type { LucideIcon } from "lucide-react";

interface SchoolStatCardProps {
  label: string;
  /** The stat figure. Omitted while `loading` (the value area shows a skeleton). */
  value?: string | number;
  icon: LucideIcon;
  /**
   * Render the value area as a pulsing skeleton block while the (deferred
   * Amplitude) figure streams in. The icon + label stay visible so the card is
   * recognizable and the layout doesn't shift when the number resolves.
   */
  loading?: boolean;
}

/**
 * A single stat tile in the school-detail stat row: an icon chip on the left and
 * a value + label on the right. The two Amplitude-backed tiles (Total Plays /
 * Educators Active) stream in behind a `loading` skeleton; a resolved "—" reads
 * as "not available" rather than broken.
 */
export function SchoolStatCard({
  label,
  value,
  icon: Icon,
  loading = false,
}: SchoolStatCardProps) {
  return (
    <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-3">
      <div className="p-2 rounded-lg bg-primary/5">
        <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
      </div>
      <div className="min-w-0">
        {loading ? (
          <div className="h-8 w-16 rounded-md bg-muted animate-pulse" />
        ) : (
          <p className="text-2xl font-bold text-foreground">{value}</p>
        )}
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
