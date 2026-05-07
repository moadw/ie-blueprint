import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "~/lib/utils";

export type BadgeVariant = "neutral" | "active" | "trial" | "suspended";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children?: ReactNode;
}

const variantClasses: Record<BadgeVariant, string> = {
  neutral: "bg-muted text-muted-foreground",
  active: "bg-success/15 text-success",
  trial: "bg-warning/15 text-warning",
  suspended: "bg-destructive/15 text-destructive",
};

export function Badge({
  variant = "neutral",
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-medium text-xs px-2 py-0.5 rounded-full",
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
