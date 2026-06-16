import { cn } from "~/lib/utils";

export interface AnalyticsCardPlaceholderProps {
  title: string;
  className?: string;
}

export function AnalyticsCardPlaceholder({
  title,
  className,
}: AnalyticsCardPlaceholderProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-[24px] border border-border shadow-xs p-6 flex flex-col gap-4",
        className,
      )}
    >
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      <div className="flex-1 flex items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/30">
        <span className="text-xs text-muted-foreground">{title} — Fase 2/3</span>
      </div>
    </div>
  );
}
