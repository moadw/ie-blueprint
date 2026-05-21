import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { toast } from "~/components/ui/toast";
import { env } from "~/lib/env";
import { gqlClient } from "~/lib/graphql";
import {
  CurriculumsFindManyDocument,
  CurriculumsUpdateOneDocument,
} from "~/queries/curriculums";

export interface ManageSeriesDialogExperience {
  _id: string;
  name?: string | null;
}

export interface ManageSeriesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  experience: ManageSeriesDialogExperience;
}

interface CurriculumLite {
  _id: string;
  title: string;
  description: string | null;
  collectionIds: string[];
}

export function ManageSeriesDialog({
  open,
  onOpenChange,
  experience,
}: ManageSeriesDialogProps) {
  const [curriculums, setCurriculums] = useState<CurriculumLite[]>([]);
  const [assigned, setAssigned] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setLoading(true);
    setLoadError(null);

    Promise.all([
      gqlClient.request(CurriculumsFindManyDocument, {
        filter: { platform: env.PLATFORM },
        limit: 500,
      }),
      gqlClient.request(CurriculumsFindManyDocument, {
        filter: {
          curriculumCollection: [experience._id],
          platform: env.PLATFORM,
        },
        limit: 500,
      }),
    ])
      .then(([allData, assignedData]) => {
        if (cancelled) return;
        const all = (allData.CurriculumsFindMany ?? [])
          .filter((c): c is NonNullable<typeof c> => c != null)
          .map<CurriculumLite>((c) => ({
            _id: c._id,
            title: c.title ?? "Untitled",
            description: c.description ?? null,
            collectionIds: (c.curriculumCollection ?? [])
              .filter(
                (cc): cc is NonNullable<typeof cc> => cc != null,
              )
              .map((cc) => cc._id),
          }))
          .sort((a, b) =>
            a.title
              .toLocaleLowerCase()
              .localeCompare(b.title.toLocaleLowerCase()),
          );
        const assignedSet = new Set<string>(
          (assignedData.CurriculumsFindMany ?? [])
            .filter((c): c is NonNullable<typeof c> => c != null)
            .map((c) => c._id),
        );
        setCurriculums(all);
        setAssigned(assignedSet);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setLoadError(
          err instanceof Error ? err.message : "Failed to load curriculums.",
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open, experience._id]);

  async function handleToggle(curriculum: CurriculumLite, isAssigned: boolean) {
    setUpdating(curriculum._id);
    try {
      const next = isAssigned
        ? curriculum.collectionIds.filter((id) => id !== experience._id)
        : Array.from(
            new Set([...curriculum.collectionIds, experience._id]),
          );
      const data = await gqlClient.request(CurriculumsUpdateOneDocument, {
        _id: curriculum._id,
        record: { curriculumCollection: next, platform: env.PLATFORM },
      });
      const payload = data.CurriculumsUpdateOne;
      const errMsg = (payload?.error as
        | { message?: string | null }
        | null
        | undefined)?.message;
      if (errMsg) {
        toast.error(errMsg);
        return;
      }
      // update local caches
      setCurriculums((prev) =>
        prev.map((c) =>
          c._id === curriculum._id ? { ...c, collectionIds: next } : c,
        ),
      );
      setAssigned((prev) => {
        const nextSet = new Set(prev);
        if (isAssigned) nextSet.delete(curriculum._id);
        else nextSet.add(curriculum._id);
        return nextSet;
      });
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update assignment",
      );
    } finally {
      setUpdating(null);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white border-stone-200 text-stone-900 max-w-md max-h-[80vh] overflow-hidden flex flex-col font-sans rounded-[16px]">
        <DialogHeader className="mb-0">
          <DialogTitle className="font-serif text-xl font-normal text-stone-900">
            Manage Series — {experience.name ?? "Experience"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-2 py-2">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2
                className="w-5 h-5 text-stone-400 animate-spin"
                aria-hidden="true"
              />
            </div>
          ) : loadError ? (
            <div className="rounded-[14px] border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {loadError}
            </div>
          ) : curriculums.length === 0 ? (
            <p className="text-center text-stone-400 py-8">
              No series available
            </p>
          ) : (
            curriculums.map((curriculum) => {
              const isAssigned = assigned.has(curriculum._id);
              const isUpdating = updating === curriculum._id;
              return (
                <label
                  key={curriculum._id}
                  className={`flex items-center gap-3 p-3 rounded-[14px] border cursor-pointer transition-colors ${
                    isAssigned
                      ? "bg-blue-50 border-blue-200"
                      : "bg-card border-border"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isAssigned}
                    disabled={isUpdating}
                    onChange={() => {
                      void handleToggle(curriculum, isAssigned);
                    }}
                    className="h-4 w-4 rounded border-stone-300 text-stone-900 focus:ring-stone-300 cursor-pointer disabled:cursor-not-allowed"
                    aria-label={`Toggle ${curriculum.title}`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-stone-900 truncate">
                      {curriculum.title}
                    </p>
                    {curriculum.description ? (
                      <p className="text-sm text-stone-500 truncate">
                        {curriculum.description}
                      </p>
                    ) : null}
                  </div>
                  {isUpdating ? (
                    <Loader2
                      className="w-4 h-4 text-stone-400 animate-spin"
                      aria-hidden="true"
                    />
                  ) : null}
                </label>
              );
            })
          )}
        </div>

        <div className="flex justify-end pt-4 mt-2 border-t border-stone-100">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="h-10 px-4 rounded-[14px] text-stone-500 hover:text-stone-700 hover:bg-transparent text-sm font-medium"
          >
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
