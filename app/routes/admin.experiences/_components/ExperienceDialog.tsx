import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select } from "~/components/ui/select";
import { Switch } from "~/components/ui/switch";
import { Textarea } from "~/components/ui/textarea";
import { toast } from "~/components/ui/toast";
import { gqlClient } from "~/lib/graphql";
import {
  CurriculumCollectionCreateOneDocument,
  CurriculumCollectionUpdateOneDocument,
} from "~/queries/curriculum-collections";

export type Experience = {
  _id: string;
  name?: string | null;
  slug?: string | null;
  description?: string | null;
  gradeLevel?: string | null;
  color?: string | null;
  active?: boolean | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

type CreateProps = {
  mode: "create";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (experience: Experience) => void;
};

type EditProps = {
  mode: "edit";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  experience: Experience;
  onUpdated: (experience: Experience) => void;
};

export type ExperienceDialogProps = CreateProps | EditProps;

const GRADE_LEVELS: ReadonlyArray<{ value: string; label: string }> = [
  { value: "early_learning", label: "Early Learning" },
  { value: "elementary", label: "Elementary" },
  { value: "middle_school", label: "Middle School" },
  { value: "high_school", label: "High School" },
  { value: "all_levels", label: "All Levels" },
  { value: "sports", label: "Sports" },
];

function generateSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

type FormState = {
  name: string;
  slug: string;
  description: string;
  gradeLevel: string;
  color: string;
  active: boolean;
};

const EMPTY_FORM: FormState = {
  name: "",
  slug: "",
  description: "",
  gradeLevel: "all_levels",
  color: "#3B82F6",
  active: true,
};

const FIELD_INPUT_CLASS =
  "h-10 px-3 rounded-[14px] bg-stone-50 border border-stone-200 text-stone-900 text-sm placeholder:text-stone-400 focus:ring-stone-300";

const LABEL_CLASS = "text-stone-600 text-sm font-medium";

export function ExperienceDialog(props: ExperienceDialogProps) {
  const { mode, open, onOpenChange } = props;
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  const experienceId = mode === "edit" ? props.experience._id : null;

  useEffect(() => {
    if (!open) return;
    if (mode === "create") {
      setForm(EMPTY_FORM);
    } else {
      const e = props.experience;
      setForm({
        name: e.name ?? "",
        slug: e.slug ?? generateSlug(e.name ?? ""),
        description: e.description ?? "",
        gradeLevel: e.gradeLevel ?? "all_levels",
        color: e.color ?? "#3B82F6",
        active: e.active !== false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [experienceId, open]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const trimmedName = form.name.trim();
    if (!trimmedName) return;
    const trimmedSlug = form.slug.trim() || generateSlug(trimmedName);
    const trimmedDescription = form.description.trim();

    setSubmitting(true);
    try {
      if (mode === "create") {
        const input: {
          name: string;
          slug: string;
          description?: string;
          gradeLevel: string;
          color: string;
          active: boolean;
        } = {
          name: trimmedName,
          slug: trimmedSlug,
          gradeLevel: form.gradeLevel,
          color: form.color,
          active: form.active,
        };
        if (trimmedDescription) input.description = trimmedDescription;
        const data = await gqlClient.request(
          CurriculumCollectionCreateOneDocument,
          { input },
        );
        const created = data.curriculumCollectionCreateOne;
        if (!created) {
          toast.error("Experience created but response was empty.");
          return;
        }
        const experience: Experience = {
          _id: created._id,
          name: created.name ?? trimmedName,
          slug: created.slug ?? trimmedSlug,
          description: created.description ?? null,
          gradeLevel: created.gradeLevel ?? form.gradeLevel,
          color: created.color ?? form.color,
          active: created.active ?? form.active,
          createdAt: (created.createdAt as string | null | undefined) ?? null,
          updatedAt: (created.updatedAt as string | null | undefined) ?? null,
        };
        toast.success(`Experience "${experience.name ?? trimmedName}" created`);
        props.onCreated(experience);
        onOpenChange(false);
        setForm(EMPTY_FORM);
        return;
      }

      // edit
      const input: {
        name: string;
        slug: string;
        description?: string;
        gradeLevel: string;
        color: string;
        active: boolean;
      } = {
        name: trimmedName,
        slug: trimmedSlug,
        gradeLevel: form.gradeLevel,
        color: form.color,
        active: form.active,
      };
      if (trimmedDescription) input.description = trimmedDescription;
      const data = await gqlClient.request(
        CurriculumCollectionUpdateOneDocument,
        { id: props.experience._id, input },
      );
      const updated = data.curriculumCollectionUpdateOne;
      if (!updated) {
        toast.error("Experience updated but response was empty.");
        return;
      }
      const experience: Experience = {
        _id: updated._id,
        name: updated.name ?? trimmedName,
        slug: updated.slug ?? trimmedSlug,
        description: updated.description ?? null,
        gradeLevel: updated.gradeLevel ?? form.gradeLevel,
        color: updated.color ?? form.color,
        active: updated.active ?? form.active,
        createdAt: (updated.createdAt as string | null | undefined) ?? null,
        updatedAt: (updated.updatedAt as string | null | undefined) ?? null,
      };
      toast.success("Experience updated");
      props.onUpdated(experience);
      onOpenChange(false);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to save experience",
      );
    } finally {
      setSubmitting(false);
    }
  }

  const title = mode === "create" ? "New Experience" : "Edit Experience";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white border-stone-200 text-stone-900 max-w-md font-sans rounded-[16px]">
        <DialogHeader className="mb-0">
          <DialogTitle className="font-serif text-xl font-normal text-stone-900">
            {title}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="experience-name" className={LABEL_CLASS}>
              Name *
            </Label>
            <Input
              id="experience-name"
              value={form.name}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  name: e.target.value,
                  ...(mode === "create"
                    ? { slug: generateSlug(e.target.value) }
                    : {}),
                }))
              }
              className={FIELD_INPUT_CLASS}
              placeholder="High School"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="experience-slug" className={LABEL_CLASS}>
              Slug *
            </Label>
            <Input
              id="experience-slug"
              value={form.slug}
              onChange={(e) =>
                setForm((f) => ({ ...f, slug: generateSlug(e.target.value) }))
              }
              className={`${FIELD_INPUT_CLASS} font-mono text-xs`}
              placeholder="high-school"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="experience-description" className={LABEL_CLASS}>
              Description
            </Label>
            <Textarea
              id="experience-description"
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              rows={3}
              className={`${FIELD_INPUT_CLASS} h-auto py-2`}
              placeholder="Mindfulness practices for…"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="experience-grade-level" className={LABEL_CLASS}>
              Grade Level
            </Label>
            <Select
              id="experience-grade-level"
              value={form.gradeLevel}
              onChange={(e) =>
                setForm((f) => ({ ...f, gradeLevel: e.target.value }))
              }
              className={FIELD_INPUT_CLASS}
            >
              {GRADE_LEVELS.map((g) => (
                <option key={g.value} value={g.value}>
                  {g.label}
                </option>
              ))}
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="experience-color" className={LABEL_CLASS}>
              Theme Color
            </Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                id="experience-color"
                value={form.color}
                onChange={(e) =>
                  setForm((f) => ({ ...f, color: e.target.value }))
                }
                className="w-10 h-10 rounded-[14px] border border-stone-200 cursor-pointer bg-stone-50"
                aria-label="Theme color picker"
              />
              <Input
                value={form.color}
                onChange={(e) =>
                  setForm((f) => ({ ...f, color: e.target.value }))
                }
                className={`${FIELD_INPUT_CLASS} flex-1 font-mono text-xs`}
                aria-label="Theme color hex"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              id="experience-active"
              checked={form.active}
              onCheckedChange={(checked) =>
                setForm((f) => ({ ...f, active: checked }))
              }
            />
            <Label
              htmlFor="experience-active"
              className="text-stone-600 text-sm"
            >
              Active
            </Label>
          </div>

          <div className="flex gap-3 pt-4 border-t border-stone-100">
            <Button
              type="submit"
              loading={submitting}
              disabled={submitting || !form.name.trim()}
              className="h-10 px-4 rounded-[14px] bg-stone-900 hover:bg-stone-800 text-white text-sm font-medium"
            >
              {mode === "create" ? "Create Experience" : "Save Changes"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
              className="h-10 px-4 rounded-[14px] text-stone-500 hover:text-stone-700 hover:bg-transparent text-sm font-medium"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
