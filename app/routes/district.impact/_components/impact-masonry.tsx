import { ImpactCard } from "./impact-card";
import type { ImpactStory } from "~/lib/district-impact.server";

interface ImpactMasonryProps {
  stories: ImpactStory[];
}

export function ImpactMasonry({ stories }: ImpactMasonryProps) {
  return (
    <div className="columns-1 gap-4 md:columns-2 lg:columns-3">
      {stories.map((story, index) => (
        <ImpactCard key={story.id} story={story} index={index} />
      ))}
    </div>
  );
}

export default ImpactMasonry;
