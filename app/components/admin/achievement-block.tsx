import { useEffect, useState } from "react";
import { Image as ImageIcon, Loader2, Plus, Trash2 } from "lucide-react";
import { ConfirmDialog } from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { toast } from "~/components/ui/toast";
import { env } from "~/lib/env";
import { toErrorMessage } from "~/lib/errors";
import { gqlClient } from "~/lib/graphql";
import { PinFindManyDocument } from "~/queries/pins";
import { PinUpdateOneDocument } from "~/mutations/pins";
import {
  AchievementDialog,
  type PinItem,
} from "~/components/admin/achievement-dialog";

export interface AchievementBlockProps {
  classId: string;
  curriculumId: string | null;
}

export function AchievementBlock({
  classId,
  curriculumId,
}: AchievementBlockProps) {
  const [pin, setPin] = useState<PinItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);
  const [removing, setRemoving] = useState(false);

  // Lazy fetch: this component mounts when the practice accordion expands.
  // The pin is client-owned — refetch locally, never route-revalidate.
  // `pin.class` is a scalar string id → plain equality (no array-filter gotcha).
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadError(null);
    gqlClient
      .request(PinFindManyDocument, {
        filter: { class: classId, platform: env.PLATFORM },
        limit: 1,
      })
      .then((data) => {
        if (cancelled) return;
        // Soft delete = non-null deletedAt — drop those rows client-side.
        const rows = (data.PinFindMany ?? []).filter((p) => !p.deletedAt);
        setPin(rows[0] ?? null);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setLoadError(
          toErrorMessage(err, "Failed to load achievement."),
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [classId, refreshKey]);

  function refetch() {
    setRefreshKey((k) => k + 1);
  }

  async function handleRemove() {
    if (!pin?._id) return;
    setRemoving(true);
    try {
      // Detach the relation — no pin delete endpoint exists, so unset the
      // class/curriculum so the pin no longer belongs to this practice.
      // TODO(pin-unset): verify backend honors null-unset on live test backend
      const data = await gqlClient.request(PinUpdateOneDocument, {
        filter: { _id: pin._id },
        record: { class: null, curriculum: null },
      });
      const payload = data.PinUpdateOne;
      const payloadError = (
        payload as { error?: { message?: string } | null } | null | undefined
      )?.error;
      if (payloadError?.message) throw new Error(payloadError.message);
      toast.success("Achievement removed");
      setRemoveOpen(false);
      refetch();
    } catch (err) {
      toast.error(
        toErrorMessage(err, "Failed to remove achievement"),
      );
    } finally {
      setRemoving(false);
    }
  }

  return (
    <div className="space-y-2">
      {loading ? (
        <div className="flex items-center gap-2 rounded-lg border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm text-stone-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading achievement…
        </div>
      ) : loadError ? (
        <div className="rounded-lg border-2 border-dashed border-red-200 bg-red-50 px-3 py-4 text-center">
          <p className="mb-1 text-sm font-medium text-red-700">
            Couldn't load achievement
          </p>
          <p className="text-xs text-red-600">{loadError}</p>
        </div>
      ) : pin ? (
        <div className="flex items-center gap-3 rounded-lg border border-stone-200 bg-stone-50 p-2">
          <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded border border-stone-200 bg-white">
            {pin.cover?.url ? (
              <img
                src={pin.cover.url}
                alt={pin.label ?? "Achievement cover"}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <ImageIcon className="h-4 w-4 text-stone-300" />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-stone-900">
              {pin.label || "Untitled"}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setRemoveOpen(true)}
            aria-label={`Remove ${pin.label || "achievement"}`}
            className="h-8 w-8 flex-shrink-0 text-red-500 hover:bg-red-50 hover:text-red-700"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ) : (
        <div className="rounded-lg border-2 border-dashed border-stone-200 bg-stone-50 px-3 py-6 text-center">
          <p className="mb-3 text-sm text-stone-500">
            No achievement for this practice yet
          </p>
          <Button
            size="sm"
            onClick={() => setDialogOpen(true)}
            className="bg-stone-900 text-white hover:bg-stone-800"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Achievement
          </Button>
        </div>
      )}

      <AchievementDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        classId={classId}
        curriculumId={curriculumId}
        onSaved={refetch}
      />

      <ConfirmDialog
        open={removeOpen}
        onOpenChange={(open) => {
          if (!open && !removing) setRemoveOpen(false);
        }}
        title="Remove achievement?"
        description={`"${pin?.label || "Untitled"}" will be detached from this practice.`}
        confirmLabel="Remove"
        variant="destructive"
        loading={removing}
        onConfirm={handleRemove}
      />
    </div>
  );
}

export default AchievementBlock;
