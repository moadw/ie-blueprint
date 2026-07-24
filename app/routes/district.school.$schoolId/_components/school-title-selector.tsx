import { useNavigate } from "react-router";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuItem,
} from "~/components/ui/dropdown-menu";
import { cn } from "~/lib/utils";

/** One entry in the switcher list — a school-admin's own school. */
export interface SchoolTitleOption {
  _id: string;
  name: string | null;
}

export interface SchoolTitleSelectorProps {
  /** The school-admin's full school list. Only rendered by the caller when
   *  there are 2+ (a single school stays a plain `<h1>`). */
  schools: SchoolTitleOption[];
  /** The school currently shown on the page — highlighted in the list. */
  currentSchoolId: string;
  /** Trigger label — the current school's name. */
  currentSchoolName: string;
}

/**
 * Page-title school switcher for a multi-school school-admin's
 * `/district/school/:id` detail view. Reuses the `DropdownMenu` primitive (a
 * thin `Popover` composite already used for row/card action menus) with the
 * trigger styled as the page `<h1>` instead of a button, so it reads as a
 * TITLE, not a form control — no border/background until hovered, same
 * `text-xl font-bold` as the static title it replaces.
 *
 * Deliberately NOT built on `SearchableSelect` / `DistrictCombobox`: both
 * render a bordered, input-styled trigger (built for large searchable lists),
 * which is the wrong shape here — a school-admin has a handful of schools at
 * most, and the trigger must look like a heading.
 */
export function SchoolTitleSelector({
  schools,
  currentSchoolId,
  currentSchoolName,
}: SchoolTitleSelectorProps) {
  const navigate = useNavigate();

  return (
    <DropdownMenu
      align="start"
      trigger={
        <button
          type="button"
          className="-mx-1.5 flex items-center gap-1.5 rounded-lg px-1.5 py-0.5 text-xl font-bold text-foreground transition-colors hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          aria-label={`Switch school (currently ${currentSchoolName})`}
        >
          {currentSchoolName}
          <ChevronDown
            className="h-4 w-4 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
        </button>
      }
    >
      {schools.map((s) => {
        const active = s._id === currentSchoolId;
        return (
          <DropdownMenuItem
            key={s._id}
            onClick={() => navigate(`/district/school/${s._id}`)}
            className={cn(active && "bg-muted font-medium")}
          >
            {s.name ?? "Unnamed School"}
          </DropdownMenuItem>
        );
      })}
    </DropdownMenu>
  );
}
