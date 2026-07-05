import { useEffect, useState } from "react";
import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData, useNavigate, useRevalidator } from "react-router";
import { ArrowLeft, Edit, Folder, Plus } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Switch } from "~/components/ui/switch";
import { SeriesDialog } from "~/components/admin/series-dialog";
import { PracticeDialog } from "~/components/admin/practice-dialog";
import { PracticeRow } from "~/components/admin/practice-row";
import {
  AdminListPagination,
  ADMIN_LIST_PAGE_SIZE,
} from "~/components/admin/admin-list-pagination";
import { env } from "~/lib/env";
import { toErrorMessage } from "~/lib/errors";
import { gqlClient } from "~/lib/graphql";
import { requireSessionToken } from "~/lib/session.server";
import { safe } from "~/lib/safe-loader";
import { activeHiddenFromStatus, statusFromActiveHidden } from "~/lib/curriculum";
import { CurriculumsFindOneDocument } from "~/queries/curriculums";
import { CurriculumsUpdateOneDocument } from "~/mutations/curriculums";
import { ClassesAdminFindManyDocument } from "~/queries/classes";
import { SortFindManyclassesInput } from "~/gql/graphql";
import { cn } from "~/lib/utils";

// Fetch every practice in one request and paginate client-side: the header
// total and the "Add Practice" default order both need the full set, and
// Blueprint exposes no count/skip wiring for this query to drive a clean
// server-side pager. 500 is the codebase's standard fetch-many ceiling and
// comfortably above any real series (curricula top out around 300 classes);
// we warn if a series ever exceeds it so we don't silently truncate again.
const SERIES_CLASSES_LIMIT = 500;

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
  return {
    curriculum,
    classes,
    curriculumError: curriculumResult.error,
    classesError: classesResult.error,
  };
}

export default function AdminContentSeriesDetail() {
  const { curriculum, classes, classesError, curriculumError } =
    useLoaderData<typeof loader>();
  const revalidator = useRevalidator();
  const navigate = useNavigate();
  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [page, setPage] = useState(1);

  const totalPages = Math.max(
    1,
    Math.ceil(classes.length / ADMIN_LIST_PAGE_SIZE),
  );
  // Clamp reads so a deletion that shrinks the list can't strand us past the
  // last page; sync state too so Prev/Next math stays correct.
  const safePage = Math.min(page, totalPages);
  const pageClasses = classes.slice(
    (safePage - 1) * ADMIN_LIST_PAGE_SIZE,
    safePage * ADMIN_LIST_PAGE_SIZE,
  );
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

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
                {classes.length} practices
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
      ) : classes.length === 0 ? (
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
          <div className="space-y-2">
            {pageClasses.map((practice) => (
              <PracticeRow
                key={practice._id}
                practice={practice}
                onChange={() => revalidator.revalidate()}
              />
            ))}
          </div>
          {classes.length > ADMIN_LIST_PAGE_SIZE ? (
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
        defaultOrder={classes.length + 1}
      />
    </div>
  );
}
