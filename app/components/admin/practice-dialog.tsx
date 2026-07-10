import { useEffect, useState } from "react";
import { useRevalidator } from "react-router";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Modal } from "~/components/ui/modal";
import { SegmentedTabs } from "~/components/ui/segmented-tabs";
import { Switch } from "~/components/ui/switch";
import { api } from "~/lib/api";
import { env } from "~/lib/env";
import { toErrorMessage } from "~/lib/errors";
import { gqlClient } from "~/lib/graphql";
import { ClassesCreateOneDocument } from "~/mutations/classes";
import { cn } from "~/lib/utils";

export interface PracticeDialogProps {
  open: boolean;
  onClose: () => void;
  curriculumId: string;
  defaultOrder?: number;
}

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
  const [spanishTitle, setSpanishTitle] = useState("");
  const [spanishDescription, setSpanishDescription] = useState("");
  const [locale, setLocale] = useState<"en" | "es">("en");
  const [day, setDay] = useState<number>(defaultOrder ?? 1);

  // Visual-only fields
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
    setSpanishTitle("");
    setSpanishDescription("");
    setLocale("en");
    setDay(defaultOrder ?? 1);
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

      // Shared write helper: build `language` from the trimmed EN/ES values and
      // whether Spanish participates. Create has no prior record, so `hadSpanish`
      // is always false. English is mirrored from the top-level fields; empty
      // subfields are sent as "" (migration-fidelity shape, no label/identifier).
      const enTitle = title.trim();
      const enDescription = description.trim();
      const esTitle = spanishTitle.trim();
      const esDescription = spanishDescription.trim();
      const hasSpanish = Boolean(esTitle || esDescription);
      const hadSpanish = false; // create dialog: no prior record
      let language:
        | {
            english: { title: string; description: string };
            spanish: { title: string; description: string };
          }
        | undefined;
      if (hasSpanish || hadSpanish) {
        language = {
          english: { title: enTitle, description: enDescription },
          spanish: { title: esTitle, description: esDescription },
        };
      }

      const data = await gqlClient.request(ClassesCreateOneDocument, {
        record: {
          title: title.trim(),
          description: description.trim() || null,
          order: dayValue,
          curriculum: curriculumId,
          platform: env.PLATFORM,
          // Access is no longer a form field; new practices default to free
          // (the prior form default). Active is visual-only.
          free: true,
          // `deleted` is intentionally omitted (I1) — loader treats null/false as visible.
          ...(language ? { language } : {}),
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
      const msg = toErrorMessage(err, "Failed to create practice");
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
          <div className="col-span-2 rounded-[14px] border border-border bg-card p-4 space-y-4">
            <SegmentedTabs
              value={locale}
              onChange={setLocale}
              options={[
                { value: "en", label: "English" },
                { value: "es", label: "Spanish" },
              ]}
              ariaLabel="Content language"
            />

            {locale === "en" ? (
              <>
                <Input
                  label="Title"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Morning Breath"
                />

                <div>
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
              </>
            ) : (
              <>
                <Input
                  label="Title"
                  value={spanishTitle}
                  onChange={(e) => setSpanishTitle(e.target.value)}
                  placeholder="p. ej. Respiración matutina"
                />

                <div>
                  <label
                    className={labelClass}
                    htmlFor="practice-spanish-description"
                  >
                    Description
                  </label>
                  <textarea
                    id="practice-spanish-description"
                    value={spanishDescription}
                    onChange={(e) => setSpanishDescription(e.target.value)}
                    className="h-24 w-full rounded-lg border border-border bg-card p-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="¿De qué trata esta práctica?"
                  />
                </div>
              </>
            )}
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
