import type { LucideIcon } from "lucide-react";

interface SchoolStatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
}

/**
 * A single stat tile in the school-detail stat row: an icon chip on the left and
 * a value + label on the right. Placeholder values ("—") render cleanly, so the
 * analytics cards read as "not yet available" rather than broken while step-3
 * wires them to Amplitude.
 */
export function SchoolStatCard({ label, value, icon: Icon }: SchoolStatCardProps) {
  return (
    <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-3">
      <div className="p-2 rounded-lg bg-primary/5">
        <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
