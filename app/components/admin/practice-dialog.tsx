import { useEffect, useState } from "react";
import { useRevalidator } from "react-router";
import { ChevronDown, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Modal } from "~/components/ui/modal";
import { Switch } from "~/components/ui/switch";
import { api } from "~/lib/api";
import { env } from "~/lib/env";
import { gqlClient } from "~/lib/graphql";
import { ClassesCreateOneDocument } from "~/mutations/classes";
import { cn } from "~/lib/utils";

export interface PracticeDialogProps {
  open: boolean;
  onClose: () => void;
  curriculumId: string;
  defaultOrder?: number;
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

const selectClass =
  "w-full h-[44px] px-3 pr-9 bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary/30";
const labelClass = "block text-[14px] text-foreground mb-2 font-medium";

export function PracticeDialog({
  open,
  onClose,
  curriculumId,
  defaultOrder,
}: PracticeDialogProps) {
  const revalidator = useRevalidator();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [day, setDay] = useState<number>(defaultOrder ?? 1);

  // Visual-only fields
  const [category, setCategory] = useState<string>("transition");
  const [gradeLevel, setGradeLevel] = useState<string>("all_levels");
  const [accessLevel, setAccessLevel] = useState<string>("free");
  const [hasJournal, setHasJournal] = useState<boolean>(false);
  const [journalPrompt, setJournalPrompt] = useState<string>("");
  const [active, setActive] = useState<boolean>(true);

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!coverFile) {
      setCoverPreview(null);
      return;
    }
    const url = URL.createObjectURL(coverFile);
    setCoverPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [coverFile]);

  // Reset on close.
  useEffect(() => {
    if (open) return;
    setTitle("");
    setDescription("");
    setDay(defaultOrder ?? 1);
    setCategory("transition");
    setGradeLevel("all_levels");
    setAccessLevel("free");
    setHasJournal(false);
    setJournalPrompt("");
    setActive(true);
    setCoverFile(null);
    setError(null);
    setSubmitting(false);
  }, [open, defaultOrder]);

  // Refresh default day when dialog opens.
  useEffect(() => {
    if (open) setDay(defaultOrder ?? 1);
  }, [open, defaultOrder]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const dayValue = Math.max(1, Math.round(day || 1));
      const data = await gqlClient.request(ClassesCreateOneDocument, {
        record: {
          title: title.trim(),
          description: description.trim() || null,
          order: dayValue,
          curriculum: curriculumId,
          platform: env.PLATFORM,
          free: accessLevel === "free",
          // Category, Grade, Active, Journal are visual-only (I2/I3).
          // `deleted` is intentionally omitted (I1) — loader treats null/false as visible.
        },
      });
      const payload = data.ClassesCreateOne;
      const payloadError = (
        payload as { error?: { message?: string } | null } | null | undefined
      )?.error;
      if (payloadError?.message) throw new Error(payloadError.message);
      const recordId = payload?.recordId;
      if (!recordId) throw new Error("Server did not return recordId");

      let coverFailed = false;
      if (coverFile) {
        try {
          const fd = new FormData();
          fd.append("class", recordId);
          fd.append("file", coverFile);
          await api("/admin/class-cover", { method: "PUT", body: fd });
        } catch (uploadErr) {
          coverFailed = true;
          console.error("[class-cover] upload failed", uploadErr);
        }
      }

      if (coverFailed) {
        toast.warning("Practice created — cover upload failed.");
      } else {
        toast.success("Practice created");
      }
      onClose();
      revalidator.revalidate();
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to create practice";
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Add Practice">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Input
              label="Title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Morning Breath"
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="practice-day">
              Day
            </label>
            <input
              id="practice-day"
              type="number"
              min={1}
              step={1}
              value={day}
              onChange={(e) =>
                setDay(Math.max(1, Number(e.target.value) || 1))
              }
              className="w-full h-[44px] px-3 bg-card border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="practice-category">
              Category
            </label>
            <div className="relative">
              <select
                id="practice-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={selectClass}
              >
                {CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          <div>
            <label className={labelClass} htmlFor="practice-grade">
              Grade
            </label>
            <div className="relative">
              <select
                id="practice-grade"
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
                className={selectClass}
              >
                {GRADE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          <div>
            <label className={labelClass} htmlFor="practice-access">
              Access
            </label>
            <div className="relative">
              <select
                id="practice-access"
                value={accessLevel}
                onChange={(e) => setAccessLevel(e.target.value)}
                className={selectClass}
              >
                {ACCESS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          <div className="col-span-2">
            <label className={labelClass} htmlFor="practice-description">
              Description
            </label>
            <textarea
              id="practice-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-24 w-full rounded-lg border border-border bg-card p-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div className="col-span-2">
            <label className={labelClass}>Cover Image</label>
            {coverFile && coverPreview ? (
              <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                <img
                  src={coverPreview}
                  alt={coverFile.name}
                  className="h-16 w-16 rounded-md object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-foreground">
                    {coverFile.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(coverFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setCoverFile(null)}
                  className={cn("h-9 w-9 p-0")}
                  aria-label="Remove cover"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-stone-200 bg-stone-50/50 p-6 text-center hover:bg-stone-50">
                <span className="text-sm font-medium text-stone-700">
                  Click to upload an image
                </span>
                <span className="mt-1 text-xs text-stone-500">PNG or JPEG</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0] ?? null;
                    setCoverFile(file);
                  }}
                />
              </label>
            )}
          </div>

          <div className="col-span-2 space-y-2 rounded-md border border-amber-200 bg-amber-50/40 p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-amber-800">
                Journal
              </span>
              <Switch checked={hasJournal} onCheckedChange={setHasJournal} />
            </div>
            {hasJournal ? (
              <textarea
                value={journalPrompt}
                onChange={(e) => setJournalPrompt(e.target.value)}
                placeholder="Journal prompt"
                className="h-16 w-full rounded-md border border-amber-200 bg-card p-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-200/50"
              />
            ) : null}
          </div>

          <div className="col-span-2 flex items-center justify-between rounded-md border border-stone-200 bg-stone-50/40 px-3 py-2">
            <span className="text-sm text-stone-600">Active</span>
            <Switch checked={active} onCheckedChange={setActive} />
          </div>
        </div>

        {error ? (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : null}

        <div className="mt-2 flex justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving
              </>
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default PracticeDialog;
