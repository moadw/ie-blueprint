import logoUrl from "~/assets/IE_logo.png";
import { cn } from "~/lib/utils";

export interface LogoProps {
  variant?: "dark" | "white";
  className?: string;
}

export function Logo({ variant = "dark", className }: LogoProps) {
  if (variant === "white") {
    // White variant is mobile-only and out of scope for the current milestone.
    throw new Error("white logo not yet available");
  }
  return <img src={logoUrl} alt="Inner Explorer" className={cn("h-9", className)} />;
}
