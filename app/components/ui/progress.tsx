import { cn } from "~/lib/utils";

export interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  "aria-label"?: string;
}

/**
 * Accessible, token-styled progress bar. Mirrors the `Slider` token recipe
 * (`bg-primary/15` track, `rounded-full`, `h-2`). `value` is clamped to the
 * 0–`max` range before computing the fill width.
 */
export function Progress({
  value,
  max = 100,
  className,
  "aria-label": ariaLabel,
}: ProgressProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={max}
      className={cn(
        "h-2 w-full overflow-hidden rounded-full bg-primary/15",
        className,
      )}
      {...(ariaLabel ? { "aria-label": ariaLabel } : {})}
    >
      <div
        className="h-full rounded-full bg-foreground transition-[width] duration-150"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
