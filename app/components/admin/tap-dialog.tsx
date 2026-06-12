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
import { toast } from "~/components/ui/toast";
import { env } from "~/lib/env";
import { gqlClient } from "~/lib/graphql";
import { TapTypeFindManyDocument } from "~/queries/taps";
import { TapCreateOneDocument, TapUpdateOneDocument } from "~/mutations/taps";
import {
  TapVideosSubform,
  serializeVideoEntries,
  videoEntriesFromTap,
} from "~/components/admin/tap-videos-subform";
import type { VideoEntry } from "~/components/admin/tap-videos-subform";
import {
  TapQuestionsSubform,
  type ExtraQuestionEntry,
} from "~/components/admin/tap-questions-subform";
import type { TapFindManyQuery, TapTypeFindManyQuery } from "~/gql/graphql";

export type TapItem = TapFindManyQuery["TapFindMany"][number];
type TapTypeItem = TapTypeFindManyQuery["TapTypeFindMany"][number];

export interface TapDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classId: string;
  defaultOrder: number;
  /** null/absent = create mode; a tap = edit mode. */
  tap?: TapItem | null;
  onSaved: () => void;
}

type FormState = {
  title: string;
  order: number;
  type: string;
  points: string;
  time: string;
  intro: string;
  description: string;
  slug: string;
};

function formFromTap(
  tap: TapItem | null | undefined,
  defaultOrder: number,
): FormState {
  return {
    title: tap?.title ?? "",
    order: Math.max(1, Math.round(tap?.order ?? defaultOrder)),
    type: tap?.type ?? "",
    points: tap?.points != null ? String(tap.points) : "",
    time: tap?.time != null ? String(tap.time) : "5",
    intro: tap?.intro ?? "",
    description: tap?.description ?? "",
    slug: tap?.slug ?? "",
  };
}

function parseOptionalNumber(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}

// Prefill from the query shape: drop __typename / null wrappers and keep
// only entries with a question record id. The display cache is resolved by
// the subform itself, so it is intentionally omitted here.
function extraQuestionsFromTap(
  tap: TapItem | null | undefined,
): ExtraQuestionEntry[] {
  return (tap?.extraQuestions ?? []).flatMap((q) =>
    q?.question ? [{ question: q.question, points: q.points ?? null }] : [],
  );
}

export function TapDialog({
  open,
  onOpenChange,
  classId,
  defaultOrder,
  tap,
  onSaved,
}: TapDialogProps) {
  const isEdit = Boolean(tap?._id);
  const [form, setForm] = useState<FormState>(() =>
    formFromTap(tap, defaultOrder),
  );
  const [videos, setVideos] = useState<VideoEntry[]>(() =>
    videoEntriesFromTap(tap?.videos),
  );
  const [extraQuestions, setExtraQuestions] = useState<ExtraQuestionEntry[]>(
    () => extraQuestionsFromTap(tap),
  );
  const [tapTypes, setTapTypes] = useState<TapTypeItem[]>([]);
  const [typesLoading, setTypesLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Prefill (edit) / reset (create) whenever the dialog opens.
  useEffect(() => {
    if (!open) return;
    setForm(formFromTap(tap, defaultOrder));
    setVideos(videoEntriesFromTap(tap?.videos));
    setExtraQuestions(extraQuestionsFromTap(tap));
    setError(null);
    setSubmitting(false);
  }, [open, tap, defaultOrder]);

  // Fetch tap types on open. On failure or an empty result the type field
  // degrades to a free-text input so the form never dead-ends.
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setTypesLoading(true);
    gqlClient
      .request(TapTypeFindManyDocument, { limit: 100 })
      .then((data) => {
        if (cancelled) return;
        setTapTypes(data.TapTypeFindMany ?? []);
      })
      .catch(() => {
        if (cancelled) return;
        setTapTypes([]);
      })
      .finally(() => {
        if (!cancelled) setTypesLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open]);

  const typeOptions = tapTypes.map((tt) => ({
    value: tt.identifier ?? tt._id,
    label: tt.label ?? tt.identifier ?? tt._id,
  }));
  const showTypeSelect = typesLoading || typeOptions.length > 0;
  // Edit mode: keep an unknown stored type selectable so saving never
  // silently clears it.
  const typeValueUnknown =
    form.type !== "" && !typeOptions.some((opt) => opt.value === form.type);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    const trimmedTitle = form.title.trim();
    if (!trimmedTitle) return;

    setSubmitting(true);
    setError(null);
    try {
      const scalars = {
        title: trimmedTitle,
        order: Math.max(1, Math.round(form.order || 1)),
        type: form.type.trim() || null,
        points: parseOptionalNumber(form.points),
        time: parseOptionalNumber(form.time), // minutes (plain number)
        intro: form.intro.trim() || null,
        description: form.description.trim() || null,
        slug: form.slug.trim() || null,
      };

      // extraQuestions is replaced wholesale on every save: send the full
      // list in tapExtraQuestionsInput shape ({ question, points } only),
      // dropping the subform's client-only display cache.
      const extraQuestionsRecord = extraQuestions.map((q) => ({
        question: q.question,
        points: q.points,
      }));

      // Subdocument arrays are replaced wholesale on update — re-send the
      // full videos list including server-assigned `_id`s. REST-owned
      // `thumbnail` / `captions[].file` are never written from the form.
      const videosRecord = serializeVideoEntries(videos);

      if (isEdit && tap?._id) {
        const data = await gqlClient.request(TapUpdateOneDocument, {
          _id: tap._id,
          record: {
            ...scalars,
            videos: videosRecord,
            extraQuestions: extraQuestionsRecord,
          },
        });
        const payload = data.TapUpdateOne;
        const payloadError = (
          payload as { error?: { message?: string } | null } | null | undefined
        )?.error;
        if (payloadError?.message) throw new Error(payloadError.message);
        toast.success("Content updated");
      } else {
        // `class` (parent practice) and `platform` are auto-assigned on
        // create — never rendered as form fields.
        const data = await gqlClient.request(TapCreateOneDocument, {
          record: {
            class: classId,
            platform: env.PLATFORM,
            ...scalars,
            videos: videosRecord,
            extraQuestions: extraQuestionsRecord,
          },
        });
        const payload = data.TapCreateOne;
        const payloadError = (
          payload as { error?: { message?: string } | null } | null | undefined
        )?.error;
        if (payloadError?.message) throw new Error(payloadError.message);
        toast.success("Content created");
      }
      onSaved();
      onOpenChange(false);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : isEdit
            ? "Failed to update content"
            : "Failed to create content";
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl font-normal">
            {isEdit ? "Edit Content" : "Add Content"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="tap-title"
              className="text-sm font-medium text-muted-foreground"
            >
              Title *
            </Label>
            <Input
              id="tap-title"
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
              required
              autoFocus
              className="h-10 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="tap-order"
                className="text-sm font-medium text-muted-foreground"
              >
                Order
              </Label>
              <Input
                id="tap-order"
                type="number"
                min={1}
                step={1}
                value={form.order}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    order: Math.max(1, Math.round(Number(e.target.value) || 1)),
                  }))
                }
                className="h-10 text-sm"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="tap-type"
                className="text-sm font-medium text-muted-foreground"
              >
                Type
              </Label>
              {showTypeSelect ? (
                <Select
                  id="tap-type"
                  value={form.type}
                  disabled={typesLoading}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, type: e.target.value }))
                  }
                  className="h-10 text-sm"
                >
                  <option value="">
                    {typesLoading ? "Loading types…" : "Select type…"}
                  </option>
                  {typeValueUnknown ? (
                    <option value={form.type}>{form.type}</option>
                  ) : null}
                  {typeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </Select>
              ) : (
                <>
                  <Input
                    id="tap-type"
                    value={form.type}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, type: e.target.value }))
                    }
                    placeholder="e.g. video"
                    className="h-10 text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    No content types available — enter a type identifier.
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="tap-slug"
              className="text-sm font-medium text-muted-foreground"
            >
              Slug
            </Label>
            <Input
              id="tap-slug"
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              placeholder="my-content-slug"
              className="h-10 text-sm"
            />
          </div>

          <TapVideosSubform
            value={videos}
            onChange={setVideos}
            tapId={tap?._id ?? null}
          />

          <TapQuestionsSubform
            value={extraQuestions}
            onChange={setExtraQuestions}
          />

          {error ? (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          ) : null}

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
              disabled={submitting || !form.title.trim()}
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
