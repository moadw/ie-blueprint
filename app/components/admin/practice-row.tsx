import { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Film,
  Image as ImageIcon,
  ImageIcon as ImageOverlay,
  Loader2,
  Music,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Switch } from "~/components/ui/switch";
import { api } from "~/lib/api";
import { gqlClient } from "~/lib/graphql";
import {
  LessonDeleteOneDocument,
  LessonUpdateOneDocument,
} from "~/mutations/lessons";
import type { LessonFindManyQuery } from "~/gql/graphql";
import { cn } from "~/lib/utils";

type Practice = NonNullable<
  NonNullable<LessonFindManyQuery["LessonFindMany"]>[number]
>;

export interface PracticeRowProps {
  practice: Practice;
  onChange: () => void;
}

const CATEGORY_OPTIONS = [
  "transition",
  "sound",
  "focus",
  "gratitude",
  "nature",
  "kindness",
  "energy",
  "calm",
] as const;

const GRADE_OPTIONS = [
  { value: "early_learning", label: "Early Learning" },
  { value: "elementary", label: "Elementary" },
  { value: "middle_school", label: "Middle School" },
  { value: "high_school", label: "High School" },
  { value: "all_levels", label: "All Levels" },
  { value: "sports", label: "Sports" },
] as const;

const ACCESS_OPTIONS = [
  { value: "free", label: "Free" },
  { value: "premium", label: "Premium" },
] as const;

export function PracticeRow({ practice, onChange }: PracticeRowProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const practiceId = practice._id ?? "";

  const [expanded, setExpanded] = useState(false);
  const [title, setTitle] = useState(practice.title ?? "");
  const [description, setDescription] = useState(practice.description ?? "");
  const initialDay = Math.max(1, Math.round(practice.order ?? 1));
  const [day, setDay] = useState<number>(initialDay);

  // Visual-only state (not persisted)
  const [category, setCategory] = useState<string>("");
  const [gradeLevel, setGradeLevel] = useState<string>("all_levels");
  const [accessLevel, setAccessLevel] = useState<string>("free");
  const [active, setActive] = useState<boolean>(true);
  const [hasJournal, setHasJournal] = useState<boolean>(false);
  const [journalPrompt, setJournalPrompt] = useState<string>("");

  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [titleEditing, setTitleEditing] = useState(false);
  const [titleSaving, setTitleSaving] = useState(false);

  // Re-sync local state if practice changes from parent revalidate.
  useEffect(() => {
    setTitle(practice.title ?? "");
    setDescription(practice.description ?? "");
    setDay(Math.max(1, Math.round(practice.order ?? 1)));
  }, [practice._id, practice.title, practice.description, practice.order]);

  const dayValue = Math.max(1, Math.round(day || 1));
  const isComplete = Boolean(
    practice.title && practice.description && practice.cover?.url,
  );

  async function persistTitle(nextTitle: string) {
    const trimmed = nextTitle.trim();
    if (!trimmed || trimmed === (practice.title ?? "").trim()) {
      setTitle(practice.title ?? "");
      return;
    }
    setTitleSaving(true);
    try {
      const data = await gqlClient.request(LessonUpdateOneDocument, {
        _id: practiceId,
        record: { title: trimmed },
      });
      const payloadError = (
        data.LessonUpdateOne as { error?: { message?: string } | null } | null | undefined
      )?.error;
      if (payloadError?.message) throw new Error(payloadError.message);
      toast.success("Practice updated");
      onChange();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to update title";
      toast.error(msg);
      setTitle(practice.title ?? "");
    } finally {
      setTitleSaving(false);
    }
  }

  async function handleSave() {
    setSubmitting(true);
    try {
      const data = await gqlClient.request(LessonUpdateOneDocument, {
        _id: practiceId,
        record: {
          title: title.trim(),
          description: description.trim() || null,
          order: dayValue,
          // classificationType intentionally omitted (Decision 2-3, plan)
        },
      });
      const payloadError = (
        data.LessonUpdateOne as { error?: { message?: string } | null } | null | undefined
      )?.error;
      if (payloadError?.message) throw new Error(payloadError.message);
      toast.success("Practice updated");
      onChange();
      setExpanded(false);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to update practice";
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
      await gqlClient.request(LessonDeleteOneDocument, { _id: practiceId });
      toast.success("Practice deleted");
      onChange();
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to delete practice";
      toast.error(msg);
    } finally {
      setDeleting(false);
    }
  }

  async function handleCoverPick(file: File) {
    try {
      const fd = new FormData();
      fd.append("_id", practiceId); // underscore — not "id"
      fd.append("file", file);
      await api("/admin/lesson-cover", { method: "PUT", body: fd });
      toast.success("Cover updated");
      onChange();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Cover upload failed";
      toast.error(msg);
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
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg"
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

        <div
          className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded bg-stone-100"
          aria-label="Background image (visual placeholder)"
          title="Background image (coming soon)"
        >
          <div className="flex h-full w-full flex-col items-center justify-center rounded border-2 border-dashed border-stone-200">
            <ImageIcon className="h-4 w-4 text-stone-300" />
            <span className="mt-0.5 text-[8px] text-stone-400">BG</span>
          </div>
        </div>

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
          <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs">
            {category ? (
              <span className="inline-flex items-center rounded-full border border-stone-300 px-2 py-0.5 text-stone-500">
                {category}
              </span>
            ) : null}
            <span className="inline-flex items-center rounded-full border border-stone-300 px-2 py-0.5 text-stone-500">
              {GRADE_OPTIONS.find((g) => g.value === gradeLevel)?.label ??
                "All Levels"}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-amber-600">
              <AlertCircle className="h-3 w-3" />
              No audio
            </span>
            {hasJournal ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-100 px-2 py-0.5 text-amber-700">
                <BookOpen className="h-3 w-3" />
                Journal
              </span>
            ) : null}
            {isComplete ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-100 px-2 py-0.5 text-emerald-700">
                <CheckCircle2 className="h-3 w-3" />
                Complete
              </span>
            ) : (
              <span className="text-stone-400">Missing: Category</span>
            )}
          </div>
        </div>

        <div className="flex flex-shrink-0 items-center gap-1.5">
          <div
            className="flex h-12 w-12 flex-col items-center justify-center rounded border-2 border-dashed border-stone-300 bg-stone-100"
            aria-label="Full audio (visual placeholder)"
            title="Full audio (coming soon)"
          >
            <Music className="h-4 w-4 text-stone-400" />
            <span className="mt-0.5 text-[8px] font-medium text-stone-400">
              Full
            </span>
          </div>
          <div
            className="flex h-12 w-12 flex-col items-center justify-center rounded border-2 border-dashed border-stone-300 bg-stone-100"
            aria-label="Short audio (visual placeholder)"
            title="5-min audio (coming soon)"
          >
            <Clock className="h-4 w-4 text-stone-400" />
            <span className="mt-0.5 text-[8px] font-medium text-stone-400">
              5min
            </span>
          </div>
          <div
            className="flex h-12 w-12 flex-col items-center justify-center rounded border-2 border-dashed border-stone-300 bg-stone-100"
            aria-label="Video (visual placeholder)"
            title="Video (coming soon)"
          >
            <Film className="h-4 w-4 text-stone-400" />
            <span className="mt-0.5 text-[8px] font-medium text-stone-400">
              Video
            </span>
          </div>
        </div>

        <div className="flex flex-shrink-0 gap-1">
          <button
            type="button"
            onClick={() => setExpanded((x) => !x)}
            className="flex h-9 w-9 items-center justify-center rounded text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-700"
            aria-label={expanded ? "Collapse" : "Expand"}
          >
            {expanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="flex h-9 w-9 items-center justify-center rounded text-red-500 transition-colors hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
            aria-label="Delete practice"
          >
            {deleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {expanded ? (
        <div className="space-y-4 border-t border-stone-100 px-4 pt-2 pb-4">
          <div className="grid grid-cols-4 gap-3">
            <div>
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
            <div>
              <label className="mb-1 block text-xs font-medium text-stone-600">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-md border border-stone-200 bg-card px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="">—</option>
                {CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-stone-600">
                Grade
              </label>
              <select
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
                className="w-full rounded-md border border-stone-200 bg-card px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {GRADE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-stone-600">
                Access
              </label>
              <select
                value={accessLevel}
                onChange={(e) => setAccessLevel(e.target.value)}
                className="w-full rounded-md border border-stone-200 bg-card px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {ACCESS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
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

          <div className="space-y-2 rounded-md border border-amber-200 bg-amber-50/40 p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-amber-800">
                Journal
              </span>
              <Switch checked={hasJournal} onCheckedChange={setHasJournal} />
            </div>
            {hasJournal ? (
              <textarea
                placeholder="Journal prompt"
                value={journalPrompt}
                onChange={(e) => setJournalPrompt(e.target.value)}
                className="h-16 w-full rounded-md border border-amber-200 bg-card p-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-200/50"
              />
            ) : null}
          </div>

          <div className="rounded-md border border-blue-200 bg-blue-50/40 p-3 text-sm text-blue-700">
            Add translation
          </div>

          <p className="text-xs text-stone-400">No media</p>

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
