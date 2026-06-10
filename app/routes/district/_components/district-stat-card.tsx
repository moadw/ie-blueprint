import type { ReactNode } from "react";
import { cn } from "~/lib/utils";

export type DistrictStatStatus = "Normal" | "Moderate" | "Low";

export interface DistrictStatCardProps {
  title: string;
  value: string;
  suffix?: string;
  status: DistrictStatStatus;
  chart: ReactNode;
}

const statusColor: Record<DistrictStatStatus, string> = {
  Normal: "bg-primary/10 text-primary",
  Moderate: "bg-orange-100 text-orange-600",
  Low: "bg-red-100 text-red-600",
};

export function DistrictStatCard({
  title,
  value,
  suffix,
  status,
  chart,
}: DistrictStatCardProps) {
  return (
    <div className="bg-white rounded-[24px] p-3 border border-border shadow-xs flex flex-col">
      <div className="flex items-center justify-between mb-1.5">
        <p className="text-sm font-bold text-muted-foreground font-serif">
          {title}
        </p>
        <span
          className={cn(
            "text-[10px] font-medium rounded-full px-2.5 py-0.5",
            statusColor[status],
          )}
        >
          {status}
        </span>
      </div>
      <p className="text-4xl font-bold text-foreground mb-2 font-serif">
        {value}
        {suffix ? (
          <span className="text-sm text-muted-foreground font-normal ml-1">
            {suffix}
          </span>
        ) : null}
      </p>
      <div className="flex-1 flex items-end">{chart}</div>
    </div>
  );
}

export default DistrictStatCard;
