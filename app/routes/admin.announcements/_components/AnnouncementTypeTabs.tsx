import { cn } from "~/lib/utils";

export type AnnouncementType = "district" | "educator" | "family";

const TYPES = [
  { value: "district", label: "District Portal" },
  { value: "educator", label: "Educator" },
  { value: "family", label: "Family" },
] as const;

export interface AnnouncementTypeTabsProps {
  value: AnnouncementType;
  onChange: (value: AnnouncementType) => void;
}

export function AnnouncementTypeTabs({
  value,
  onChange,
}: AnnouncementTypeTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Announcement audience"
      className="inline-flex rounded-[14px] border border-border bg-card p-1 shadow-xs"
    >
      {TYPES.map((tab) => {
        const active = tab.value === value;
        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.value)}
            className={cn(
              "inline-flex items-center justify-center whitespace-nowrap rounded-[12px] px-3 py-1.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
              active
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
