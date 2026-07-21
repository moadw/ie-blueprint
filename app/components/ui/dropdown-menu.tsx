import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/lib/utils";

export interface DropdownMenuProps {
  /** Trigger element (e.g. a kebab Button). Rendered via Radix `asChild`. */
  trigger: ReactNode;
  /** Menu body — typically a list of `DropdownMenuItem`s. */
  children: ReactNode;
  /** Controlled open state. Omit to let the Popover manage it internally. */
  open?: boolean;
  /** Controlled open-change handler. */
  onOpenChange?: (open: boolean) => void;
  /** Panel alignment relative to the trigger. */
  align?: "start" | "center" | "end";
  /** Extra classes merged onto the content panel. */
  className?: string;
}

/**
 * Thin composite over the `Popover` primitive for card/row action menus.
 * Pins the menu-panel styling (no Popover precedent exists yet). Pass a
 * trigger (via Radix `asChild`) and one or more `DropdownMenuItem`s.
 */
export function DropdownMenu({
  trigger,
  children,
  open,
  onOpenChange,
  align = "end",
  className,
}: DropdownMenuProps) {
  // Spread conditionally: under `exactOptionalPropertyTypes`, passing an
  // explicit `undefined` to Radix's optional `open`/`onOpenChange` is rejected.
  return (
    <Popover
      {...(open !== undefined ? { open } : {})}
      {...(onOpenChange !== undefined ? { onOpenChange } : {})}
    >
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent
        align={align}
        sideOffset={4}
        className={cn(
          "min-w-[12rem] rounded-xl border border-border bg-popover p-1 shadow-lg",
          className,
        )}
      >
        {children}
      </PopoverContent>
    </Popover>
  );
}

export interface DropdownMenuItemProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Leading-icon slot. */
  icon?: ReactNode;
  /** Red destructive styling (e.g. Delete). */
  destructive?: boolean;
}

/** A single selectable row inside a `DropdownMenu`. */
export const DropdownMenuItem = forwardRef<
  HTMLButtonElement,
  DropdownMenuItemProps
>(function DropdownMenuItem(
  { icon, destructive = false, className, children, type = "button", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50",
        destructive
          ? "text-red-600 hover:bg-red-50"
          : "text-foreground hover:bg-muted",
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
});
