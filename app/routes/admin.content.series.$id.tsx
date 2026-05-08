import { useState } from "react";
import type { LoaderFunctionArgs } from "react-router";
import { NavLink, useLoaderData, useRevalidator } from "react-router";
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
import { Button } from "~/components/ui/button";
import { Switch } from "~/components/ui/switch";
import { SeriesDialog } from "~/components/admin/series-dialog";
import { PracticeDialog } from "~/components/admin/practice-dialog";
import { PracticeRow } from "~/components/admin/practice-row";
import { gqlClient } from "~/lib/graphql";
import { requireSessionToken } from "~/lib/session.server";
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
  const [curriculumData, lessonsData] = await Promise.all([
    gqlClient.request(
      CurriculumsFindOneDocument,
      { filter: { _id: id } },
      headers,
    ),
    gqlClient.request(
      LessonFindManyDocument,
      { filter: { curriculum: id }, limit: 100, sort: lessonSortEnumTC.ORDER_ASC },
      headers,
    ),
  ]);
  const curriculum = curriculumData.CurriculumsFindOne;
  if (!curriculum) throw new Response("Series not found", { status: 404 });
  const lessons = (lessonsData.LessonFindMany ?? []).filter(
    (l): l is NonNullable<typeof l> => Boolean(l),
  );
  return { curriculum, lessons };
}

export default function AdminContentSeriesDetail() {
  const { curriculum, lessons } = useLoaderData<typeof loader>();
  const revalidator = useRevalidator();
  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);

  const status = statusFromActiveHidden(curriculum);

  async function handleStatusToggle(next: boolean) {
    setStatusUpdating(true);
    try {
      const { active, hidden } = activeHiddenFromStatus(next ? "live" : "draft");
      const data = await gqlClient.request(CurriculumsUpdateOneDocument, {
        _id: curriculum._id,
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
    <div className="space-y-0">
      <NavLink
        to="/admin/content"
        className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Series
      </NavLink>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-start gap-4">
          {curriculum.cover?.url ? (
            <img
              src={curriculum.cover.url}
              alt={curriculum.title ?? "Series cover"}
              className="h-16 w-16 rounded-[14px] object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-[14px] bg-stone-100">
              <Folder className="h-7 w-7 text-stone-400" />
            </div>
          )}
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="truncate font-serif text-2xl text-stone-900">
                {curriculum.title}
              </h1>
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                  status === "live"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-amber-100 text-amber-700",
                )}
              >
                {status === "live" ? "Live" : "Draft"}
              </span>
            </div>
            {curriculum.description ? (
              <p className="max-w-xl text-sm text-stone-500">
                {curriculum.description}
              </p>
            ) : null}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs text-blue-600">
                <ListOrdered className="h-3 w-3" />
                Sequential
              </span>
              <span className="rounded-full border border-stone-200 bg-stone-50 px-2 py-0.5 text-xs text-stone-500">
                {gradeLabel(curriculum.grade)}
              </span>
              <span className="text-sm text-stone-400">
                {lessons.length} practices
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

      <div className="mt-6 mb-6 flex flex-wrap items-center justify-end gap-2 border-t border-b border-stone-200 py-3">
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

      {lessons.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-stone-200 bg-stone-50 py-16 text-center">
          <Folder className="mx-auto mb-3 h-10 w-10 text-stone-400" />
          <p className="mb-4 text-stone-500">No practices in this series yet</p>
          <div className="flex justify-center">
            <Button
              size="sm"
              onClick={() => setAddOpen(true)}
              className="bg-stone-900 text-white hover:bg-stone-800"
            >
              <Plus className="h-4 w-4" />
              Add First Practice
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
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
