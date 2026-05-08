import { BookOpen, GraduationCap, School, Trash2, User } from "lucide-react";
import { Button } from "~/components/ui/button";

export interface ClassroomRowGroup {
  _id: string;
  name?: string | null;
  grade?: string | null;
  curriculums?: Array<string | null> | null;
  managerObj?: {
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
  } | null;
}

export interface ClassroomRowProps {
  group: ClassroomRowGroup;
  onDelete: (group: ClassroomRowGroup) => void;
  isDeleting?: boolean;
}

const gradeLabels: Record<string, string> = {
  early_learning: "Early Learning (Pre-K - K)",
  elementary: "Elementary School",
  middle_school: "Middle School",
  high_school: "High School",
  all_levels: "All Levels",
};

function getGradeLabel(grade?: string | null): string {
  if (grade == null) return "—";
  return gradeLabels[grade] ?? grade;
}

function getOwnerDisplay(managerObj: ClassroomRowGroup["managerObj"]): string {
  if (managerObj) {
    const first = managerObj.firstName ?? "";
    const last = managerObj.lastName ?? "";
    const fullName = `${first} ${last}`.trim();
    if (fullName.length > 0) return fullName;
    if (managerObj.email) return managerObj.email;
  }
  return "Unknown owner";
}

export function ClassroomRow({ group, onDelete, isDeleting = false }: ClassroomRowProps) {
  const seriesCount = (group.curriculums ?? []).filter(Boolean).length;
  const gradeLabel = getGradeLabel(group.grade);
  const ownerDisplay = getOwnerDisplay(group.managerObj);

  return (
    <div className="bg-white rounded-lg border-2 border-stone-200 transition-colors">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className="w-12 h-12 rounded-lg bg-stone-100 flex items-center justify-center">
            <School className="w-6 h-6 text-stone-500" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-stone-900 font-medium">
              {group.name ?? "Untitled classroom"}
            </h3>
            <div className="flex items-center gap-3 mt-1 text-sm text-stone-500">
              <span className="flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5" />
                {gradeLabel}
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" />
                {seriesCount} series
              </span>
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                {ownerDisplay}
              </span>
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          loading={isDeleting}
          onClick={() => onDelete(group)}
          aria-label="Delete classroom"
          className="text-red-500 hover:text-red-600 hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
