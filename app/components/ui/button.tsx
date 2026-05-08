import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "~/lib/utils";

export type ButtonVariant = "primary" | "ghost" | "outline" | "sso";
export type ButtonSize = "md" | "sm" | "icon";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children?: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-foreground text-background hover:bg-foreground/90",
  ghost: "bg-transparent text-foreground hover:bg-muted",
  outline: "border border-border bg-card text-foreground hover:bg-muted",
  sso: "bg-card/60 backdrop-blur-sm border border-border/50 opacity-60 cursor-not-allowed text-foreground",
};

const sizeClasses: Record<ButtonSize, string> = {
  md: "h-[52px] px-6 text-[15px] font-medium rounded-full",
  sm: "h-7 px-2 text-xs font-medium rounded-md gap-1",
  icon: "h-9 w-9 p-0 rounded-md",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", loading = false, className, children, disabled, type = "button", ...props },
  ref,
) {
  const spinnerClass = size === "sm" ? "h-3 w-3 animate-spin" : "h-4 w-4 animate-spin";
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled ?? loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {loading ? <Loader2 className={spinnerClass} /> : null}
      {children}
    </button>
  );
});

export { Button };
