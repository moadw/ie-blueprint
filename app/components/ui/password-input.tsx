import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "~/components/ui/input";
import type { InputProps } from "~/components/ui/input";
import { cn } from "~/lib/utils";

export type PasswordInputProps = Omit<InputProps, "type">;

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(function PasswordInput(
  { containerClassName, label, ...props },
  ref,
) {
  const [shown, setShown] = useState(false);
  // When a label is rendered, the input sits ~22px lower than without one.
  // Position toggle relative to the input row.
  const toggleTopClass = label ? "top-[42px]" : "top-1/2 -translate-y-1/2";
  return (
    <div className={cn("relative w-full", containerClassName)}>
      <Input
        ref={ref}
        type={shown ? "text" : "password"}
        {...(label !== undefined ? { label } : {})}
        {...props}
      />
      <button
        type="button"
        onClick={() => setShown((s) => !s)}
        aria-label={shown ? "Hide password" : "Show password"}
        className={cn(
          "absolute right-4 text-muted-foreground hover:text-foreground transition-colors",
          toggleTopClass,
        )}
      >
        {shown ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
      </button>
    </div>
  );
});

export { PasswordInput };
