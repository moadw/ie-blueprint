import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "~/lib/utils";

export type ButtonVariant = "primary" | "ghost" | "outline" | "sso";
export type ButtonSize = "md";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children?: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-foreground text-background rounded-full hover:bg-foreground/90 h-[52px] px-6 text-[15px] font-medium",
  ghost:
    "bg-transparent text-foreground hover:bg-muted rounded-full h-[52px] px-6 text-[15px] font-medium",
  outline:
    "border border-border bg-card text-foreground hover:bg-muted rounded-full h-[52px] px-6 text-[15px] font-medium",
  sso: "bg-card/60 backdrop-blur-sm border border-border/50 h-[52px] rounded-full text-[15px] font-medium opacity-60 cursor-not-allowed text-foreground px-6",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size: _size = "md", loading = false, className, children, disabled, type = "button", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled ?? loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary/30",
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
      {children}
    </button>
  );
});

export { Button };
