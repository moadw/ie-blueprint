import { IconTile } from "~/components/ui/icon-tile";
import { getInitials } from "~/lib/initials";

export interface ClassroomPreviewCardProps {
  name: string;
}

export function ClassroomPreviewCard({ name }: ClassroomPreviewCardProps) {
  const trimmed = name.trim();
  const displayName = trimmed.length > 0 ? trimmed : "Your classroom";
  const initials = getInitials(trimmed);
  return (
    <div className="w-full max-w-sm rounded-2xl border border-white/50 bg-gradient-to-br from-white/70 to-white/30 backdrop-blur-xl shadow-lg p-6 flex flex-col items-start gap-4">
      <IconTile size="lg" {...(initials ? { initials } : {})} />
      <div className="text-lg font-medium text-foreground">{displayName}</div>
    </div>
  );
}
