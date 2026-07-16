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
  courses?: Array<string | null> | null;
  coursesCollections?: Array<string | null> | null;
  licenseLabel?: string | null;
  coverPhoto?: { url?: string | null } | null;
  logo?: { url?: string | null } | null;
  profile?: {
    city?: string | null;
    cover?: { url?: string | null } | null;
  } | null;
}

export interface DistrictRowProps {
  district: DistrictRowDistrict;
  onSchools?: (district: DistrictRowDistrict) => void;
  onLicense?: (district: DistrictRowDistrict) => void;
  onEdit?: (district: DistrictRowDistrict) => void;
}

export function DistrictRow({
  district,
  onSchools,
  onLicense,
  onEdit,
}: DistrictRowProps) {
  const idTail = district._id ? district._id.slice(-6) : "";
  const validCourses = (district.courses ?? []).filter(
    (id): id is string => !!id,
  );
  const courseCount = validCourses.length;
  const hasLicense = !!district.licenseLabel;
  return (
    <div className="bg-card rounded-lg border border-border p-4 hover:border-border/80 transition-colors">
      <div className="flex items-start gap-4">
        {/* Left thumbnail */}
        <div className="w-20 h-20 rounded-lg bg-muted flex-shrink-0 overflow-hidden flex items-center justify-center">
          {district.logo?.url ? (
            <img
              src={district.logo.url}
              alt=""
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : district.coverPhoto?.url ? (
            <img
              src={district.coverPhoto.url}
              alt=""
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <Building2 className="w-8 h-8 text-muted-foreground" aria-hidden="true" />
          )}
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

          {district.profile?.city ? (
            <div className="text-sm text-muted-foreground mb-1 truncate">
              {district.profile.city}
            </div>
          ) : null}

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
            {hasLicense ? (
              <Badge variant="active">{district.licenseLabel}</Badge>
            ) : (
              <Badge variant="neutral">No License</Badge>
            )}
          </div>

          <div className="text-xs text-muted-foreground">
            {courseCount} courses
          </div>

          <div className="flex gap-1.5 mt-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit?.(district)}
              disabled={!onEdit}
            >
              <Pencil className="w-3 h-3" aria-hidden="true" /> Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onLicense?.(district)}
              disabled={!onLicense}
            >
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
            {/* Full-document navigation (not client navigate) so the enter
                route's Set-Cookie applies before /district loaders run. */}
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                window.location.assign(`/preview/district/${district._id}`)
              }
            >
              <ExternalLink className="w-3 h-3" aria-hidden="true" /> Portal
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
