import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "~/lib/utils";

export type BadgeVariant =
  | "neutral"
  | "active"
  | "pending"
  | "trial"
  | "suspended";
export type BadgeShape = "pill" | "tag";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  shape?: BadgeShape;
  children?: ReactNode;
}

const variantClasses: Record<BadgeVariant, string> = {
  neutral: "bg-muted text-muted-foreground",
  active: "bg-success/15 text-success",
  pending: "bg-warning/15 text-warning",
  trial: "bg-warning/15 text-warning",
  suspended: "bg-destructive/15 text-destructive",
};

const shapeClasses: Record<BadgeShape, string> = {
  pill: "inline-flex items-center font-medium text-xs px-2 py-0.5 rounded-full",
  tag: "inline-flex items-center gap-1 text-xs font-semibold border px-2.5 py-0.5 rounded-[14px]",
};

export function Badge({
  variant = "neutral",
  shape = "pill",
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        shapeClasses[shape],
        shape === "pill" ? variantClasses[variant] : null,
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
