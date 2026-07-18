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
import { payloadErrorMessage, toErrorMessage } from "~/lib/errors";
import { gqlClient } from "~/lib/graphql";
import { TapFindManyDocument, TapTypeFindManyDocument } from "~/queries/taps";
import { TapCreateOneDocument, TapUpdateOneDocument } from "~/mutations/taps";
import { QuestionsFindManyDocument } from "~/queries/questions";
import {
  QuestionsCreateOneDocument,
  QuestionsUpdateOneDocument,
} from "~/mutations/questions";
import {
  TapVideosSubform,
  serializeVideoEntries,
  videoEntriesFromTap,
} from "~/components/admin/tap-videos-subform";
import type { VideoEntry } from "~/components/admin/tap-videos-subform";
import { extractDurationMinutes } from "~/components/admin/media-duration";
import {
  TapQuestionsSubform,
  type ExtraQuestionEntry,
} from "~/components/admin/tap-questions-subform";
import {
  TapSliderCreateSubform,
  type SliderFileItem,
} from "~/components/admin/tap-slider-create-subform";
import { TapSliderEditSubform } from "~/components/admin/tap-slider-edit-subform";
import { runSliderCreate } from "~/components/admin/slider-create";
import type { TapFindManyQuery, TapTypeFindManyQuery } from "~/gql/graphql";

export type TapItem = TapFindManyQuery["TapFindMany"][number];
type TapTypeItem = TapTypeFindManyQuery["TapTypeFindMany"][number];

/** Which subform a configured type renders. */
type TapSubform = "journal" | "video" | "slider";

/**
 * Per-type config keyed by the canonical type slug (mirrors the teacher-flow
 * slugs in `practice-steps.ts`). `title` is the label the admin sees / that is
 * normalized onto the tap (type is locked, so no custom titles). `subform`
 * picks which editor to render in edit mode. An unconfigured ("5th") type
 * resolves to `null` → empty form, Save disabled.
 */
// Keyed by the backend `TapType.identifier` (NOT the teacher-flow slugs in
// practice-steps.ts). Source of truth: `main.taptype` — ie-journal, video,
// full-audio, 5min-audio, slider. Titles mirror each type's `label`.
const KNOWN_TYPES: Record<string, { title: string; subform: TapSubform }> = {
  "ie-journal": { title: "Journal", subform: "journal" },
  video: { title: "Video", subform: "video" },
  "full-audio": { title: "Full Audio", subform: "video" },
  "5min-audio": { title: "5-min Audio", subform: "video" },
  slider: { title: "Slider", subform: "slider" },
};

// tap.language is an open string scalar. These values MUST match what the
// migration writes (`migration/taps.mjs` -> `language: row.lang`, "en" | "es")
// so admin-edited taps stay consistent with migrated data. Empty = unset.
const LANGUAGE_OPTIONS = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
] as const;

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
  language: string;
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
    language: tap?.language ?? "",
    points: tap?.points != null ? String(tap.points) : "",
    time: tap?.time != null ? String(tap.time) : "5",
    intro: tap?.intro ?? "",
    description: tap?.description ?? "",
    slug: tap?.slug ?? "",
  };
}

/**
 * Build a resolver Map from a `TapTypeFindMany` result that maps a raw
 * `tap.type` value (the selected `form.type`, which is `identifier ?? _id`) to
 * its canonical identifier slug. Mirrors `buildTapTypeResolver` in
 * `practice-steps.ts`: matches on BOTH `tt.identifier` and `tt._id` so a stored
 * `_id` resolves to its slug. Entries with no `identifier` are skipped.
 */
function buildTapTypeResolver(tapTypes: readonly TapTypeItem[]): Map<string, string> {
  const map = new Map<string, string>();
  for (const tt of tapTypes) {
    if (!tt.identifier) continue;
    map.set(tt.identifier, tt.identifier);
    if (tt._id) map.set(tt._id, tt.identifier);
  }
  return map;
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

/**
 * Coerce the form's `time` string (whole minutes, kept in sync with the media
 * file's real duration by the extraction effect) to the numeric minutes the
 * mutation expects. Falls back to `5` for a missing/invalid value.
 */
function parseTimeMinutes(value: string): number {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : 5;
}

export function TapDialog({
  open,
  onOpenChange,
  classId,
  defaultOrder,
  tap,
  onSaved,
}: TapDialogProps) {
  // The just-created tap, tracked internally so create → auto-edit stays inside
  // this component (the content list behind the dialog is untouched). Reset on
  // every open.
  const [createdTap, setCreatedTap] = useState<TapItem | null>(null);
  // In edit mode the effective tap is the prop (existing) or the one we just
  // created. `isEdit` drives field visibility + the type lock.
  const effectiveTap = tap ?? createdTap;
  const isEdit = Boolean(effectiveTap?._id);

  const [form, setForm] = useState<FormState>(() =>
    formFromTap(effectiveTap, defaultOrder),
  );
  const [videos, setVideos] = useState<VideoEntry[]>(() =>
    videoEntriesFromTap(effectiveTap?.videos),
  );
  const [extraQuestions, setExtraQuestions] = useState<ExtraQuestionEntry[]>(
    () => extraQuestionsFromTap(effectiveTap),
  );
  const [tapTypes, setTapTypes] = useState<TapTypeItem[]>([]);
  const [typesLoading, setTypesLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Journal taps own a single question whose text lives on a separate
  // questions-collection record. We hold the editable text here and resolve /
  // persist it by id (see the resolution effect + handleSubmit). `extraQuestions`
  // above still carries the id + points reference that the tap is saved with.
  const [journalText, setJournalText] = useState("");
  const [journalResolving, setJournalResolving] = useState(false);
  // Slider create mode holds the pending dropped files here (owned by the
  // dialog, edited via the slider create subform). Phase 3 wires the multi-tap
  // Save; Phase 2 only enables Save when at least one file is selected.
  const [sliderFiles, setSliderFiles] = useState<SliderFileItem[]>([]);
  // Mirrors the slider edit subform's in-flight upload state (which the dialog
  // can't otherwise see) so Save/Cancel are disabled while a replace-video
  // upload runs — clicking Save mid-upload would wholesale-replace `videos`
  // with the stale entry and drop the just-uploaded video.
  const [sliderEditUploading, setSliderEditUploading] = useState(false);

  // Prefill (edit) / reset (create) on open transitions and when the target
  // `tap` changes. `defaultOrder` is intentionally NOT a dependency: it is
  // derived from the parent list length (`taps.length + 1`), so the
  // post-create `onSaved()` refetch bumps it. If it were a dep, this effect
  // would re-run mid create→edit transition, `setCreatedTap(null)` would wipe
  // the freshly-created tap, and the dialog would bounce back to create mode
  // (spawning a new empty tap on every Save). Order is hidden and read live
  // from the prop in handleSubmit, so a stale `defaultOrder` here is harmless.
  useEffect(() => {
    if (!open) return;
    setCreatedTap(null);
    setForm(formFromTap(tap, defaultOrder));
    setVideos(videoEntriesFromTap(tap?.videos));
    setExtraQuestions(extraQuestionsFromTap(tap));
    setJournalText("");
    setSliderFiles([]);
    setSliderEditUploading(false);
    setError(null);
    setSubmitting(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, tap]);

  // Re-seed form/videos/questions once we hold a freshly-created tap, so the
  // dialog flips into edit mode showing the new tap's (empty) subform state.
  // Keyed on `createdTap` only — a created tap always carries its own `order`,
  // so `defaultOrder` is unused here (and would just cause redundant re-seeds).
  useEffect(() => {
    if (!createdTap) return;
    setForm(formFromTap(createdTap, defaultOrder));
    setVideos(videoEntriesFromTap(createdTap.videos));
    setExtraQuestions(extraQuestionsFromTap(createdTap));
    setJournalText("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createdTap]);

  // Fetch tap types on open. On failure or an empty result the type field
  // degrades to a free-text input so the form never dead-ends.
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setTypesLoading(true);
    gqlClient
      .request(TapTypeFindManyDocument, {
        filter: { platform: env.PLATFORM },
        limit: 100,
      })
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
  // Keep an unknown stored/selected type selectable so it never silently clears.
  const typeValueUnknown =
    form.type !== "" && !typeOptions.some((opt) => opt.value === form.type);
  // Same guard for language: a legacy/unexpected stored value (not en/es) stays
  // selectable so re-saving an untouched tap never wipes it.
  const languageValueUnknown =
    form.language !== "" &&
    !LANGUAGE_OPTIONS.some((opt) => opt.value === form.language);

  // Resolve the selected type to its canonical slug, then look up its config.
  // A null config = an unconfigured ("5th") type: no subform, Save disabled.
  const resolver = buildTapTypeResolver(tapTypes);
  const resolvedSlug = resolver.get(form.type) ?? form.type;
  const config = KNOWN_TYPES[resolvedSlug] ?? null;
  const hasType = form.type.trim().length > 0;
  // Slider + create mode swaps the normal (type-select-only) create body for a
  // multi-file dropzone. Edit mode is handled separately (Phase 4).
  const isSliderCreate = config?.subform === "slider" && !isEdit;

  // Changing the selected type discards any pending slider files: they belong
  // to the previous selection, and the slider subform revokes their object URLs
  // on unmount, so clearing here avoids showing stale (revoked) previews if the
  // admin toggles back to Slider.
  function handleTypeChange(nextType: string) {
    setForm((f) => ({ ...f, type: nextType }));
    setSliderFiles([]);
  }

  // The single journal question's reference (id + points) and its record id.
  const journalEntry =
    config?.subform === "journal" ? extraQuestions[0] : undefined;
  const journalQuestionId = journalEntry?.question ?? null;

  // Resolve the journal question's text by EXACT id. (A `filter: {}` scan has
  // no limit arg and may omit a freshly-created record — the cause of the
  // "Question text unavailable" bug.) A cached `label` (e.g. just saved) is
  // used directly with no fetch, so user edits are never clobbered.
  useEffect(() => {
    if (!open || !journalQuestionId) return;
    if (journalEntry?.label != null) {
      setJournalText(journalEntry.label);
      return;
    }
    let cancelled = false;
    setJournalResolving(true);
    gqlClient
      .request(QuestionsFindManyDocument, {
        filter: { _id: journalQuestionId },
      })
      .then((data) => {
        if (cancelled) return;
        setJournalText(data.QuestionsFindMany?.[0]?.label ?? "");
      })
      .catch(() => {
        /* leave the textarea empty; the admin can retype */
      })
      .finally(() => {
        if (!cancelled) setJournalResolving(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, journalQuestionId]);

  // The tap's single media file (max 1 entry). `time` is DERIVED from this
  // file's real duration, never typed — so there is no visible minutes input.
  const currentMediaUrl = videos[0]?.url?.trim() ?? "";

  // Derive `time` (whole minutes) from the media file. Runs on open and
  // whenever the media url changes (paste or upload). Failure (`null`) leaves
  // the current value untouched — never overwrites a good `time` with garbage.
  // No media url → nothing to derive; `time` keeps its default (`5` on create).
  useEffect(() => {
    if (!open || !currentMediaUrl) return;
    let cancelled = false;
    extractDurationMinutes(currentMediaUrl).then((minutes) => {
      if (cancelled || minutes == null) return;
      setForm((f) => ({ ...f, time: String(minutes) }));
    });
    return () => {
      cancelled = true;
    };
  }, [open, currentMediaUrl]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    // Save is only meaningful for a configured type.
    if (!config) return;
    // Slider create is a dedicated multi-tap Save: one `slider` tap per selected
    // file, created via a bounded promise pool (best-effort per file). It does
    // NOT reuse the single-tap create→auto-edit flip — on completion it toasts a
    // per-file summary, refetches the list, and closes.
    if (isSliderCreate) {
      if (sliderFiles.length === 0) return;
      setSubmitting(true);
      setError(null);
      try {
        const results = await runSliderCreate(sliderFiles, {
          classId,
          platform: env.PLATFORM,
          // `form.type` is the selected option value; in this branch it resolves
          // to the `slider` identifier (mirrors the single-tap create's `type`).
          type: form.type,
          defaultOrder,
        });
        const failed = results.filter((r) => !r.ok);
        const added = results.filter((r) => r.ok).length;
        if (failed.length === 0) {
          toast.success(`${added} ${added === 1 ? "slide" : "slides"} added`);
        } else {
          // Image placeholders count as successes (the tap was created); only
          // create/upload failures land here, named for the admin to retry.
          const names = failed.map((r) => r.file.name || "untitled").join(", ");
          const prefix = added > 0 ? `${added} added · ` : "";
          toast.error(`${prefix}${failed.length} failed: ${names}`);
        }
        // Only refresh + close when at least one slide was created. On a TOTAL
        // failure keep the dialog open with `sliderFiles` intact so the admin
        // can retry (mirrors the single-tap create path, which stays open on
        // error). The summary toast above still fires in every case.
        if (added > 0) {
          onSaved();
          onOpenChange(false);
        }
      } catch (err) {
        // runSliderCreate is best-effort per file and shouldn't reject; guard so
        // an unexpected throw surfaces instead of leaving Save spinning.
        const message = toErrorMessage(err, "Failed to create slides");
        setError(message);
        toast.error(message);
      } finally {
        setSubmitting(false);
      }
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      // Subdocument arrays are replaced wholesale on update — re-send the
      // full videos list including server-assigned `_id`s. REST-owned
      // `thumbnail` / `captions[].file` are never written from the form.
      const videosRecord = serializeVideoEntries(videos);

      // Persist the DERIVED duration (floored minutes) when the tap has a media
      // file; taps with no media default to `5`. Opening + saving a legacy tap
      // with a media url thus corrects a stale/mis-unit `time` — the intended
      // manual remediation path (no read-side normalization / backfill).
      const timeMinutes = currentMediaUrl ? parseTimeMinutes(form.time) : 5;

      if (isEdit && effectiveTap?._id) {
        // Default: round-trip whatever the tap already had so non-journal
        // (video) taps never silently drop existing entries.
        let extraQuestionsRecord: { question: string; points: number | null }[] =
          extraQuestions.map((q) => ({ question: q.question, points: q.points }));
        let nextExtraQuestions: ExtraQuestionEntry[] = extraQuestions;
        // A journal tap owns exactly one question, stored on a separate
        // questions-collection record. Persist its text here — create when new,
        // update when changed — then reference it by id in the tap's
        // extraQuestions.
        if (config.subform === "journal") {
          const text = journalText.trim();
          const existing = extraQuestions[0];
          if (text) {
            let questionId = existing?.question ?? null;
            if (questionId) {
              if (text !== existing?.label) {
                const qd = await gqlClient.request(QuestionsUpdateOneDocument, {
                  _id: questionId,
                  record: { label: text },
                });
                const m = payloadErrorMessage(qd.QuestionsUpdateOne);
                if (m) throw new Error(m);
              }
            } else {
              const qd = await gqlClient.request(QuestionsCreateOneDocument, {
                record: { label: text, platform: env.PLATFORM },
              });
              const m = payloadErrorMessage(qd.QuestionsCreateOne);
              if (m) throw new Error(m);
              questionId =
                qd.QuestionsCreateOne?.recordId ??
                qd.QuestionsCreateOne?.record?._id ??
                null;
              if (!questionId)
                throw new Error("Question record was not created");
            }
            // Points UI is hidden — preserve the entry's stored points.
            const points = existing?.points ?? null;
            extraQuestionsRecord = [{ question: questionId, points }];
            nextExtraQuestions = [{ question: questionId, points, label: text }];
          } else {
            // Journal question cleared — drop the entry.
            extraQuestionsRecord = [];
            nextExtraQuestions = [];
          }
        }

        // Send the fields this streamlined flow owns PLUS the recalculated
        // `time` (so re-saving corrects a legacy tap's duration); omit
        // order/slug/points/intro/description so those hidden scalars
        // round-trip (omitted, never nulled — `slug:null` would also hit the
        // E11000 sparse-unique collision). `time` is a plain Float, so sending
        // it carries no slug-style self-collision risk.
        const data = await gqlClient.request(TapUpdateOneDocument, {
          _id: effectiveTap._id,
          record: {
            title: config.title,
            time: timeMinutes,
            // Open string scalar; empty select => null (clear). Safe to null
            // (unlike slug, language has no sparse-unique index / E11000 risk).
            language: form.language || null,
            videos: videosRecord,
            extraQuestions: extraQuestionsRecord,
          },
        });
        const updateError = payloadErrorMessage(data.TapUpdateOne);
        if (updateError) throw new Error(updateError);
        // Reflect the persisted question id locally so a subsequent Save
        // UPDATES the same record instead of creating a duplicate, and so the
        // resolution effect reuses the cached label instead of refetching.
        if (config.subform === "journal") setExtraQuestions(nextExtraQuestions);
        toast.success("Content updated");
        onSaved();
        // Journal is a single-question form — save-and-close returns the admin
        // to the content list. Media taps stay open (the user keeps adding
        // videos/captions and closes via Cancel/X).
        if (config.subform === "journal") onOpenChange(false);
      } else {
        // Create with auto-assigned values from the config. `class` (parent
        // practice) and `platform` are auto-assigned; `slug` is omitted (the
        // backend auto-generates a unique one — an explicit null collides on
        // the sparse-unique index, E11000).
        const data = await gqlClient.request(TapCreateOneDocument, {
          record: {
            class: classId,
            platform: env.PLATFORM,
            type: form.type,
            title: config.title,
            order: Math.max(1, Math.round(defaultOrder)),
            points: 100,
            time: timeMinutes,
            videos: [],
            extraQuestions: [],
          },
        });
        const payload = data.TapCreateOne;
        const createError = payloadErrorMessage(payload);
        if (createError) throw new Error(createError);
        const recordId = payload?.recordId ?? payload?.record?._id;
        if (!recordId) throw new Error("Content record was not created");

        // Refetch the full tap so the dialog can switch into edit mode with the
        // server-assigned `_id` (needed for video uploads) and canonical fields.
        const fresh = await gqlClient.request(TapFindManyDocument, {
          filter: { _id: recordId },
          limit: 1,
        });
        const freshTap = fresh.TapFindMany?.[0] ?? null;
        toast.success("Content created");
        // Refresh the list behind the dialog, then flip to edit mode — do NOT
        // close (the admin fills in the subform next).
        onSaved();
        if (freshTap) {
          setCreatedTap(freshTap);
        } else {
          // Refetch returned nothing (rare race) — close so the list reflects
          // the new tap; the admin can reopen it to edit.
          onOpenChange(false);
        }
      }
    } catch (err) {
      const message = toErrorMessage(
        err,
        isEdit ? "Failed to update content" : "Failed to create content",
      );
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
          {/* Type is the first and only field on create; locked after create
              (the type can't change once a tap exists). */}
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="tap-type"
              className="text-sm font-medium text-muted-foreground"
            >
              Type *
            </Label>
            {showTypeSelect ? (
              <Select
                id="tap-type"
                value={form.type}
                disabled={typesLoading || isEdit}
                onChange={(e) => handleTypeChange(e.target.value)}
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
                  disabled={isEdit}
                  onChange={(e) => handleTypeChange(e.target.value)}
                  placeholder="e.g. video"
                  className="h-10 text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  No content types available — enter a type identifier.
                </p>
              </>
            )}
            {isEdit ? (
              <p className="text-xs text-muted-foreground">
                Type can't be changed after creation.
              </p>
            ) : hasType && !config ? (
              <p className="text-xs text-muted-foreground">
                This content type isn't configured yet.
              </p>
            ) : null}
          </div>

          {/* Slider + create mode swaps the (otherwise type-select-only) create
              body for the multi-file dropzone. Other configured types show
              their subform only in edit mode. */}
          {isSliderCreate ? (
            <TapSliderCreateSubform
              value={sliderFiles}
              onChange={setSliderFiles}
            />
          ) : isEdit && config ? (
            config.subform === "journal" ? (
              <TapQuestionsSubform
                value={journalText}
                onChange={setJournalText}
                loading={journalResolving}
              />
            ) : config.subform === "slider" ? (
              // Media-only edit: shows only the field matching the tap's stored
              // media (replace-video, or a gated cover). The outer Save persists
              // `videos` via TapUpdateOne (wholesale replace, `_id` echoed).
              <TapSliderEditSubform
                tapId={effectiveTap?._id ?? null}
                videos={videos}
                onVideosChange={setVideos}
                cover={effectiveTap?.cover ?? null}
                onUploadingChange={setSliderEditUploading}
              />
            ) : (
              <TapVideosSubform
                value={videos}
                onChange={setVideos}
                maxEntries={1}
                tapId={effectiveTap?._id ?? null}
                tapType={form.type.trim()}
              />
            )
          ) : null}

          {/* Language is a per-tap open string; its values mirror the migration
              ("en" | "es", empty = unset). Last field, edit-only like the other
              per-tap fields (create is deliberately type-only). */}
          {isEdit ? (
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="tap-language"
                className="text-sm font-medium text-muted-foreground"
              >
                Language
              </Label>
              <p className="text-xs text-muted-foreground">
                Show this content only in the selected language. Leave empty to
                show it in all languages.
              </p>
              <Select
                id="tap-language"
                value={form.language}
                onChange={(e) =>
                  setForm((f) => ({ ...f, language: e.target.value }))
                }
                className="h-10 text-sm"
              >
                <option value="">None</option>
                {languageValueUnknown ? (
                  <option value={form.language}>{form.language}</option>
                ) : null}
                {LANGUAGE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
            </div>
          ) : null}

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
              disabled={submitting || sliderEditUploading}
              className="h-10 px-4 text-sm font-medium"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={submitting}
              disabled={
                submitting ||
                sliderEditUploading ||
                !config ||
                (isSliderCreate && sliderFiles.length === 0)
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
