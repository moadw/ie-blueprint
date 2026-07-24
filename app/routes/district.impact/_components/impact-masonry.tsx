import { ImpactCard } from "./impact-card";
import type { ImpactStory } from "~/lib/district-impact.server";

interface ImpactMasonryProps {
  stories: ImpactStory[];
}

export function ImpactMasonry({ stories }: ImpactMasonryProps) {
  return (
    // `print:columns-2` mantiene el layout masonry al exportar (window.print):
    // sin él, print media no matchea los breakpoints `md/lg` y las columnas caen
    // a 1 → cada card queda apilada. Las cards ya traen `break-inside-avoid`, así
    // que no se parten entre columnas/páginas.
    <div className="columns-1 gap-4 md:columns-2 lg:columns-3 print:columns-2">
      {stories.map((story, index) => (
        <ImpactCard key={story.id} story={story} index={index} />
      ))}
    </div>
  );
}

export default ImpactMasonry;
