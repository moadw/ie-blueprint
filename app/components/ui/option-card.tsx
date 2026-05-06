import type { ReactNode } from "react";
import { cn } from "~/lib/utils";

export interface OptionCardProps {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  selected?: boolean;
  onSelect?: () => void;
  className?: string;
}

export function OptionCard({
  icon,
  title,
  subtitle,
  selected = false,
  onSelect,
  className,
}: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "w-full text-left rounded-xl p-4 bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-md shadow-sm",
        "border-2 transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        selected
          ? "border-primary ring-2 ring-primary/30"
          : "border-border hover:border-primary/60",
        className,
      )}
    >
      <div className="flex flex-col gap-2">
        <div className="text-primary">{icon}</div>
        <div className="font-medium text-foreground">{title}</div>
        {subtitle ? (
          <div className="text-sm text-muted-foreground">{subtitle}</div>
        ) : null}
      </div>
    </button>
  );
}
