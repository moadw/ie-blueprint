import { useEffect, useState } from "react";
import { useRevalidator } from "react-router";
import { ChevronDown, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Modal } from "~/components/ui/modal";
import { api } from "~/lib/api";
import { activeHiddenFromStatus, statusFromActiveHidden } from "~/lib/curriculum";
import type { CurriculumStatus } from "~/lib/curriculum";
import { gqlClient } from "~/lib/graphql";
import {
  CurriculumsCreateOneDocument,
  CurriculumsUpdateOneDocument,
} from "~/mutations/curriculums";
import { cn } from "~/lib/utils";

export interface SeriesDialogCurriculum {
  _id: string;
  title?: string | null;
  slug?: string | null;
  description?: string | null;
  category?: string | null;
  grade?: string | null;
  order?: number | null;
  active?: boolean | null;
  hidden?: boolean | null;
  cover?: { url?: string | null } | null;
  bgImage?: { url?: string | null } | null;
}

export interface SeriesDialogProps {
  open: boolean;
  onClose: () => void;
  curriculum?: SeriesDialogCurriculum | null;
}

const CATEGORY_OPTIONS = ["core", "bonus", "seasonal"] as const;
const GRADE_OPTIONS = [
  { value: "all_levels", label: "All Levels" },
  { value: "early_learning", label: "Early Learning" },
  { value: "elementary", label: "Elementary" },
  { value: "middle_school", label: "Middle School" },
  { value: "high_school", label: "High School" },
] as const;

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const selectClass =
  "w-full h-[52px] px-4 pr-10 bg-card border border-border rounded-lg text-[15px] text-foreground placeholder:text-muted-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary/30";
const labelClass = "block text-[14px] text-foreground mb-2 font-medium";

export function SeriesDialog({ open, onClose, curriculum }: SeriesDialogProps) {
  const revalidator = useRevalidator();
  const isEdit = Boolean(curriculum);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>("core");
  const [grade, setGrade] = useState<string>("all_levels");
  const [status, setStatus] = useState<CurriculumStatus>("live");
  const [order, setOrder] = useState<number>(0);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [bgFile, setBgFile] = useState<File | null>(null);
  const [bgPreview, setBgPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-derive slug from title until user manually edits it.
  useEffect(() => {
    if (!slugTouched) {
      setSlug(slugify(title));
    }
  }, [title, slugTouched]);

  // Revoke object URLs on replace/unmount.
  useEffect(() => {
    if (!coverFile) {
      setCoverPreview(null);
      return;
    }
    const url = URL.createObjectURL(coverFile);
    setCoverPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [coverFile]);

  useEffect(() => {
    if (!bgFile) {
      setBgPreview(null);
      return;
    }
    const url = URL.createObjectURL(bgFile);
    setBgPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [bgFile]);

  // Prefill from curriculum on open / record change.
  useEffect(() => {
    if (!open) return;
    if (curriculum) {
      setTitle(curriculum.title ?? "");
      setSlug(curriculum.slug ?? "");
      setSlugTouched(true);
      setDescription(curriculum.description ?? "");
      setCategory(curriculum.category ?? "core");
      setGrade(curriculum.grade ?? "all_levels");
      setStatus(statusFromActiveHidden(curriculum));
      setOrder(curriculum.order ?? 0);
      setCoverFile(null);
      setBgFile(null);
      setError(null);
    }
  }, [open, curriculum]);

  // Reset form when dialog closes.
  useEffect(() => {
    if (open) return;
    setTitle("");
    setSlug("");
    setSlugTouched(false);
    setDescription("");
    setCategory("core");
    setGrade("all_levels");
    setStatus("live");
    setOrder(0);
    setCoverFile(null);
    setBgFile(null);
    setError(null);
    setSubmitting(false);
  }, [open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const { active, hidden } = activeHiddenFromStatus(status);
      const record = {
        title: title.trim(),
        slug: slug.trim() || null,
        description: description.trim() || null,
        category,
        grade,
        active,
        hidden,
        order,
      };

      let recordId: string | null | undefined;

      if (isEdit && curriculum) {
        const data = await gqlClient.request(CurriculumsUpdateOneDocument, {
          _id: curriculum._id,
          record,
        });
        const payload = data.CurriculumsUpdateOne;
        const payloadError = (payload as { error?: { message?: string } | null } | null | undefined)?.error;
        if (payloadError?.message) throw new Error(payloadError.message);
        recordId = payload?.recordId ?? curriculum._id;
      } else {
        const data = await gqlClient.request(CurriculumsCreateOneDocument, {
          record,
        });
        const payload = data.CurriculumsCreateOne;
        const payloadError = (payload as { error?: { message?: string } | null } | null | undefined)?.error;
        if (payloadError?.message) throw new Error(payloadError.message);
        recordId = payload?.recordId;
        if (!recordId) throw new Error("Server did not return recordId");
      }

      let coverFailed = false;
      if (coverFile && recordId) {
        try {
          const fd = new FormData();
          fd.append("id", recordId);
          fd.append("file", coverFile);
          await api("/admin/curriculum-cover", {
            method: "PUT",
            body: fd,
          });
        } catch (uploadErr) {
          coverFailed = true;
          console.error("[curriculum-cover] upload failed", uploadErr);
        }
      }

      let bgFailed = false;
      if (bgFile && recordId) {
        try {
          const fd = new FormData();
          fd.append("_id", recordId); // underscore — not "id"
          fd.append("file", bgFile);
          await api("/admin/curriculum-bg", {
            method: "PUT",
            body: fd,
          });
        } catch (uploadErr) {
          bgFailed = true;
          console.error("[curriculum-bg] upload failed", uploadErr);
        }
      }

      if (coverFailed && bgFailed) {
        toast.warning("Series saved — image uploads failed.");
      } else if (coverFailed) {
        toast.warning("Series saved — cover upload failed.");
      } else if (bgFailed) {
        toast.warning("Series saved — background upload failed.");
      } else {
        toast.success(isEdit ? "Series updated" : "Series created");
      }
      onClose();
      revalidator.revalidate();
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : isEdit
            ? "Failed to update series"
            : "Failed to create series";
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? "Edit Series" : "New Series"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Mindful Mornings"
        />

        <Input
          label="Slug"
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(e.target.value);
          }}
          placeholder="auto-derived-from-title"
        />

        <div>
          <label className={labelClass} htmlFor="series-description">
            Description
          </label>
          <textarea
            id="series-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full bg-card border border-border rounded-lg p-3 text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            placeholder="What is this series about?"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="series-category">
              Category
            </label>
            <div className="relative">
              <select
                id="series-category"
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
            <label className={labelClass} htmlFor="series-grade">
              Grade Level
            </label>
            <div className="relative">
              <select
                id="series-grade"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
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
            <label className={labelClass} htmlFor="series-status">
              Status
            </label>
            <div className="relative">
              <select
                id="series-status"
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as CurriculumStatus)
                }
                className={selectClass}
              >
                <option value="live">Live</option>
                <option value="draft">Draft</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          <div>
            <label className={labelClass} htmlFor="series-order">
              Order
            </label>
            <input
              id="series-order"
              type="number"
              min={0}
              step={1}
              value={order}
              onChange={(e) => setOrder(Number(e.target.value) || 0)}
              className="w-full h-[52px] px-4 bg-card border border-border rounded-lg text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Cover Image</label>
          {coverFile && coverPreview ? (
            <div className="flex items-center gap-3 rounded-lg border border-border p-3">
              <img
                src={coverPreview}
                alt={coverFile.name}
                className="h-20 w-20 rounded-md object-cover"
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
              {isEdit && curriculum?.cover?.url ? (
                <span className="text-xs text-stone-500 mb-2">
                  Current cover will be kept unless you upload a new one
                </span>
              ) : null}
              <span className="text-sm font-medium text-stone-700">
                Click to upload an image
              </span>
              <span className="mt-1 text-xs text-stone-500">
                PNG or JPEG
              </span>
              <input
                type="file"
                accept="image/png,image/jpeg"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  setCoverFile(file);
                }}
              />
            </label>
          )}
        </div>

        <div>
          <label className={labelClass}>Background Image</label>
          {bgFile && bgPreview ? (
            <div className="flex items-center gap-3 rounded-lg border border-border p-3">
              <img
                src={bgPreview}
                alt={bgFile.name}
                className="h-20 w-20 rounded-md object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-foreground">
                  {bgFile.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {(bgFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <Button
                variant="ghost"
                onClick={() => setBgFile(null)}
                className={cn("h-9 w-9 p-0")}
                aria-label="Remove background"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-stone-200 bg-stone-50/50 p-6 text-center hover:bg-stone-50">
              {isEdit && curriculum?.bgImage?.url ? (
                <span className="text-xs text-stone-500 mb-2">
                  Current background will be kept unless you upload a new one
                </span>
              ) : null}
              <span className="text-sm font-medium text-stone-700">
                Click to upload an image
              </span>
              <span className="mt-1 text-xs text-stone-500">
                PNG or JPEG
              </span>
              <input
                type="file"
                accept="image/png,image/jpeg"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  if (file && file.size > 5 * 1024 * 1024) {
                    toast.error("Background must be 5 MB or smaller.");
                    e.target.value = "";
                    return;
                  }
                  setBgFile(file);
                  e.target.value = "";
                }}
              />
            </label>
          )}
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

export default SeriesDialog;
