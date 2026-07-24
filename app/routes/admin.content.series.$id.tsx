import { useEffect, useState } from "react";
import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData, useNavigate, useRevalidator } from "react-router";
import { ArrowLeft, Edit, Folder, Plus } from "lucide-react";
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
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { toast } from "sonner";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Switch } from "~/components/ui/switch";
import { SeriesDialog } from "~/components/admin/series-dialog";
import { PracticeDialog } from "~/components/admin/practice-dialog";
import {
  PracticeRow,
  EMPTY_CONTENT_SUMMARY,
  type ClassContentSummary,
} from "~/components/admin/practice-row";
import { AdminListPagination } from "~/components/admin/admin-list-pagination";
import { env } from "~/lib/env";
import { toErrorMessage } from "~/lib/errors";
import { gqlClient } from "~/lib/graphql";
import { requireSessionToken } from "~/lib/session.server";
import { safe } from "~/lib/safe-loader";
import { activeHiddenFromStatus, statusFromActiveHidden } from "~/lib/curriculum";
import { CurriculumsFindOneDocument } from "~/queries/curriculums";
import { CurriculumsUpdateOneDocument } from "~/mutations/curriculums";
import { ClassReorderDocument } from "~/mutations/classes";
import { ClassesAdminFindManyDocument } from "~/queries/classes";
import { TapFindManyDocument } from "~/queries/taps";
import { SortFindManyclassesInput } from "~/gql/graphql";
import { cn } from "~/lib/utils";

// Fetch every practice in one request and paginate client-side: the header
// total and the "Add Practice" default order both need the full set, and
// Blueprint exposes no count/skip wiring for this query to drive a clean
// server-side pager. 500 is the codebase's standard fetch-many ceiling and
// comfortably above any real series (curricula top out around 300 classes);
// we warn if a series ever exceeds it so we don't silently truncate again.
const SERIES_CLASSES_LIMIT = 500;

// Practices per page in the list below. Deliberately larger than the shared
// `ADMIN_LIST_PAGE_SIZE` (100) used by the other admin lists: drag-to-reorder
// only works within the rendered page, and at 200 virtually every real series
// (which top out around 300 classes) fits on a single page, so the whole
// ordering is reorderable without paging. Scoped to this route on purpose —
// don't reach for the shared constant.
const PRACTICES_PAGE_SIZE = 200;

// One TapFindMany fetches every tap across the series' classes (via
// `_operators.class.in`) to build the collapsed-row content indicators. Sized
// well above any real series (≤500 classes × a handful of taps each); we warn
// if it's ever hit so indicators don't silently go incomplete.
const SERIES_TAPS_LIMIT = 2000;

// tap.type identifier → which indicator box it feeds. Any other type is
// unmapped and contributes no box.
const TAP_TYPE_TO_BOX: Record<string, keyof ClassContentSummary> = {
  "ie-journal": "journal",
  "full-audio": "full",
  "5min-audio": "fiveMin",
  video: "video",
  slider: "slider",
  preview: "preview",
};

// A tap's scalar language → box tag. Empty/null = shown in both languages.
function tapLangLabel(language: string | null | undefined): string {
  if (language === "en") return "EN";
  if (language === "es") return "ES";
  return "Both";
}

const LANG_SORT = ["EN", "ES", "Both"];

// Group the series' taps by class into per-class content summaries. Each box
// field collects the distinct language labels of that type's taps, sorted.
function summarizeContentByClass(
  taps: ReadonlyArray<{
    class?: string | null;
    type?: string | null;
    language?: string | null;
  }>,
): Record<string, ClassContentSummary> {
  const acc = new Map<
    string,
    {
      journal: Set<string>;
      full: Set<string>;
      fiveMin: Set<string>;
      video: Set<string>;
      slider: Set<string>;
      preview: Set<string>;
    }
  >();
  for (const tap of taps) {
    const classId = tap.class;
    if (!classId) continue;
    const box = TAP_TYPE_TO_BOX[tap.type ?? ""];
    if (!box) continue;
    let bucket = acc.get(classId);
    if (!bucket) {
      bucket = {
        journal: new Set(),
        full: new Set(),
        fiveMin: new Set(),
        video: new Set(),
        slider: new Set(),
        preview: new Set(),
      };
      acc.set(classId, bucket);
    }
    bucket[box].add(tapLangLabel(tap.language));
  }
  const sortLangs = (s: Set<string>) =>
    [...s].sort((a, b) => LANG_SORT.indexOf(a) - LANG_SORT.indexOf(b));
  const out: Record<string, ClassContentSummary> = {};
  for (const [classId, b] of acc) {
    out[classId] = {
      journal: sortLangs(b.journal),
      full: sortLangs(b.full),
      fiveMin: sortLangs(b.fiveMin),
      video: sortLangs(b.video),
      slider: sortLangs(b.slider),
      preview: sortLangs(b.preview),
    };
  }
  return out;
}

const GRADE_LABELS: Record<string, string> = {
  early_learning: "Early Learning",
  elementary: "Elementary",
  middle_school: "Middle School",
  high_school: "High School",
  all_levels: "All Levels",
  sports: "Sports",
};

function gradeLabel(grade: string | null | undefined): string {
  if (!grade) return "All Levels";
  return GRADE_LABELS[grade] ?? "All Levels";
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  const id = params.id;
  if (!id) throw new Response("Series id required", { status: 400 });
  const token = await requireSessionToken(request);
  const headers = { "access-token": token };
  if (!env.PLATFORM) {
    return {
      curriculum: null,
      classes: [],
      contentByClass: null as Record<string, ClassContentSummary> | null,
      curriculumError:
        "Platform is not configured. Please contact your administrator.",
      classesError: null,
    };
  }
  const [curriculumResult, classesResult] = await Promise.all([
    safe(
      gqlClient.request(
        CurriculumsFindOneDocument,
        { filter: { _id: id, platform: env.PLATFORM } },
        headers,
      ),
    ),
    safe(
      gqlClient.request(
        ClassesAdminFindManyDocument,
        {
          filter: { curriculum: id, platform: env.PLATFORM },
          limit: SERIES_CLASSES_LIMIT,
          sort: [SortFindManyclassesInput.ORDER_ASC],
        },
        headers,
      ),
    ),
  ]);
  if (curriculumResult.ok && !curriculumResult.data.CurriculumsFindOne) {
    throw new Response("Series not found", { status: 404 });
  }
  const curriculum = curriculumResult.ok ? curriculumResult.data.CurriculumsFindOne : null;
  const classes = classesResult.ok
    ? (classesResult.data.ClassesAdminFindMany ?? []).filter((c) => !c.deleted)
    : [];
  if (
    classesResult.ok &&
    (classesResult.data.ClassesAdminFindMany?.length ?? 0) >= SERIES_CLASSES_LIMIT
  ) {
    console.warn(
      `[admin/series] curriculum ${id} returned >= ${SERIES_CLASSES_LIMIT} classes; ` +
        "client pagination may be truncated — switch to server-side paging.",
    );
  }

  // Collapsed-row content indicators: one query for every tap across the
  // series' classes, grouped into per-class summaries. Non-critical — on
  // failure we hide the boxes (contentByClass=null) rather than render a
  // misleading all-empty checklist.
  const classIds = classes.flatMap((c) => (c._id ? [c._id] : []));
  let contentByClass: Record<string, ClassContentSummary> | null = {};
  if (classIds.length > 0) {
    const tapsResult = await safe(
      gqlClient.request(
        TapFindManyDocument,
        {
          filter: {
            platform: env.PLATFORM,
            _operators: { class: { in: classIds } },
          },
          limit: SERIES_TAPS_LIMIT,
        },
        headers,
      ),
    );
    if (tapsResult.ok) {
      const allTaps = tapsResult.data.TapFindMany ?? [];
      if (allTaps.length >= SERIES_TAPS_LIMIT) {
        console.warn(
          `[admin/series] curriculum ${id} returned >= ${SERIES_TAPS_LIMIT} taps; ` +
            "row content indicators may be incomplete — raise the limit or page.",
        );
      }
      contentByClass = summarizeContentByClass(
        allTaps.filter((t) => !t.deleted),
      );
    } else {
      contentByClass = null;
    }
  }

  return {
    curriculum,
    classes,
    contentByClass,
    curriculumError: curriculumResult.error,
    classesError: classesResult.error,
  };
}

export default function AdminContentSeriesDetail() {
  const { curriculum, classes, contentByClass, classesError, curriculumError } =
    useLoaderData<typeof loader>();
  const revalidator = useRevalidator();
  const navigate = useNavigate();
  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [page, setPage] = useState(1);

  // Local, reorderable mirror of the loader's classes so drag-and-drop can
  // update the list optimistically; resynced to server truth on every
  // revalidation (the loader already returns them ORDER_ASC).
  const [orderedClasses, setOrderedClasses] = useState(classes);
  const [reordering, setReordering] = useState(false);
  useEffect(() => {
    setOrderedClasses(classes);
  }, [classes]);

  // Small activation distance so a click on a row control isn't read as a
  // drag; KeyboardSensor for accessible reordering (mirrors tap-blocks).
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const totalPages = Math.max(
    1,
    Math.ceil(orderedClasses.length / PRACTICES_PAGE_SIZE),
  );
  // Clamp reads so a deletion that shrinks the list can't strand us past the
  // last page; sync state too so Prev/Next math stays correct.
  const safePage = Math.min(page, totalPages);
  const pageStart = (safePage - 1) * PRACTICES_PAGE_SIZE;
  const pageClasses = orderedClasses.slice(
    pageStart,
    pageStart + PRACTICES_PAGE_SIZE,
  );
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  // Stable dnd id per row: the class _id, with an absolute-index fallback for
  // the (backend-guaranteed-absent) case of a missing _id.
  const rowId = (practice: (typeof orderedClasses)[number], pageIndex: number) =>
    practice._id ?? `practice-${pageStart + pageIndex}`;

  async function handleReorder(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id || reordering) return;

    const oldPageIdx = pageClasses.findIndex(
      (c, i) => rowId(c, i) === active.id,
    );
    const newPageIdx = pageClasses.findIndex((c, i) => rowId(c, i) === over.id);
    if (oldPageIdx === -1 || newPageIdx === -1) return;

    const oldAbsIdx = pageStart + oldPageIdx;
    const newAbsIdx = pageStart + newPageIdx;
    const moved = orderedClasses[oldAbsIdx];
    if (!moved?._id) return;

    const previous = orderedClasses;
    // Optimistic move; ClassReorder cascades the order of subsequent classes
    // server-side, so a single call suffices. `order` is the 0-based target
    // rank in the ORDER_ASC list (verified against the backend: passing k lands
    // the class at index k, orders re-sequenced 0..N-1) — i.e. the new absolute
    // index, NOT index+1.
    setOrderedClasses(
      // Renormalize to contiguous 0-based orders so the row "Day" badges match
      // what ClassReorder writes, avoiding a flicker until revalidation lands.
      arrayMove(orderedClasses, oldAbsIdx, newAbsIdx).map((c, i) => ({
        ...c,
        order: i,
      })),
    );
    setReordering(true);
    try {
      await gqlClient.request(ClassReorderDocument, {
        id: moved._id,
        order: newAbsIdx,
      });
      toast.success("Order updated");
    } catch (err) {
      setOrderedClasses(previous);
      toast.error(toErrorMessage(err, "Failed to update order"));
    } finally {
      setReordering(false);
      // Reconcile with the server's canonical ordering.
      revalidator.revalidate();
    }
  }

  if (!curriculum) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/admin/content")}
          aria-label="Back"
          className="text-stone-500 hover:bg-stone-100 hover:text-stone-900"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="rounded-xl border-2 border-dashed border-red-200 bg-red-50 py-10 text-center">
          <p className="mb-1 text-sm font-medium text-red-700">
            Couldn't load series
          </p>
          <p className="text-xs text-red-600">{curriculumError}</p>
        </div>
      </div>
    );
  }

  const status = statusFromActiveHidden(curriculum);
  const curriculumId = curriculum._id;

  async function handleStatusToggle(next: boolean) {
    setStatusUpdating(true);
    try {
      const { active, hidden } = activeHiddenFromStatus(next ? "live" : "draft");
      const data = await gqlClient.request(CurriculumsUpdateOneDocument, {
        _id: curriculumId,
        record: { active, hidden, platform: env.PLATFORM },
      });
      const payloadError = (
        data.CurriculumsUpdateOne as { error?: { message?: string } | null } | null | undefined
      )?.error;
      if (payloadError?.message) throw new Error(payloadError.message);
      toast.success(next ? "Series set Live" : "Series set Draft");
      revalidator.revalidate();
    } catch (err) {
      const msg = toErrorMessage(err, "Failed to update series");
      toast.error(msg);
    } finally {
      setStatusUpdating(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/admin/content")}
            aria-label="Back"
            className="text-stone-500 hover:bg-stone-100 hover:text-stone-900"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          {curriculum.cover?.url ? (
            <img
              src={curriculum.cover.url}
              alt={curriculum.title ?? "Series cover"}
              className="h-16 w-16 rounded-[16px] object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-[16px] bg-stone-100">
              <Folder className="h-8 w-8 text-stone-300" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3">
              <h1 className="truncate font-serif text-2xl text-stone-900">
                {curriculum.title}
              </h1>
              <Badge
                shape="tag"
                className={cn(
                  status === "live"
                    ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                    : "bg-amber-100 text-amber-700 border-amber-200",
                )}
              >
                {status === "live" ? "Live" : "Draft"}
              </Badge>
            </div>
            <p className="text-stone-500 text-sm mt-1 max-w-xl">
              {curriculum.description || "No description"}
            </p>
            <div className="flex items-center gap-3 mt-2">
              <Badge shape="tag" className="bg-stone-50 text-stone-500 border-stone-200">
                {gradeLabel(curriculum.grade)}
              </Badge>
              <span className="text-sm text-stone-400">
                {orderedClasses.length} practices
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-shrink-0 flex-col items-end justify-between gap-3 self-stretch">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-500">
                {status === "live" ? "Live" : "Draft"}
              </span>
              <Switch
                checked={status === "live"}
                disabled={statusUpdating}
                onCheckedChange={handleStatusToggle}
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditOpen(true)}
              className="border-stone-300 text-stone-700 hover:bg-stone-100"
            >
              <Edit className="h-4 w-4" />
              Edit Series
            </Button>
          </div>
          <Button
            size="sm"
            onClick={() => setAddOpen(true)}
            className="bg-stone-900 text-white hover:bg-stone-800"
          >
            <Plus className="h-4 w-4" />
            Add Practice
          </Button>
        </div>
      </div>

      {classesError ? (
        <div className="rounded-xl border-2 border-dashed border-red-200 bg-red-50 py-10 text-center">
          <p className="mb-1 text-sm font-medium text-red-700">
            Couldn't load practices
          </p>
          <p className="text-xs text-red-600">{classesError}</p>
        </div>
      ) : orderedClasses.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-stone-200 bg-stone-50 py-16 text-center">
          <Folder className="mx-auto mb-3 h-12 w-12 text-stone-300" />
          <p className="mb-4 text-stone-500">No practices in this series yet</p>
          <Button
            size="sm"
            onClick={() => setAddOpen(true)}
            className="bg-stone-900 text-white hover:bg-stone-800"
          >
            <Plus className="h-4 w-4" />
            Add First Practice
          </Button>
        </div>
      ) : (
        <>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleReorder}
          >
            <SortableContext
              items={pageClasses.map((c, i) => rowId(c, i))}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {pageClasses.map((practice, index) => (
                  <PracticeRow
                    key={rowId(practice, index)}
                    id={rowId(practice, index)}
                    practice={practice}
                    reordering={reordering}
                    content={
                      contentByClass
                        ? (contentByClass[practice._id ?? ""] ??
                          EMPTY_CONTENT_SUMMARY)
                        : null
                    }
                    currentSeriesTitle={curriculum.title ?? null}
                    onChange={() => revalidator.revalidate()}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
          {orderedClasses.length > PRACTICES_PAGE_SIZE ? (
            <AdminListPagination
              page={safePage}
              hasMore={safePage < totalPages}
              onPrev={() => setPage((p) => Math.max(1, p - 1))}
              onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
            />
          ) : null}
        </>
      )}

      <SeriesDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        curriculum={curriculum}
      />
      <PracticeDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        curriculumId={curriculum._id}
        defaultOrder={orderedClasses.length + 1}
      />
    </div>
  );
}
