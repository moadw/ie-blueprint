import { useState } from "react";
import { Edit, GraduationCap, Layers, Trash2 } from "lucide-react";
import { toast } from "~/components/ui/toast";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { ConfirmDialog } from "~/components/ui/alert-dialog";
import { gqlClient } from "~/lib/graphql";
import { CurriculumCollectionDeleteOneDocument } from "~/queries/curriculum-collections";

export type ExperienceRowExperience = {
  _id: string;
  name?: string | null;
  gradeLevel?: string | null;
  color?: string | null;
  active?: boolean | null;
};

export const GRADE_LEVEL_LABEL: Record<string, string> = {
  early_learning: "Early Learning",
  elementary: "Elementary",
  middle_school: "Middle School",
  high_school: "High School",
  all_levels: "All Levels",
  sports: "Sports",
};

export interface ExperienceRowProps {
  experience: ExperienceRowExperience;
  onManageSeries?: (experience: ExperienceRowExperience) => void;
  onEdit?: (experience: ExperienceRowExperience) => void;
  onDeleted?: (id: string) => void;
}

export function ExperienceRow({
  experience,
  onManageSeries,
  onEdit,
  onDeleted,
}: ExperienceRowProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const active = experience.active !== false;
  const gradeLabel = experience.gradeLevel
    ? GRADE_LEVEL_LABEL[experience.gradeLevel] ?? experience.gradeLevel
    : "—";

  async function handleDelete() {
    setDeleting(true);
    try {
      // Live schema returns String! (the deleted id). A throw bubbles to the
      // catch below as a GraphQL error and is surfaced via toast.
      await gqlClient.request(CurriculumCollectionDeleteOneDocument, {
        id: experience._id,
      });
      toast.success(`Experience "${experience.name ?? "Untitled"}" deleted`);
      onDeleted?.(experience._id);
      setConfirmOpen(false);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete experience",
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div
      className={`bg-card rounded-[14px] border-2 transition-colors ${
        active ? "border-border" : "border-border/60 opacity-60"
      }`}
    >
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div
            className="w-3 h-12 rounded-full shrink-0"
            style={{ backgroundColor: experience.color || "#3B82F6" }}
            aria-hidden="true"
          />
          <div className="w-12 h-12 rounded-[16px] bg-muted flex items-center justify-center shrink-0">
            <Layers
              className="w-6 h-6 text-muted-foreground"
              aria-hidden="true"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-foreground font-medium truncate">
                {experience.name ?? "Untitled experience"}
              </h3>
              {!active ? (
                <Badge
                  shape="tag"
                  className="border-border text-muted-foreground bg-transparent"
                >
                  Inactive
                </Badge>
              ) : null}
            </div>
            <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <GraduationCap
                  className="w-3.5 h-3.5"
                  aria-hidden="true"
                />
                {gradeLabel}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onManageSeries?.(experience)}
            disabled={!onManageSeries}
          >
            Manage Series
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit?.(experience)}
            disabled={!onEdit}
            aria-label={`Edit ${experience.name ?? "experience"}`}
          >
            <Edit className="w-4 h-4" aria-hidden="true" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setConfirmOpen(true)}
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
            aria-label={`Delete ${experience.name ?? "experience"}`}
          >
            <Trash2 className="w-4 h-4" aria-hidden="true" />
          </Button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={`Delete "${experience.name ?? "this experience"}"?`}
        description="This will permanently remove the experience. Curriculums assigned to it will keep their other assignments."
        confirmLabel={deleting ? "Deleting…" : "Delete"}
        loading={deleting}
        onConfirm={() => {
          void handleDelete();
        }}
      />
    </div>
  );
}
