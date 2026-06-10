import { useEffect, useState } from "react";
import { Image as ImageIcon, Loader2 } from "lucide-react";
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
  coverUrl: string | null;
}

export function ManageSeriesDialog({
  open,
  onOpenChange,
  experience,
}: ManageSeriesDialogProps) {
  const [curriculums, setCurriculums] = useState<CurriculumLite[]>([]);
  // `assigned` is the persisted baseline (membership at load time); `selected`
  // is the working set the checkboxes mutate locally. Nothing is written until
  // Save, which then persists only the diff — so rapid clicks never race the
  // backend's per-collection membership update.
  const [assigned, setAssigned] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setLoading(true);
    setLoadError(null);
    setSaving(false);

    gqlClient
      .request(CurriculumsFindManyDocument, {
        filter: { platform: env.PLATFORM },
        limit: 500,
      })
      .then((allData) => {
        if (cancelled) return;
        const all = (allData.CurriculumsFindMany ?? [])
          .filter((c): c is NonNullable<typeof c> => c != null)
          .map<CurriculumLite>((c) => ({
            _id: c._id,
            title: c.title ?? "Untitled",
            description: c.description ?? null,
            collectionIds: (c.curriculumCollection ?? [])
              .filter((cc): cc is NonNullable<typeof cc> => cc != null)
              .map((cc) => cc._id),
            coverUrl: c.cover?.url ?? null,
          }))
          .sort((a, b) =>
            a.title
              .toLocaleLowerCase()
              .localeCompare(b.title.toLocaleLowerCase()),
          );
        // Membership is derived client-side from each curriculum's own
        // `curriculumCollection` (the array we just loaded) — NOT from a
        // CurriculumsFindMany(filter: { curriculumCollection: [experience._id] })
        // query. That backend filter matches by EXACT (ordered) array equality,
        // so any series that also belongs to another experience (stored array
        // = [E, other]) is silently dropped from the result. That was the real
        // "saved N series, only the singly-assigned one comes back checked" bug:
        // the writes always succeeded; the membership read couldn't see them.
        const assignedSet = new Set<string>(
          all
            .filter((c) => c.collectionIds.includes(experience._id))
            .map((c) => c._id),
        );
        setCurriculums(all);
        setAssigned(assignedSet);
        setSelected(new Set(assignedSet));
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

  function toggleSelected(curriculumId: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(curriculumId)) next.delete(curriculumId);
      else next.add(curriculumId);
      return next;
    });
  }

  const dirty =
    selected.size !== assigned.size ||
    [...selected].some((id) => !assigned.has(id));

  async function handleSave() {
    const toAdd = [...selected].filter((id) => !assigned.has(id));
    const toRemove = [...assigned].filter((id) => !selected.has(id));
    if (toAdd.length === 0 && toRemove.length === 0) {
      onOpenChange(false);
      return;
    }
    setSaving(true);
    try {
      // One CurriculumsUpdateOne per changed series, run sequentially so the
      // backend never sees concurrent membership writes for this collection.
      for (const id of [...toAdd, ...toRemove]) {
        const curriculum = curriculums.find((c) => c._id === id);
        if (!curriculum) continue;
        const shouldBeAssigned = selected.has(id);
        const next = shouldBeAssigned
          ? Array.from(new Set([...curriculum.collectionIds, experience._id]))
          : curriculum.collectionIds.filter((cid) => cid !== experience._id);
        const data = await gqlClient.request(CurriculumsUpdateOneDocument, {
          _id: id,
          record: { curriculumCollection: next, platform: env.PLATFORM },
        });
        const errMsg = (data.CurriculumsUpdateOne?.error as
          | { message?: string | null }
          | null
          | undefined)?.message;
        if (errMsg) throw new Error(errMsg);
        setCurriculums((prev) =>
          prev.map((c) => (c._id === id ? { ...c, collectionIds: next } : c)),
        );
      }
      setAssigned(new Set(selected));
      toast.success("Series updated");
      onOpenChange(false);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update series",
      );
    } finally {
      setSaving(false);
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
              const isSelected = selected.has(curriculum._id);
              return (
                <label
                  key={curriculum._id}
                  className={`flex items-center gap-3 p-3 rounded-[14px] border cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-blue-50 border-blue-200"
                      : "bg-card border-border"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    disabled={saving}
                    onChange={() => toggleSelected(curriculum._id)}
                    className="h-4 w-4 rounded border-stone-300 text-stone-900 focus:ring-stone-300 cursor-pointer disabled:cursor-not-allowed"
                    aria-label={`Toggle ${curriculum.title}`}
                  />
                  {curriculum.coverUrl ? (
                    <img
                      src={curriculum.coverUrl}
                      alt=""
                      className="h-9 w-9 flex-shrink-0 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-stone-200 bg-stone-100 text-stone-400">
                      <ImageIcon className="h-4 w-4" aria-hidden="true" />
                    </div>
                  )}
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
                </label>
              );
            })
          )}
        </div>

        <div className="flex justify-end pt-4 mt-2 border-t border-stone-100">
          <Button
            type="button"
            variant="primary"
            onClick={() => void handleSave()}
            loading={saving}
            disabled={saving || loading}
            className="h-10 px-4 rounded-[14px] text-sm font-medium"
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
