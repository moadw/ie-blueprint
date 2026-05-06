import type { ReactNode } from "react";
import { cn } from "~/lib/utils";

export type CircleTileVariant = "filled" | "dashed";
export type CircleTileSize = "md" | "lg";

export interface CircleTileProps {
  variant: CircleTileVariant;
  initials?: string;
  icon?: ReactNode;
  size?: CircleTileSize;
  className?: string;
  "aria-label"?: string;
}

const sizeClasses: Record<CircleTileSize, string> = {
  md: "w-24 h-24",
  lg: "w-28 h-28",
};

export function CircleTile({
  variant,
  initials,
  icon,
  size = "md",
  className,
  "aria-label": ariaLabel,
}: CircleTileProps) {
  const base =
    "rounded-full flex items-center justify-center transition-colors";
  const variantClasses =
    variant === "filled"
      ? "bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-md border border-white/60 shadow-md text-primary font-semibold text-2xl"
      : "border-2 border-dashed border-muted-foreground/40 hover:border-primary text-muted-foreground hover:text-primary backdrop-blur-md";

  return (
    <div
      className={cn(base, sizeClasses[size], variantClasses, className)}
      {...(ariaLabel ? { "aria-label": ariaLabel, role: "img" } : {})}
    >
      {variant === "filled" ? (initials ?? icon) : icon}
    </div>
  );
}
