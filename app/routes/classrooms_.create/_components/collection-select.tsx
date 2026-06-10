import type { ComponentType } from "react";
import {
  Baby,
  BookOpen,
  GraduationCap,
  Layers,
  Sparkles,
  Trophy,
} from "lucide-react";
import { OptionCard } from "~/components/ui/option-card";

export interface CollectionOption {
  _id: string;
  name: string;
  subtitle: string;
  slug: string;
  curriculumIds: string[];
  seriesCount: number;
}

const ICON_BY_SLUG: Record<string, ComponentType<{ className?: string }>> = {
  "early-learning": Baby,
  elementary: Sparkles,
  middle: BookOpen,
  high: GraduationCap,
  sports: Trophy,
};

function SeriesBadge({ count }: { count: number }) {
  return (
    <span className="flex items-center w-fit gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-medium text-muted-foreground bg-gradient-to-br from-white/80 to-white/50 backdrop-blur-[8px] border border-white/60 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.9)]">
      <Layers className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
      {count} series
    </span>
  );
}

export function CollectionSelect({
  collections,
  selectedId,
  onSelect,
}: {
  collections: CollectionOption[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {collections.map((collection) => {
        const Icon = ICON_BY_SLUG[collection.slug] ?? Sparkles;
        return (
          <OptionCard
            key={collection._id}
            icon={<Icon className="w-6 h-6" />}
            title={collection.name}
            {...(collection.subtitle ? { subtitle: collection.subtitle } : {})}
            meta={<SeriesBadge count={collection.seriesCount} />}
            selected={collection._id === selectedId}
            onSelect={() => onSelect(collection._id)}
          />
        );
      })}
    </div>
  );
}
