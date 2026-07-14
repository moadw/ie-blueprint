import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import {
  Film,
  GripVertical,
  ImageIcon,
  Loader2,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import {
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ConfirmDialog } from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { toast } from "~/components/ui/toast";
import { env } from "~/lib/env";
import { toErrorMessage } from "~/lib/errors";
import { gqlClient } from "~/lib/graphql";
import { TapFindManyDocument } from "~/queries/taps";
import { QuestionsFindManyDocument } from "~/queries/questions";
import { TapUpdateOneDocument } from "~/mutations/taps";
import { SortFindManytapInput } from "~/gql/graphql";
import { TapDialog, type TapItem } from "~/components/admin/tap-dialog";

// Human labels for the backend `TapType.identifier` values (mirrors
// KNOWN_TYPES in tap-dialog.tsx). Falls back to the raw identifier for an
// unconfigured type so the row never shows a blank subtitle.
const TAP_TYPE_LABELS: Record<string, string> = {
  "ie-journal": "Journal",
  video: "Video",
  "full-audio": "Full Audio",
  "5min-audio": "5-min Audio",
  slider: "Slider",
};

// tap.language is a scalar "en" | "es" | null/empty. Empty = the content is
// shown in both languages (matches the tap dialog's "leave empty to show it in
// all languages" copy).
function tapLanguageLabel(language: string | null | undefined): string {
  if (language === "en") return "English";
  if (language === "es") return "Spanish";
  return "Both";
}

interface SortableTapRowProps {
  id: string;
  tap: TapItem;
  index: number;
  /** Slider taps only: 1-based position among slider taps → "Slide N". null otherwise. */
  slideNumber: number | null;
  /** Journal taps only: the resolved question text, shown under the title. */
  question: string | null;
  disabled: boolean;
  onEdit: (tap: TapItem) => void;
  onDelete: (tap: TapItem) => void;
}

// Route-private sortable row for the content list. Drag is initiated by the
// GripVertical handle (its own listeners) so clicks on the edit/delete buttons
// aren't hijacked; a small PointerSensor activation distance is the secondary
// guard.
function SortableTapRow({
  id,
  tap,
  index,
  slideNumber,
  question,
  disabled,
  onEdit,
  onDelete,
}: SortableTapRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 10 : undefined,
  };

  // Slider taps render a slide-style row (thumbnail + media icon + "Slide N")
  // instead of the order-number + title used by every other tap type.
  const isSlide = slideNumber != null;
  const slideIsVideo = isSlide && Boolean(tap.videos && tap.videos[0]);
  const slideThumbUrl = isSlide
    ? slideIsVideo
      ? (tap.videos?.[0]?.thumbnail?.url ?? null)
      : (tap.cover?.url ?? null)
    : null;
  const slideVideoUrl = slideIsVideo ? (tap.videos?.[0]?.url ?? null) : null;
  const label = isSlide ? `Slide ${slideNumber}` : tap.title || "content";

  // Subtitle metadata for non-slide rows: the tap type followed by its
  // language ("Both" when unset). e.g. "Journal · Both", "Video · English".
  const rawType = tap.type ?? "";
  const typeLabel = TAP_TYPE_LABELS[rawType] ?? (rawType || null);
  const metaLine = [typeLabel, tapLanguageLabel(tap.language)]
    .filter(Boolean)
    .join(" · ");

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 rounded-lg border border-stone-200 bg-stone-50 p-2"
    >
      <button
        type="button"
        aria-label={`Drag to reorder ${label}`}
        className="cursor-grab touch-none p-1 text-stone-400 hover:text-stone-600 active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-50"
        disabled={disabled}
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </button>
      {isSlide ? (
        <>
          <div className="flex h-10 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded bg-stone-200">
            {slideThumbUrl ? (
              <img
                src={slideThumbUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : slideVideoUrl ? (
              <video
                src={slideVideoUrl}
                className="h-full w-full object-cover"
                muted
              />
            ) : slideIsVideo ? (
              <Film className="h-5 w-5 text-stone-400" />
            ) : (
              <ImageIcon className="h-5 w-5 text-stone-400" />
            )}
          </div>
          <div className="flex min-w-0 flex-1 items-center gap-1.5">
            {slideIsVideo ? (
              <Film className="h-4 w-4 flex-shrink-0 text-purple-500" />
            ) : (
              <ImageIcon className="h-4 w-4 flex-shrink-0 text-sky-500" />
            )}
            <span className="truncate text-sm text-stone-700">
              Slide {slideNumber}
            </span>
          </div>
        </>
      ) : (
        <>
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded border border-stone-200 bg-white text-xs font-semibold text-stone-700">
            {Math.max(1, Math.round(tap.order ?? index + 1))}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-stone-900">
              {tap.title || "Untitled"}
            </p>
            <p className="mt-0.5 truncate text-xs text-stone-500">{metaLine}</p>
            {question ? (
              <p className="mt-0.5 line-clamp-2 text-xs text-stone-500">
                {question}
              </p>
            ) : null}
          </div>
        </>
      )}
      <div className="flex flex-shrink-0 gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(tap)}
          aria-label={`Edit ${label}`}
          className="h-8 w-8 text-stone-500 hover:bg-stone-100 hover:text-stone-700"
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(tap)}
          aria-label={`Delete ${label}`}
          className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-700"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

export interface TapBlocksProps {
  classId: string;
}

export function TapBlocks({ classId }: TapBlocksProps) {
  const [params, setSearchParams] = useSearchParams();
  const [taps, setTaps] = useState<TapItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Journal question text resolved by id, for the under-title preview.
  const [questionLabels, setQuestionLabels] = useState<Record<string, string>>(
    {},
  );

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<TapItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TapItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);

  // Small activation distance so a click on the edit/delete buttons isn't
  // mistaken for a drag; KeyboardSensor for accessible reordering.
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Lazy fetch: this component mounts when the practice accordion expands,
  // so the request only fires on expand (fetch-on-open precedent:
  // ManageSeriesDialog). The list is client-owned — refetch locally, never
  // route-revalidate.
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadError(null);
    gqlClient
      .request(TapFindManyDocument, {
        filter: { class: classId, platform: env.PLATFORM },
        limit: 100,
        sort: SortFindManytapInput.ORDER_ASC,
      })
      .then((data) => {
        if (cancelled) return;
        // Soft delete = { deleted: true } — filter deleted rows client-side.
        const rows = (data.TapFindMany ?? [])
          .filter((t) => !t.deleted)
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        setTaps(rows);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setLoadError(
          toErrorMessage(err, "Failed to load content."),
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [classId, refreshKey]);

  // Resolve journal question text by EXACT id (parallel per-id; a `filter:{}`
  // scan has no limit and can miss records). Keyed on the sorted unique id set
  // so reordering — which rebuilds `taps` — doesn't refetch, and only
  // not-yet-resolved ids are fetched.
  const questionIds = Array.from(
    new Set(
      taps.flatMap((t) => {
        const q = t.extraQuestions?.[0]?.question;
        return q ? [q] : [];
      }),
    ),
  ).sort();
  const questionIdsKey = questionIds.join(",");

  useEffect(() => {
    const missing = questionIds.filter((id) => questionLabels[id] == null);
    if (missing.length === 0) return;
    let cancelled = false;
    Promise.all(
      missing.map((id) =>
        gqlClient
          .request(QuestionsFindManyDocument, { filter: { _id: id } })
          .then((data) => ({
            id,
            label: data.QuestionsFindMany?.[0]?.label ?? null,
          }))
          .catch(() => ({ id, label: null as string | null })),
      ),
    ).then((results) => {
      if (cancelled) return;
      setQuestionLabels((prev) => {
        const next = { ...prev };
        for (const r of results) if (r.label != null) next[r.id] = r.label;
        return next;
      });
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionIdsKey]);

  function refetch() {
    setRefreshKey((k) => k + 1);
  }

  function openCreate() {
    setEditing(null);
    setDialogOpen(true);
    // A create dialog isn't an existing tap — clear any stale ?tap=.
    const next = new URLSearchParams(params);
    next.delete("tap");
    setSearchParams(next, { replace: true });
  }

  function openEdit(tap: TapItem) {
    setEditing(tap);
    setDialogOpen(true);
    // Write-only URL reflection of the opened tap (tap._id is globally unique).
    const next = new URLSearchParams(params);
    if (tap._id) next.set("tap", tap._id);
    else next.delete("tap");
    setSearchParams(next, { replace: true });
  }

  function handleDialogOpenChange(open: boolean) {
    setDialogOpen(open);
    if (!open) {
      const next = new URLSearchParams(params);
      next.delete("tap");
      setSearchParams(next, { replace: true });
    }
  }

  async function handleDelete() {
    const target = deleteTarget;
    if (!target?._id) return;
    setDeleting(true);
    try {
      // Soft delete: flag the record; the list filters out `deleted` rows.
      const data = await gqlClient.request(TapUpdateOneDocument, {
        _id: target._id,
        record: { deleted: true },
      });
      const payload = data.TapUpdateOne;
      const payloadError = (
        payload as { error?: { message?: string } | null } | null | undefined
      )?.error;
      if (payloadError?.message) throw new Error(payloadError.message);
      toast.success("Content deleted");
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      toast.error(
        toErrorMessage(err, "Failed to delete content"),
      );
    } finally {
      setDeleting(false);
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id || savingOrder) return;

    const oldIndex = taps.findIndex(
      (t, i) => (t._id ?? `tap-${i}`) === active.id,
    );
    const newIndex = taps.findIndex(
      (t, i) => (t._id ?? `tap-${i}`) === over.id,
    );
    if (oldIndex === -1 || newIndex === -1) return;

    const previous = taps;
    // Optimistic reorder + renormalize every tap's order to 1..N.
    const reordered: TapItem[] = arrayMove(taps, oldIndex, newIndex).map(
      (t, i) => ({ ...t, order: i + 1 }),
    );
    setTaps(reordered);
    setSavingOrder(true);

    // Only persist rows that already have a server _id.
    const updates = reordered.flatMap((t, i) =>
      t._id ? [{ _id: t._id, order: i + 1 }] : [],
    );

    try {
      // Parallel TapUpdateOne.
      const results = await Promise.all(
        updates.map((u) =>
          gqlClient.request(TapUpdateOneDocument, {
            _id: u._id,
            record: { order: u.order },
          }),
        ),
      );
      // ErrorInterface gotcha: payload errors live on `error.message`.
      for (const data of results) {
        const payloadError = (
          data.TapUpdateOne as
            | { error?: { message?: string } | null }
            | null
            | undefined
        )?.error;
        if (payloadError?.message) throw new Error(payloadError.message);
      }
      toast.success("Order updated");
    } catch (err) {
      // Roll the optimistic order back to the last-known-good local state
      // immediately, then refetch to settle on server truth.
      setTaps(previous);
      toast.error(
        toErrorMessage(err, "Failed to update order"),
      );
    } finally {
      setSavingOrder(false);
      // List is client-owned — reconcile via the local refetch, never
      // route-revalidate.
      refetch();
    }
  }

  // Sequential "Slide N" numbering across slider-type taps, in list order.
  let sliderSeq = 0;
  const slideNumbers = taps.map((t) =>
    t.type === "slider" ? ++sliderSeq : null,
  );

  return (
    <div className="space-y-2">
      {loading ? (
        <div className="flex items-center gap-2 rounded-lg border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm text-stone-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading content…
        </div>
      ) : loadError ? (
        <div className="rounded-lg border-2 border-dashed border-red-200 bg-red-50 px-3 py-4 text-center">
          <p className="mb-1 text-sm font-medium text-red-700">
            Couldn't load content
          </p>
          <p className="text-xs text-red-600">{loadError}</p>
        </div>
      ) : taps.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-stone-200 bg-stone-50 px-3 py-6 text-center">
          <p className="mb-3 text-sm text-stone-500">
            No content in this practice yet
          </p>
          <Button
            size="sm"
            onClick={openCreate}
            className="bg-stone-900 text-white hover:bg-stone-800"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Content
          </Button>
        </div>
      ) : (
        <>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={taps.map((tap, index) => tap._id ?? `tap-${index}`)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {taps.map((tap, index) => {
                  const id = tap._id ?? `tap-${index}`;
                  const qid = tap.extraQuestions?.[0]?.question ?? null;
                  const question = qid
                    ? (questionLabels[qid] ?? null)
                    : null;
                  return (
                    <SortableTapRow
                      key={id}
                      id={id}
                      tap={tap}
                      index={index}
                      slideNumber={slideNumbers[index] ?? null}
                      question={question}
                      disabled={savingOrder}
                      onEdit={openEdit}
                      onDelete={setDeleteTarget}
                    />
                  );
                })}
              </div>
            </SortableContext>
          </DndContext>
          <div className="pt-1">
            <Button
              size="sm"
              onClick={openCreate}
              className="bg-stone-900 text-white hover:bg-stone-800"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Content
            </Button>
          </div>
        </>
      )}

      <TapDialog
        open={dialogOpen}
        onOpenChange={handleDialogOpenChange}
        classId={classId}
        defaultOrder={taps.length + 1}
        tap={editing}
        onSaved={refetch}
      />

      <ConfirmDialog
        open={deleteTarget != null}
        onOpenChange={(open) => {
          if (!open && !deleting) setDeleteTarget(null);
        }}
        title="Delete content?"
        description={`"${deleteTarget?.title || "Untitled"}" will be removed from this practice.`}
        confirmLabel="Delete"
        variant="destructive"
        loading={deleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}

export default TapBlocks;
