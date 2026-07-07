import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { ImagePlus } from "lucide-react";
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
import { toast } from "~/components/ui/toast";
import { api } from "~/lib/api";
import { env } from "~/lib/env";
import { toErrorMessage } from "~/lib/errors";
import { gqlClient } from "~/lib/graphql";
import { PinCreateOneDocument, PinUpdateOneDocument } from "~/mutations/pins";
import { CurriculumsFindManyDocument } from "~/queries/curriculums";
import { ClassesAdminFindManyDocument } from "~/queries/classes";
import { curriculumsSortEnum } from "~/gql/graphql";
import type { PinFindManyQuery } from "~/gql/graphql";

export type PinItem = PinFindManyQuery["PinFindMany"][number];

type SeriesOpt = { _id: string; title: string };
type ClassOpt = { _id: string; title: string; order: number };

const MAX_COVER_BYTES = 5 * 1024 * 1024;

export interface AchievementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Omit (or pass null) to create a global, unattached template pin. */
  classId?: string | null;
  curriculumId: string | null;
  onSaved: () => void;
  /** Pass an existing pin to edit it; omit (or null) to create. */
  pin?: PinItem | null;
}

export function AchievementDialog({
  open,
  onOpenChange,
  classId,
  curriculumId,
  onSaved,
  pin,
}: AchievementDialogProps) {
  const isEdit = Boolean(pin);
  // When the caller doesn't fix a class (the admin content library), let the
  // admin attach the pin via a series → practice cascade. In the practice flow
  // (AchievementBlock) `classId` is provided, so the picker stays hidden.
  const showClassPicker = classId == null;

  const [name, setName] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [series, setSeries] = useState<SeriesOpt[]>([]);
  const [seriesLoading, setSeriesLoading] = useState(false);
  const [pickedCurriculum, setPickedCurriculum] = useState("");

  const [classes, setClasses] = useState<ClassOpt[]>([]);
  const [classesLoading, setClassesLoading] = useState(false);
  const [pickedClass, setPickedClass] = useState("");

  // Reset (or prefill, in edit mode) whenever the dialog opens.
  useEffect(() => {
    if (!open) return;
    setName(pin?.label ?? "");
    setCoverFile(null);
    setSubmitting(false);
    setPickedCurriculum(pin?.curriculum ?? "");
    setPickedClass(pin?.class ?? "");
  }, [open, pin]);

  // Load the series list once the picker opens.
  useEffect(() => {
    if (!open || !showClassPicker) return;
    let cancelled = false;
    setSeriesLoading(true);
    gqlClient
      .request(CurriculumsFindManyDocument, {
        filter: { platform: env.PLATFORM },
        limit: 200,
        sort: curriculumsSortEnum.ORDER_ASC,
      })
      .then((data) => {
        if (cancelled) return;
        setSeries(
          (data.CurriculumsFindMany ?? [])
            .filter((c): c is NonNullable<typeof c> => Boolean(c))
            .map((c) => ({ _id: c._id, title: c.title ?? "Untitled series" })),
        );
      })
      .catch((err: unknown) => {
        if (!cancelled) toast.error(toErrorMessage(err, "Failed to load series"));
      })
      .finally(() => {
        if (!cancelled) setSeriesLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open, showClassPicker]);

  // Load the chosen series' practices (ordered), and drop a now-stale class pick.
  useEffect(() => {
    if (!open || !showClassPicker || !pickedCurriculum) {
      setClasses([]);
      return;
    }
    let cancelled = false;
    setClassesLoading(true);
    gqlClient
      .request(ClassesAdminFindManyDocument, {
        filter: { curriculum: pickedCurriculum, platform: env.PLATFORM },
        limit: 200,
      })
      .then((data) => {
        if (cancelled) return;
        const rows: ClassOpt[] = (data.ClassesAdminFindMany ?? [])
          .filter((c) => !c.deleted && Boolean(c._id))
          .map((c) => ({
            _id: c._id as string,
            title: c.title ?? "Untitled practice",
            order: c.order ?? 0,
          }))
          .sort((a, b) => a.order - b.order);
        setClasses(rows);
        // Keep the current pick only if it belongs to this series.
        const ids = new Set(rows.map((r) => r._id));
        setPickedClass((prev) => (ids.has(prev) ? prev : ""));
      })
      .catch((err: unknown) => {
        if (!cancelled)
          toast.error(toErrorMessage(err, "Failed to load practices"));
      })
      .finally(() => {
        if (!cancelled) setClassesLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open, showClassPicker, pickedCurriculum]);

  function handleCoverChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      e.target.value = "";
      return;
    }
    if (file.size > MAX_COVER_BYTES) {
      toast.error("Cover must be 5 MB or smaller.");
      e.target.value = "";
      return;
    }
    setCoverFile(file);
    e.target.value = "";
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    const trimmedName = name.trim();
    if (!trimmedName) return;
    // In picker mode a practice must be chosen (mirrors the disabled Save).
    if (showClassPicker && !pickedClass) return;

    // The caller's fixed class wins; otherwise use the picker's selection.
    const effectiveClass = classId ?? (pickedClass || null);
    const effectiveCurriculum = curriculumId ?? (pickedCurriculum || null);

    setSubmitting(true);
    try {
      // 1. Create the pin, or update an existing one.
      let recordId: string;
      if (pin?._id) {
        // PinUpdateOne is a filter-based UpdateMany (numAffected/error payload,
        // no recordId) — the pin's own `_id` is the record we upload the cover
        // against below. In picker mode we also persist the (re)selected
        // practice so an achievement can be moved between practices.
        const data = await gqlClient.request(PinUpdateOneDocument, {
          filter: { _id: pin._id },
          record: {
            label: trimmedName,
            ...(showClassPicker
              ? { class: effectiveClass, curriculum: effectiveCurriculum }
              : {}),
          },
        });
        const payloadError = (
          data.PinUpdateOne as
            | { error?: { message?: string } | null }
            | null
            | undefined
        )?.error;
        if (payloadError?.message) throw new Error(payloadError.message);
        recordId = pin._id;
      } else {
        const data = await gqlClient.request(PinCreateOneDocument, {
          record: {
            label: trimmedName,
            ...(effectiveClass ? { class: effectiveClass } : {}),
            ...(effectiveCurriculum ? { curriculum: effectiveCurriculum } : {}),
            platform: env.PLATFORM,
          },
        });
        const payload = data.PinCreateOne;
        // `error` is typed `never` by codegen (ErrorInterface has no concrete
        // implementors on the live schema) — cast to read the selected shape.
        const payloadError = (
          payload as { error?: { message?: string } | null } | null | undefined
        )?.error;
        if (payloadError?.message) throw new Error(payloadError.message);
        const createdId = payload?.recordId;
        if (!createdId) {
          throw new Error(
            "Achievement created but response was missing a record id.",
          );
        }
        recordId = createdId;
      }

      // 2. Upload the cover in its own try/catch — a cover failure must not
      //    roll back the saved pin.
      let coverFailed = false;
      if (coverFile) {
        try {
          const fd = new FormData();
          fd.append("file", coverFile);
          fd.append("id", recordId);
          await api("/admin/pin-cover", { method: "PUT", body: fd });
        } catch (uploadErr) {
          coverFailed = true;
          console.error("[pin-cover] upload failed", uploadErr);
        }
      }

      const savedVerb = isEdit ? "updated" : "created";
      if (coverFailed) {
        toast.warning(`Achievement ${savedVerb} — cover upload failed.`);
      } else {
        toast.success(`Achievement ${savedVerb}`);
      }
      onSaved();
      onOpenChange(false);
    } catch (err) {
      const message = toErrorMessage(
        err,
        `Failed to ${isEdit ? "update" : "create"} achievement`,
      );
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-md overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl font-normal">
            {isEdit ? "Edit Achievement" : "Add Achievement"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="achievement-name"
              className="text-sm font-medium text-muted-foreground"
            >
              Name *
            </Label>
            <Input
              id="achievement-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
              className="h-10 text-sm"
            />
          </div>

          {/* Series → practice cascade (admin content library only) */}
          {showClassPicker ? (
            <>
              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor="achievement-series"
                  className="text-sm font-medium text-muted-foreground"
                >
                  Series *
                </Label>
                <Select
                  id="achievement-series"
                  value={pickedCurriculum}
                  onChange={(e) => setPickedCurriculum(e.target.value)}
                  disabled={seriesLoading}
                  className="h-10"
                >
                  <option value="" disabled>
                    {seriesLoading ? "Loading series…" : "Select a series"}
                  </option>
                  {series.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.title}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor="achievement-class"
                  className="text-sm font-medium text-muted-foreground"
                >
                  Practice *
                </Label>
                <Select
                  id="achievement-class"
                  value={pickedClass}
                  onChange={(e) => setPickedClass(e.target.value)}
                  disabled={!pickedCurriculum || classesLoading}
                  className="h-10"
                >
                  <option value="" disabled>
                    {!pickedCurriculum
                      ? "Choose a series first"
                      : classesLoading
                        ? "Loading practices…"
                        : classes.length === 0
                          ? "No practices in this series"
                          : "Select a practice"}
                  </option>
                  {classes.map((c, i) => (
                    <option key={c._id} value={c._id}>
                      {i + 1}. {c.title}
                    </option>
                  ))}
                </Select>
              </div>
            </>
          ) : null}

          {/* Cover dropzone */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium text-muted-foreground">
              Cover
            </Label>
            <label className="flex items-center gap-3 p-3 rounded-[14px] border border-dashed border-border bg-card cursor-pointer hover:border-foreground/30 transition-colors">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                <ImagePlus
                  className="w-4 h-4 text-muted-foreground"
                  aria-hidden="true"
                />
              </span>
              <span className="text-muted-foreground text-sm truncate">
                {coverFile
                  ? coverFile.name
                  : pin?.cover?.url
                    ? "Change image"
                    : "Choose image"}
              </span>
              <input
                type="file"
                accept="image/png,image/jpeg"
                className="hidden"
                onChange={handleCoverChange}
              />
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
              className="h-10 px-4 text-sm font-medium"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={submitting}
              disabled={
                submitting || !name.trim() || (showClassPicker && !pickedClass)
              }
              className="h-10 px-4 text-sm font-medium"
            >
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AchievementDialog;
