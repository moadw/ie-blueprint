import { Form, useSubmit } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Select } from "~/components/ui/select";
import { cn } from "~/lib/utils";

export interface AnalyticsHeaderProps {
  startDate: string;
  endDate: string;
  granularity: "daily" | "weekly" | "monthly";
  compareStart?: string;
  compareEnd?: string;
}

export function AnalyticsHeader({
  startDate,
  endDate,
  granularity,
  compareStart,
  compareEnd,
}: AnalyticsHeaderProps) {
  const submit = useSubmit();

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <h1 className="font-serif text-4xl text-foreground lg:text-5xl">Overview</h1>

      <Form
        method="get"
        className="flex flex-col flex-wrap gap-3 lg:flex-row lg:items-end"
        onChange={(event) => {
          const form = event.currentTarget;
          submit(form, { method: "get" });
        }}
      >
        <div className="flex flex-wrap items-end gap-2">
          <label className="flex flex-col gap-1 text-xs text-muted-foreground">
            Date range
            <span className="inline-flex items-center gap-2">
              <Input
                type="date"
                name="start"
                defaultValue={startDate}
                className="h-9 w-[140px] px-2 text-xs"
              />
              <span className="text-muted-foreground">→</span>
              <Input
                type="date"
                name="end"
                defaultValue={endDate}
                className="h-9 w-[140px] px-2 text-xs"
              />
            </span>
          </label>
        </div>

        <div className="flex flex-wrap items-end gap-2">
          <label className="flex flex-col gap-1 text-xs text-muted-foreground">
            Compared to
            <span className="inline-flex items-center gap-2">
              <Input
                type="date"
                name="compareStart"
                defaultValue={compareStart}
                className="h-9 w-[140px] px-2 text-xs"
              />
              <span className="text-muted-foreground">→</span>
              <Input
                type="date"
                name="compareEnd"
                defaultValue={compareEnd}
                className="h-9 w-[140px] px-2 text-xs"
              />
            </span>
          </label>
        </div>

        <label className="flex flex-col gap-1 text-xs text-muted-foreground">
          Granularity
          <Select
            name="granularity"
            defaultValue={granularity}
            className="h-9 w-[120px] py-0 text-xs"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </Select>
        </label>

        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled
          title="Add widget — coming soon"
          className={cn("h-9 rounded-full px-4 text-xs", "disabled:opacity-60")}
        >
          Add widget
        </Button>
      </Form>
    </div>
  );
}
