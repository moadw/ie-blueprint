import { useEffect, useState } from "react";
import { Check, Folder, Loader2 } from "lucide-react";
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
import { CurriculumsFindManyDocument } from "~/queries/curriculums";

export interface SeriesPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** License preset label, used in the dialog title. */
  label: string;
  /** Current courses on the licensepreset. Source of truth on open. */
  selectedIds: string[];
  /** Caller is responsible for the actual backend mutation. */
  onSave: (nextIds: string[]) => Promise<void> | void;
}

interface CurriculumLite {
  _id: string;
  title: string;
  description: string | null;
  coverUrl: string | null;
}

function sameStringSet(a: string[], b: Set<string>): boolean {
  if (a.length !== b.size) return false;
  for (const id of a) {
    if (!b.has(id)) return false;
  }
  return true;
}

export function SeriesPickerDialog({
  open,
  onOpenChange,
  label,
  selectedIds,
  onSave,
}: SeriesPickerDialogProps) {
  const [series, setSeries] = useState<CurriculumLite[]>([]);
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(selectedIds),
  );
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Reset + re-fetch whenever the dialog flips from closed to open.
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setSelected(new Set(selectedIds));
    setLoading(true);
    setLoadError(null);

    gqlClient
      .request(CurriculumsFindManyDocument, {
        filter: { platform: env.PLATFORM },
        limit: 500,
      })
      .then((data) => {
        if (cancelled) return;
        const list = (data.CurriculumsFindMany ?? [])
          .filter((c): c is NonNullable<typeof c> => c != null)
          .map<CurriculumLite>((c) => ({
            _id: c._id,
            title: c.title ?? "Untitled",
            description: c.description ?? null,
            coverUrl: c.cover?.url ?? null,
          }))
          .sort((a, b) =>
            a.title
              .toLocaleLowerCase()
              .localeCompare(b.title.toLocaleLowerCase()),
          );
        setSeries(list);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setLoadError(
          err instanceof Error ? err.message : "Failed to load series.",
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // selectedIds intentionally excluded: we snapshot it on open, not on
    // every change of the parent's array reference.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleSave() {
    const nextIds = Array.from(selected);
    setSaving(true);
    try {
      await onSave(nextIds);
      onOpenChange(false);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to save series",
      );
    } finally {
      setSaving(false);
    }
  }

  const dirty = !sameStringSet(selectedIds, selected);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white border-stone-200 text-stone-900 max-w-md max-h-[80vh] overflow-hidden flex flex-col font-sans rounded-[16px]">
        <DialogHeader className="mb-0">
          <DialogTitle className="font-serif text-xl font-normal text-stone-900">
            Manage Series — {label}
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
          ) : series.length === 0 ? (
            <p className="text-center text-stone-400 py-8">
              No series available
            </p>
          ) : (
            series.map((s) => {
              const isSelected = selected.has(s._id);
              return (
                <label
                  key={s._id}
                  className={`flex items-center gap-3 p-3 rounded-[14px] border cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-blue-50 border-blue-200"
                      : "bg-card border-border hover:border-foreground/30"
                  }`}
                >
                  <div className="relative h-12 w-12 flex-shrink-0">
                    {s.coverUrl ? (
                      <img
                        src={s.coverUrl}
                        alt=""
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-stone-100">
                        <Folder
                          className="h-5 w-5 text-stone-400"
                          aria-hidden="true"
                        />
                      </div>
                    )}
                    <span
                      aria-hidden="true"
                      className={`absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white transition-colors ${
                        isSelected
                          ? "bg-foreground text-background"
                          : "bg-white text-transparent border-stone-300"
                      }`}
                    >
                      <Check className="h-3 w-3" />
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{s.title}</p>
                    {s.description ? (
                      <p className="text-sm text-muted-foreground truncate">
                        {s.description}
                      </p>
                    ) : null}
                  </div>
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={isSelected}
                    onChange={() => toggle(s._id)}
                    aria-label={`Toggle ${s.title}`}
                  />
                </label>
              );
            })
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 mt-2 border-t border-stone-100">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={saving}
            className="h-10 px-4 text-sm font-medium"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={() => void handleSave()}
            loading={saving}
            disabled={saving || !dirty}
            className="h-10 px-4 text-sm font-medium"
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
