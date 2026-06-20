import { School } from "lucide-react";
import { Badge } from "~/components/ui/badge";

interface DistrictSchoolItem {
  _id: string;
  name?: string | null;
  city?: string | null;
  state?: string | null;
  deletedAt?: string | null;
}

interface DistrictSchoolsGridProps {
  schools: DistrictSchoolItem[];
}

function formatLocation(city?: string | null, state?: string | null): string {
  const parts = [city, state].filter(
    (p): p is string => typeof p === "string" && p.trim().length > 0,
  );
  return parts.length > 0 ? parts.join(", ") : "\u2014";
}

export function DistrictSchoolsGrid({ schools }: DistrictSchoolsGridProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold">
        Schools{" "}
        <span className="text-muted-foreground font-normal">
          ({schools.length})
        </span>
      </h2>

      {schools.length === 0 ? (
        <div className="bg-card rounded-xl border border-dashed border-border p-12 text-center">
          <School
            className="w-10 h-10 text-muted-foreground mx-auto mb-3"
            aria-hidden="true"
          />
          <p className="text-muted-foreground">No schools yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {schools.map((s) => (
            <div
              key={s._id}
              className="bg-card rounded-xl border border-border p-4 space-y-2"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium truncate">
                  {s.name ?? "Unnamed School"}
                </span>
                <Badge variant={s.deletedAt ? "neutral" : "active"}>
                  {s.deletedAt ? "Inactive" : "Active"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {formatLocation(s.city, s.state)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
