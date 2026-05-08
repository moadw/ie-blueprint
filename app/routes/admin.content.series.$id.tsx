import { useState } from "react";
import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData, useNavigate, useRevalidator } from "react-router";
import {
  ArrowLeft,
  Award,
  BookOpen,
  Edit,
  Folder,
  ListOrdered,
  Package,
  Plus,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Switch } from "~/components/ui/switch";
import { SeriesDialog } from "~/components/admin/series-dialog";
import { PracticeDialog } from "~/components/admin/practice-dialog";
import { PracticeRow } from "~/components/admin/practice-row";
import { gqlClient } from "~/lib/graphql";
import { requireSessionToken } from "~/lib/session.server";
import { safe } from "~/lib/safe-loader";
import { activeHiddenFromStatus, statusFromActiveHidden } from "~/lib/curriculum";
import { CurriculumsFindOneDocument } from "~/queries/curriculums";
import { CurriculumsUpdateOneDocument } from "~/mutations/curriculums";
import { LessonFindManyDocument } from "~/queries/lessons";
import { lessonSortEnumTC } from "~/gql/graphql";
import { cn } from "~/lib/utils";

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
  const [curriculumResult, lessonsResult] = await Promise.all([
    safe(
      gqlClient.request(
        CurriculumsFindOneDocument,
        { filter: { _id: id } },
        headers,
      ),
    ),
    safe(
      gqlClient.request(
        LessonFindManyDocument,
        { filter: { curriculum: id }, limit: 100, sort: lessonSortEnumTC.ORDER_ASC },
        headers,
      ),
    ),
  ]);
  if (curriculumResult.ok && !curriculumResult.data.CurriculumsFindOne) {
    throw new Response("Series not found", { status: 404 });
  }
  const curriculum = curriculumResult.ok ? curriculumResult.data.CurriculumsFindOne : null;
  const lessons = lessonsResult.ok
    ? (lessonsResult.data.LessonFindMany ?? []).filter(
        (l): l is NonNullable<typeof l> => Boolean(l),
      )
    : [];
  return {
    curriculum,
    lessons,
    curriculumError: curriculumResult.error,
    lessonsError: lessonsResult.error,
  };
}

export default function AdminContentSeriesDetail() {
  const { curriculum, lessons, lessonsError, curriculumError } =
    useLoaderData<typeof loader>();
  const revalidator = useRevalidator();
  const navigate = useNavigate();
  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);

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
        record: { active, hidden },
      });
      const payloadError = (
        data.CurriculumsUpdateOne as { error?: { message?: string } | null } | null | undefined
      )?.error;
      if (payloadError?.message) throw new Error(payloadError.message);
      toast.success(next ? "Series set Live" : "Series set Draft");
      revalidator.revalidate();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to update series";
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
              {/* TODO(curriculum-type): drive from curriculum.<field>; render Collection variant */}
              <Badge shape="tag" className="bg-blue-50 text-blue-600 border-blue-200">
                <ListOrdered className="w-3 h-3 mr-1" />
                Sequential
              </Badge>
              <Badge shape="tag" className="bg-stone-50 text-stone-500 border-stone-200">
                {gradeLabel(curriculum.grade)}
              </Badge>
              {/* TODO(counts): drive from achievements / journals queries */}
              <span className="text-sm text-stone-400">
                {lessons.length} practices • 0 achievements • 0 journals
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-shrink-0 items-center gap-3">
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
      </div>

      <div className="flex justify-between items-center border-t border-b border-stone-200 py-3">
        <p className="text-sm text-stone-500">
          Drag practices to reorder. Changes are saved automatically.
        </p>
        <div className="flex gap-2 items-center">
          <Button
            variant="outline"
            size="sm"
            disabled
            className="border-stone-300 text-stone-700"
          >
            <RefreshCw className="h-4 w-4" />
            Sync Durations
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled
            className="border-amber-300 text-amber-700 hover:bg-amber-50"
          >
            <Award className="h-4 w-4" />
            Add Achievement
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled
            className="border-sky-300 text-sky-700 hover:bg-sky-50"
          >
            <BookOpen className="h-4 w-4" />
            Add Journal
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled
            className="border-stone-300 text-stone-700"
          >
            <Package className="h-4 w-4" />
            Bulk Import
          </Button>
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

      {lessonsError ? (
        <div className="rounded-xl border-2 border-dashed border-red-200 bg-red-50 py-10 text-center">
          <p className="mb-1 text-sm font-medium text-red-700">
            Couldn't load practices
          </p>
          <p className="text-xs text-red-600">{lessonsError}</p>
        </div>
      ) : lessons.length === 0 ? (
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
        <div className="space-y-2">
          {lessons.map((practice) => (
            <PracticeRow
              key={practice._id}
              practice={practice}
              onChange={() => revalidator.revalidate()}
            />
          ))}
        </div>
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
        defaultOrder={lessons.length + 1}
      />
    </div>
  );
}
