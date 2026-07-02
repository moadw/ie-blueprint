import { useEffect, useRef, useState } from "react";
import {
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  GripVertical,
  Image as ImageIcon,
  ImageIcon as ImageOverlay,
  Loader2,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Switch } from "~/components/ui/switch";
import { TapBlocks } from "~/components/admin/tap-blocks";
import { AchievementBlock } from "~/components/admin/achievement-block";
import { api } from "~/lib/api";
import { toErrorMessage } from "~/lib/errors";
import { gqlClient } from "~/lib/graphql";
import { ClassesUpdateOneDocument } from "~/mutations/classes";
import type { ClassesAdminFindManyQuery } from "~/gql/graphql";
import { cn } from "~/lib/utils";

type Practice = NonNullable<
  ClassesAdminFindManyQuery["ClassesAdminFindMany"]
>[number];

export interface PracticeRowProps {
  practice: Practice;
  onChange: () => void;
}

const GRADE_OPTIONS = [
  { value: "early_learning", label: "Early Learning" },
  { value: "elementary", label: "Elementary" },
  { value: "middle_school", label: "Middle School" },
  { value: "high_school", label: "High School" },
  { value: "all_levels", label: "All Levels" },
  { value: "sports", label: "Sports" },
] as const;

export function PracticeRow({ practice, onChange }: PracticeRowProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const bgInputRef = useRef<HTMLInputElement | null>(null);
  const practiceId = practice._id ?? "";

  const [expanded, setExpanded] = useState(false);
  const [title, setTitle] = useState(practice.title ?? "");
  const [description, setDescription] = useState(practice.description ?? "");
  const initialDay = Math.max(1, Math.round(practice.order ?? 1));
  const [day, setDay] = useState<number>(initialDay);

  // Access is wired to the record's `free` flag.
  const [accessLevel, setAccessLevel] = useState<string>(
    practice.free ? "free" : "premium",
  );

  // Visual-only state (not persisted)
  const [category, setCategory] = useState<string>("");
  const [gradeLevel, setGradeLevel] = useState<string>("all_levels");
  const [active, setActive] = useState<boolean>(true);

  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [titleEditing, setTitleEditing] = useState(false);
  const [titleSaving, setTitleSaving] = useState(false);

  // The class background persists like the cover: `PUT /admin/class-background`
  // writes it, and the GraphQL `classes` type exposes `background { url type }`
  // to read it back. `bgPreview` is an optimistic local preview of the
  // just-uploaded file shown until the parent revalidates and
  // `practice.background.url` refetches.
  const [bgPreview, setBgPreview] = useState<string | null>(null);
  const [bgUploading, setBgUploading] = useState(false);

  // Revoke the previous object URL whenever the preview changes or on unmount.
  useEffect(() => {
    if (!bgPreview) return;
    return () => URL.revokeObjectURL(bgPreview);
  }, [bgPreview]);

  // Re-sync local state if practice changes from parent revalidate.
  useEffect(() => {
    setTitle(practice.title ?? "");
    setDescription(practice.description ?? "");
    setDay(Math.max(1, Math.round(practice.order ?? 1)));
  }, [practice._id, practice.title, practice.description, practice.order]);

  const dayValue = Math.max(1, Math.round(day || 1));
  const completeness = (() => {
    const hasImage = Boolean(practice.cover?.url);
    const hasDescription = Boolean(practice.description);
    const hasCategory = Boolean(category);
    const missing: string[] = [];
    if (!hasImage) missing.push("Cover image");
    if (!hasDescription) missing.push("Description");
    if (!hasCategory) missing.push("Category");
    return { isComplete: missing.length === 0, missing };
  })();
  const isComplete = completeness.isComplete;

  // Prefer the optimistic just-uploaded preview, else the persisted background.
  const bgUrl = bgPreview ?? practice.background?.url ?? null;

  async function persistTitle(nextTitle: string) {
    const trimmed = nextTitle.trim();
    if (!trimmed || trimmed === (practice.title ?? "").trim()) {
      setTitle(practice.title ?? "");
      return;
    }
    setTitleSaving(true);
    try {
      const data = await gqlClient.request(ClassesUpdateOneDocument, {
        _id: practiceId,
        record: { title: trimmed },
      });
      const payloadError = (
        data.ClassesUpdateOne as { error?: { message?: string } | null } | null | undefined
      )?.error;
      if (payloadError?.message) throw new Error(payloadError.message);
      toast.success("Practice updated");
      onChange();
    } catch (err) {
      const msg = toErrorMessage(err, "Failed to update title");
      toast.error(msg);
      setTitle(practice.title ?? "");
    } finally {
      setTitleSaving(false);
    }
  }

  async function handleSave() {
    setSubmitting(true);
    try {
      const data = await gqlClient.request(ClassesUpdateOneDocument, {
        _id: practiceId,
        record: {
          title: title.trim(),
          description: description.trim() || null,
          order: dayValue,
          free: accessLevel === "free",
          // Category, Grade, Active are visual-only (I2/I3).
          // `deleted` is not written here — soft delete is the Delete button's job (I3).
        },
      });
      const payloadError = (
        data.ClassesUpdateOne as { error?: { message?: string } | null } | null | undefined
      )?.error;
      if (payloadError?.message) throw new Error(payloadError.message);
      toast.success("Practice updated");
      onChange();
      setExpanded(false);
    } catch (err) {
      const msg = toErrorMessage(err, "Failed to update practice");
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (
      !window.confirm(
        `Delete practice "${practice.title ?? "Untitled"}"?`,
      )
    )
      return;
    setDeleting(true);
    try {
      // Soft delete: flag the record; loader filters out `deleted` rows.
      await gqlClient.request(ClassesUpdateOneDocument, {
        _id: practiceId,
        record: { deleted: true },
      });
      toast.success("Practice deleted");
      onChange();
    } catch (err) {
      const msg = toErrorMessage(err, "Failed to delete practice");
      toast.error(msg);
    } finally {
      setDeleting(false);
    }
  }

  async function handleCoverPick(file: File) {
    try {
      const fd = new FormData();
      fd.append("class", practiceId); // class-cover uses field "class", not "_id"
      fd.append("file", file);
      await api("/admin/class-cover", { method: "PUT", body: fd });
      toast.success("Cover updated");
      onChange();
    } catch (err) {
      const msg = toErrorMessage(err, "Cover upload failed");
      console.error("[class-cover] upload failed", err);
      toast.error(msg);
    }
  }

  async function handleBgPick(file: File) {
    // Optimistic preview until the parent revalidates and `background.url` refetches.
    setBgPreview(URL.createObjectURL(file));
    setBgUploading(true);
    try {
      const fd = new FormData();
      // /admin/class-background mirrors /admin/class-cover: field "class" = class _id.
      fd.append("class", practiceId);
      fd.append("file", file);
      await api("/admin/class-background", { method: "PUT", body: fd });
      toast.success("Background updated");
      onChange();
    } catch (err) {
      const msg = toErrorMessage(err, "Background upload failed");
      console.error("[class-background] upload failed", err);
      toast.error(msg);
      setBgPreview(null); // revert — no server value to fall back to
    } finally {
      setBgUploading(false);
    }
  }

  return (
    <div
      className={cn(
        "rounded-[16px] border-2 bg-white shadow-xs transition-colors",
        isComplete ? "border-emerald-400" : "border-stone-200",
      )}
    >
      <div className="flex items-center justify-between gap-3 p-4">
        {/* TODO(reorder): wire to dnd-kit + ClassesUpdateOne order mutation */}
        <button
          type="button"
          aria-label="Drag to reorder"
          title="Drag to reorder (coming soon)"
          className="cursor-grab active:cursor-grabbing p-1 text-stone-400 hover:text-stone-600 touch-none flex-shrink-0"
        >
          <GripVertical className="h-5 w-5" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleCoverPick(file);
            e.target.value = "";
          }}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="group relative h-12 w-12 flex-shrink-0 cursor-pointer overflow-hidden rounded bg-stone-100 transition-all"
          aria-label="Upload cover"
          title="Cover image — click to upload"
        >
          {practice.cover?.url ? (
            <img
              src={practice.cover.url}
              alt={practice.title ?? "Practice cover"}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center">
              <ImageIcon className="h-4 w-4 text-stone-300" />
              <span className="mt-0.5 text-[8px] text-stone-400">Cover</span>
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
            <ImageOverlay className="h-3 w-3 text-white" />
          </div>
        </button>

        <input
          ref={bgInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleBgPick(file);
            e.target.value = "";
          }}
        />
        <button
          type="button"
          onClick={() => bgInputRef.current?.click()}
          disabled={bgUploading}
          className="group relative h-12 w-12 flex-shrink-0 cursor-pointer overflow-hidden rounded bg-stone-100 transition-all disabled:cursor-wait"
          aria-label="Upload background"
          title="Background image — click to upload"
        >
          {bgUrl ? (
            <img
              src={bgUrl}
              alt={`${practice.title ?? "Practice"} background`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center rounded border-2 border-dashed border-stone-200">
              <ImageIcon className="h-4 w-4 text-stone-300" />
              <span className="mt-0.5 text-[8px] text-stone-400">BG</span>
            </div>
          )}
          {bgUploading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <Loader2 className="h-3 w-3 animate-spin text-white" />
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
              <ImageOverlay className="h-3 w-3 text-white" />
            </div>
          )}
        </button>

        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded bg-stone-100 font-serif text-sm font-semibold text-stone-700">
          {dayValue}
        </div>

        <div className="min-w-0 flex-1">
          {titleEditing ? (
            <div className="flex items-center gap-2">
              <input
                autoFocus
                value={title}
                disabled={titleSaving}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    persistTitle(title);
                    setTitleEditing(false);
                  } else if (e.key === "Escape") {
                    setTitle(practice.title ?? "");
                    setTitleEditing(false);
                  }
                }}
                className="h-8 flex-1 rounded border border-stone-200 bg-stone-50 px-2 text-sm font-medium text-stone-900 outline-none focus:ring-2 focus:ring-primary/30"
              />
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  persistTitle(title);
                  setTitleEditing(false);
                }}
                className="flex h-6 w-6 items-center justify-center rounded text-emerald-600 hover:bg-stone-100"
                aria-label="Save title"
              >
                <Check className="h-3 w-3" />
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setTitle(practice.title ?? "");
                  setTitleEditing(false);
                }}
                className="flex h-6 w-6 items-center justify-center rounded text-stone-400 hover:bg-stone-100"
                aria-label="Cancel title edit"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <p
              onClick={() => setTitleEditing(true)}
              className="cursor-pointer truncate font-medium text-stone-900 transition-colors hover:text-stone-600"
              title="Click to edit title"
            >
              {practice.title || "Untitled"}
            </p>
          )}
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            {category ? (
              <Badge shape="tag" className="bg-transparent text-stone-500 border-stone-300">
                {category}
              </Badge>
            ) : null}
            <Badge shape="tag" className="bg-transparent text-stone-500 border-stone-300">
              {GRADE_OPTIONS.find((g) => g.value === gradeLevel)?.label ?? "All Levels"}
            </Badge>
            {isComplete ? (
              <Badge shape="tag" className="bg-emerald-100 text-emerald-700 border-emerald-200">
                <CheckCircle2 className="w-3 h-3" />
                Complete
              </Badge>
            ) : (
              <span className="text-xs text-stone-400">
                Missing: {completeness.missing.join(", ")}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-shrink-0 gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setExpanded((x) => !x)}
            aria-label={expanded ? "Collapse" : "Expand"}
            className="text-stone-500 hover:bg-stone-100 hover:text-stone-700"
          >
            {expanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            disabled={deleting}
            aria-label="Delete practice"
            className="text-red-500 hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
          >
            {deleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {expanded ? (
        <div className="space-y-4 border-t border-stone-100 px-4 pt-2 pb-4">
          <div className="w-32">
            <label className="mb-1 block text-xs font-medium text-stone-600">
              Day
            </label>
            <input
              type="number"
              min={1}
              step={1}
              value={day}
              onChange={(e) =>
                setDay(Math.max(1, Number(e.target.value) || 1))
              }
              className="w-full rounded-md border border-stone-200 bg-card px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div className="flex items-center justify-between rounded-md border border-stone-200 bg-stone-50/40 px-3 py-2">
            <span className="text-sm text-stone-600">Active</span>
            <Switch checked={active} onCheckedChange={setActive} />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-stone-600">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-20 w-full rounded-md border border-stone-200 bg-card p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {/* Taps persist via their own mutations — independent of the
              practice Save button below. */}
          <div>
            <label className="mb-1 block text-xs font-medium text-stone-600">
              Content
            </label>
            <TapBlocks classId={practiceId} />
          </div>

          {/* The achievement (pin) persists via its own mutations —
              independent of the practice Save button below. */}
          <div>
            <label className="mb-1 block text-xs font-medium text-stone-600">
              Achievement
            </label>
            <AchievementBlock
              classId={practiceId}
              curriculumId={practice.curriculum ?? null}
            />
          </div>

          <div className="flex justify-end">
            <Button
              size="sm"
              onClick={handleSave}
              disabled={submitting}
              className="bg-stone-900 text-white hover:bg-stone-800"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default PracticeRow;
