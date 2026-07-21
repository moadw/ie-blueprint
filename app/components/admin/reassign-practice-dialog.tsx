import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import { Modal } from "~/components/ui/modal";
import { SeriesPicker } from "~/components/admin/series-picker";
import type { SeriesOption } from "~/components/admin/series-picker";
import { env } from "~/lib/env";
import { toErrorMessage } from "~/lib/errors";
import { gqlClient } from "~/lib/graphql";
import { CurriculumsFindManyDocument } from "~/queries/curriculums";
import { ClassesAdminFindManyDocument } from "~/queries/classes";
import { ClassesUpdateOneDocument } from "~/mutations/classes";
import { curriculumsSortEnum, SortFindManyclassesInput } from "~/gql/graphql";

export interface ReassignPracticeDialogProps {
  open: boolean;
  onClose: () => void;
  practice: { _id: string; title?: string | null; curriculum?: string | null };
  currentSeriesTitle: string | null;
  onReassigned: () => void;
}

/**
 * Move a practice (class) to another series (curriculum). Fetches the platform's
 * other series on open (mirrors the `achievement-dialog` on-open fetch), lets the
 * admin pick a target via `SeriesPicker`, then swaps to an in-Modal confirm step
 * (a `view: 'form' | 'confirm'` state — no nested dialog) before appending the
 * practice to the end of the target series (`order = max(order) + 1`).
 */
export function ReassignPracticeDialog({
  open,
  onClose,
  practice,
  currentSeriesTitle,
  onReassigned,
}: ReassignPracticeDialogProps) {
  const [series, setSeries] = useState<SeriesOption[]>([]);
  const [seriesLoading, setSeriesLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [view, setView] = useState<"form" | "confirm">("form");
  const [confirming, setConfirming] = useState(false);

  // On open: reset the flow, then fetch the platform's series (excluding the
  // practice's current one) — mirror `achievement-dialog`'s on-open fetch
  // exactly (cancelled flag, seriesLoading toggled true-before / false-in-finally).
  useEffect(() => {
    if (!open) return;
    setView("form");
    setSelectedId(null);
    setLoadError(null);
    let cancelled = false;
    setSeriesLoading(true);
    gqlClient
      .request(CurriculumsFindManyDocument, {
        filter: { platform: env.PLATFORM },
        limit: 200,
        sort: curriculumsSortEnum.ORDER_ASC,
      })
      .then((data) => {
        if (cancelled) return;
        const opts: SeriesOption[] = (data.CurriculumsFindMany ?? [])
          .filter((c): c is NonNullable<typeof c> => Boolean(c))
          .filter((c) => c._id !== practice.curriculum)
          .map((c) => ({
            _id: c._id,
            title: c.title ?? "Untitled series",
            description: c.description ?? null,
          }))
          .sort((a, b) => a.title.localeCompare(b.title));
        setSeries(opts);
      })
      .catch((err: unknown) => {
        if (!cancelled) setLoadError(toErrorMessage(err, "Failed to load series"));
      })
      .finally(() => {
        if (!cancelled) setSeriesLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open, practice.curriculum]);

  const practiceTitle = practice.title || "this practice";
  const targetTitle = series.find((s) => s._id === selectedId)?.title ?? "";

  async function handleConfirmMove() {
    if (!selectedId) return;
    const targetId = selectedId;
    setConfirming(true);
    try {
      // (a) Fetch the target series' classes to compute the append order. A
      //     failure here throws to the catch below — we abort before writing,
      //     so we never send an undefined/NaN order.
      const data = await gqlClient.request(ClassesAdminFindManyDocument, {
        filter: { curriculum: targetId, platform: env.PLATFORM },
        limit: 500,
        sort: [SortFindManyclassesInput.ORDER_ASC],
      });
      // (b) Safe next-order: guard the empty case so we never hit
      //     `Math.max(...[])` (= -Infinity).
      const orders = (data.ClassesAdminFindMany ?? [])
        .filter((c) => !c.deleted)
        .map((c) => c.order ?? 0);
      const nextOrder = orders.length ? Math.max(...orders) + 1 : 1;

      // (c) Move: only `curriculum` + `order` in the record (no slug / uniques).
      const moveData = await gqlClient.request(ClassesUpdateOneDocument, {
        _id: practice._id,
        record: { curriculum: targetId, order: nextOrder },
      });
      // (d) Inline payload-error throw (ErrorInterface has no resolveType).
      const payloadError = (
        moveData.ClassesUpdateOne as
          | { error?: { message?: string } | null }
          | null
          | undefined
      )?.error;
      if (payloadError?.message) throw new Error(payloadError.message);

      // (e) Success: toast, close, revalidate the source series.
      toast.success("Practice moved");
      onClose();
      onReassigned();
    } catch (err) {
      // Keep the Modal open on the confirm view so the admin can retry.
      toast.error(toErrorMessage(err, "Failed to move practice"));
    } finally {
      setConfirming(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={
        view === "form"
          ? `Reassign "${practiceTitle}" to a new series`
          : "Reassign practice"
      }
    >
      {view === "form" ? (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            This practice will be appended to the end of the selected series.
          </p>

          {loadError ? (
            <p
              className="rounded-lg border border-dashed border-red-300 px-3 py-2 text-sm text-red-600"
              role="alert"
            >
              {loadError}
            </p>
          ) : null}

          <SeriesPicker
            options={series}
            value={selectedId}
            onChange={(id) => setSelectedId(id)}
            loading={seriesLoading}
          />

          <div className="mt-2 flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              disabled={!selectedId || seriesLoading || Boolean(loadError)}
              onClick={() => setView("confirm")}
            >
              Save
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-foreground">
            Are you sure to continue moving{" "}
            <span className="font-medium">&ldquo;{practiceTitle}&rdquo;</span>{" "}
            from{" "}
            <span className="font-medium">
              &ldquo;{currentSeriesTitle ?? "current series"}&rdquo;
            </span>{" "}
            to <span className="font-medium">&ldquo;{targetTitle}&rdquo;</span>?
          </p>

          <div className="mt-2 flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setView("form")}
              disabled={confirming}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              loading={confirming}
              onClick={handleConfirmMove}
            >
              Yes
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}

export default ReassignPracticeDialog;
