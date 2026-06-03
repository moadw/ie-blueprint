import logoUrl from "~/assets/IE_logo.png";
import logoWhiteUrl from "~/assets/IE_logo_white.png";
import { cn } from "~/lib/utils";

export interface LogoProps {
  variant?: "dark" | "white";
  className?: string;
}

export function Logo({ variant = "dark", className }: LogoProps) {
  const src = variant === "white" ? logoWhiteUrl : logoUrl;
  return <img src={src} alt="Inner Explorer" className={cn("h-9", className)} />;
}
