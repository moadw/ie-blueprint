import {
  Building2,
  ExternalLink,
  MapPin,
  Pencil,
  School,
  ShieldCheck,
  User,
} from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";

export interface DistrictRowDistrict {
  _id: string;
  name?: string | null;
  state?: string | null;
}

export interface DistrictRowProps {
  district: DistrictRowDistrict;
  onSchools?: (district: DistrictRowDistrict) => void;
  onEdit?: (district: DistrictRowDistrict) => void;
}

export function DistrictRow({ district, onSchools, onEdit }: DistrictRowProps) {
  const idTail = district._id ? district._id.slice(-6) : "";
  return (
    <div className="bg-card rounded-lg border border-border p-4 hover:border-border/80 transition-colors">
      <div className="flex items-start gap-4">
        {/* Left thumbnail */}
        <div className="w-20 h-20 rounded-lg bg-muted flex-shrink-0 flex items-center justify-center">
          <Building2 className="w-8 h-8 text-muted-foreground" aria-hidden="true" />
        </div>

        {/* Center info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-foreground truncate">
              {district.name ?? "Unnamed district"}
            </span>
            {idTail ? (
              <span className="font-mono text-xs text-muted-foreground">
                /{idTail}
              </span>
            ) : null}
          </div>

          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
            <MapPin className="w-3 h-3" aria-hidden="true" />
            <span>{district.state ?? "—"}</span>
          </div>

          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <User className="w-3 h-3" aria-hidden="true" />
            <span>No admin assigned</span>
          </div>
        </div>

        {/* Right: license + actions */}
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Badge variant="neutral">No License</Badge>
          </div>

          <div className="text-xs text-muted-foreground">No license</div>

          <div className="flex gap-1.5 mt-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit?.(district)}
              disabled={!onEdit}
            >
              <Pencil className="w-3 h-3" aria-hidden="true" /> Edit
            </Button>
            {/* TODO(license): wire to license management plan */}
            <Button variant="outline" size="sm" disabled>
              <ShieldCheck className="w-3 h-3" aria-hidden="true" /> License
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSchools?.(district)}
              disabled={!onSchools}
            >
              <School className="w-3 h-3" aria-hidden="true" /> Schools
            </Button>
            {/* TODO(portal): wire to district portal navigation plan */}
            <Button variant="outline" size="sm" disabled>
              <ExternalLink className="w-3 h-3" aria-hidden="true" /> Portal
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
