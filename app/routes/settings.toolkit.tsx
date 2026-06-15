import { Wrench } from "lucide-react";

import { SectionHeader } from "~/routes/settings/_components/section-header";

export default function SettingsToolkitRoute() {
  return (
    <div className="max-w-2xl">
      <SectionHeader
        title="Toolkit"
        subtitle="Resources and tools to support your mindfulness journey."
      />

      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-[24px] bg-muted flex items-center justify-center mb-4">
          <Wrench className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">Coming Soon</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Downloadable resources, guides, and teaching materials.
        </p>
      </div>
    </div>
  );
}
