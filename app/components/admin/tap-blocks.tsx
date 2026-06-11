import { useEffect, useState } from "react";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { ConfirmDialog } from "~/components/ui/alert-dialog";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { toast } from "~/components/ui/toast";
import { env } from "~/lib/env";
import { gqlClient } from "~/lib/graphql";
import { TapFindManyDocument, TapTypeFindManyDocument } from "~/queries/taps";
import { TapUpdateOneDocument } from "~/mutations/taps";
import { SortFindManytapInput } from "~/gql/graphql";
import type { TapTypeFindManyQuery } from "~/gql/graphql";
import { TapDialog, type TapItem } from "~/components/admin/tap-dialog";

type TapTypeItem = TapTypeFindManyQuery["TapTypeFindMany"][number];

export interface TapBlocksProps {
  classId: string;
}

export function TapBlocks({ classId }: TapBlocksProps) {
  const [taps, setTaps] = useState<TapItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const [tapTypes, setTapTypes] = useState<TapTypeItem[]>([]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<TapItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TapItem | null>(null);
  const [deleting, setDeleting] = useState(false);

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
          err instanceof Error ? err.message : "Failed to load content.",
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [classId, refreshKey]);

  // Tap type labels are best-effort decoration: on failure the rows fall
  // back to the raw `type` string.
  useEffect(() => {
    let cancelled = false;
    gqlClient
      .request(TapTypeFindManyDocument, { limit: 100 })
      .then((data) => {
        if (cancelled) return;
        setTapTypes(data.TapTypeFindMany ?? []);
      })
      .catch(() => {
        /* fall back to raw type strings */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function refetch() {
    setRefreshKey((k) => k + 1);
  }

  function typeLabel(tap: TapItem): string | null {
    if (!tap.type) return null;
    const match = tapTypes.find(
      (tt) => tt.identifier === tap.type || tt._id === tap.type,
    );
    return match?.label ?? match?.identifier ?? tap.type;
  }

  function openCreate() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(tap: TapItem) {
    setEditing(tap);
    setDialogOpen(true);
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
        err instanceof Error ? err.message : "Failed to delete content",
      );
    } finally {
      setDeleting(false);
    }
  }

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
          {taps.map((tap, index) => {
            const label = typeLabel(tap);
            const meta = [
              tap.points != null ? `${tap.points} pts` : null,
              tap.time != null ? `${tap.time} min` : null,
            ]
              .filter(Boolean)
              .join(" · ");
            return (
              <div
                key={tap._id ?? `tap-${index}`}
                className="flex items-center gap-3 rounded-lg border border-stone-200 bg-stone-50 p-2"
              >
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded border border-stone-200 bg-white text-xs font-semibold text-stone-700">
                  {Math.max(1, Math.round(tap.order ?? index + 1))}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-stone-900">
                    {tap.title || "Untitled"}
                  </p>
                  <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
                    {label ? (
                      <Badge
                        shape="tag"
                        className="bg-transparent text-stone-500 border-stone-300"
                      >
                        {label}
                      </Badge>
                    ) : null}
                    {meta ? (
                      <span className="text-xs text-stone-400">{meta}</span>
                    ) : null}
                  </div>
                </div>
                <div className="flex flex-shrink-0 gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEdit(tap)}
                    aria-label={`Edit ${tap.title || "content"}`}
                    className="h-8 w-8 text-stone-500 hover:bg-stone-100 hover:text-stone-700"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteTarget(tap)}
                    aria-label={`Delete ${tap.title || "content"}`}
                    className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-700"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}
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
        onOpenChange={setDialogOpen}
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
