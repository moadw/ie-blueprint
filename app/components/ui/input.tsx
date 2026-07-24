import { forwardRef, useId } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "~/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  /** Optional element rendered on the right of the label row (e.g. a link). */
  labelAction?: ReactNode;
  error?: string;
  containerClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, labelAction, error, containerClassName, className, id, ...props },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  return (
    <div className={cn("w-full", containerClassName)}>
      {label ? (
        labelAction ? (
          <div className="flex items-baseline justify-between mb-2">
            <label htmlFor={inputId} className="text-[14px] text-foreground font-medium">
              {label}
            </label>
            {labelAction}
          </div>
        ) : (
          <label htmlFor={inputId} className="block text-[14px] text-foreground mb-2 font-medium">
            {label}
          </label>
        )
      ) : null}
      <input
        ref={ref}
        id={inputId}
        className={cn(
          "w-full h-[52px] px-4 bg-card border border-border rounded-lg text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30",
          className,
        )}
        {...props}
      />
      {error ? <p className="text-[13px] text-destructive mt-1">{error}</p> : null}
    </div>
  );
});

export { Input };
