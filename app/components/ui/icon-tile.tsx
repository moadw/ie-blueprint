import { User } from "lucide-react";
import { cn } from "~/lib/utils";

export type IconTileSize = "md" | "lg";

export interface IconTileProps {
  initials?: string;
  size?: IconTileSize;
  className?: string;
}

const sizeClasses: Record<IconTileSize, string> = {
  md: "w-11 h-11 sm:w-12 sm:h-12 text-base",
  lg: "w-14 h-14 text-lg",
};

export function IconTile({ initials, size = "md", className }: IconTileProps) {
  const hasInitials = typeof initials === "string" && initials.length > 0;
  return (
    <div
      className={cn(
        "rounded-xl bg-primary/10 border border-white/50 shadow-sm flex items-center justify-center",
        sizeClasses[size],
        className,
      )}
    >
      {hasInitials ? (
        <span className="text-primary font-semibold">{initials}</span>
      ) : (
        <User className="text-primary/40 w-1/2 h-1/2" />
      )}
    </div>
  );
}
