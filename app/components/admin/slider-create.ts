import type { SliderFileItem } from "~/components/admin/tap-slider-create-subform";
import {
  MAX_IMAGE_UPLOAD_BYTES,
  MAX_VIDEO_UPLOAD_BYTES,
} from "~/components/admin/tap-videos-subform";
import { payloadErrorMessage, toErrorMessage } from "~/lib/errors";
import { gqlClient } from "~/lib/graphql";
import { uploadWithProgress } from "~/lib/upload";
import { TapCreateOneDocument } from "~/mutations/taps";

/**
 * Per-file outcome of the slider multi-create. `ok: false` keeps the file name
 * (via `file`) and a display `error` so the caller can build a summary toast.
 */
export type SliderCreateResult = {
  file: File;
  ok: boolean;
  error?: string;
};

export interface RunSliderCreateParams {
  /** Parent practice id — becomes `tap.class`. */
  classId: string;
  /** Platform id (`env.PLATFORM`). */
  platform: string;
  /** Selected tap type value; resolves to the `slider` identifier. */
  type: string;
  /**
   * Base order to append after existing taps (the parent list length + 1). Each
   * file gets `max(1, round(defaultOrder)) + rowIndex`.
   */
  defaultOrder: number;
  /**
   * Title written onto each created tap (mirrors the type's config title, e.g.
   * "Slider" or "Preview"). Defaults to "Slider" when omitted.
   */
  title?: string;
  /** Max concurrent per-file pipelines (default 4). */
  concurrency?: number;
}

/**
 * Ordered, concurrency-bounded worker pool. Results are written back by index so
 * the returned array preserves input order regardless of completion order. The
 * worker must not reject (each per-file pipeline catches internally) — otherwise
 * a single failure would reject `Promise.all` and abort the remaining lanes.
 */
async function runPool<T, R>(
  items: readonly T[],
  concurrency: number,
  worker: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let cursor = 0;
  async function drain(): Promise<void> {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await worker(items[index]!, index);
    }
  }
  const laneCount = Math.min(Math.max(1, concurrency), items.length);
  await Promise.all(Array.from({ length: laneCount }, drain));
  return results;
}

/**
 * Create one `slider` tap per selected file (best-effort). Each file's target
 * `order` is `max(1, round(defaultOrder)) + rowIndex`, computed up front from the
 * current row order so the bounded pool's completion order can't scramble it.
 *
 * Per file:
 * 1. `TapCreateOne` — `slug` is OMITTED (an explicit null collides on the
 *    sparse-unique index, E11000; see CLAUDE.md). Payload errors are read via
 *    `payloadErrorMessage` and rethrown for `toErrorMessage`.
 * 2. Video file → `PUT /admin/tap-video` (`file` + tap `id`), same contract as
 *    `tap-videos-subform`. A failed upload after a successful create is still a
 *    per-file failure — the empty tap is left in place (best-effort, not rolled
 *    back), surfaced in the summary.
 * 3. Image file → `PUT /admin/tap-cover` (`file` + tap `id`), which writes the
 *    tap's top-level `cover` server-side (mirrors `/admin/tap-video`). Like the
 *    video branch, a failed upload after a successful create is a per-file
 *    failure — the empty tap is left in place (best-effort, not rolled back).
 *
 * Never throws per file; returns one `{ file, ok, error? }` per input, in order.
 */
export async function runSliderCreate(
  files: readonly SliderFileItem[],
  params: RunSliderCreateParams,
): Promise<SliderCreateResult[]> {
  const {
    classId,
    platform,
    type,
    defaultOrder,
    title = "Slider",
    concurrency = 4,
  } = params;
  const base = Math.max(1, Math.round(defaultOrder));

  return runPool(files, concurrency, async (item, index) => {
    const order = base + index;
    // Guard oversize uploads BEFORE creating the tap — otherwise the create
    // succeeds but the upload can't, leaving an orphan empty tap. Matches the
    // sibling subforms' client-side size guards (server is the real backstop).
    if (item.kind === "video" && item.file.size > MAX_VIDEO_UPLOAD_BYTES) {
      return {
        file: item.file,
        ok: false,
        error: "Media must be 500 MB or smaller.",
      } satisfies SliderCreateResult;
    }
    if (item.kind === "image" && item.file.size > MAX_IMAGE_UPLOAD_BYTES) {
      return {
        file: item.file,
        ok: false,
        error: "Image must be 5 MB or smaller.",
      } satisfies SliderCreateResult;
    }
    try {
      const data = await gqlClient.request(TapCreateOneDocument, {
        record: {
          class: classId,
          platform,
          type,
          title,
          order,
          points: 100,
          time: 5,
          videos: [],
          extraQuestions: [],
        },
      });
      const payloadError = payloadErrorMessage(data.TapCreateOne);
      if (payloadError) throw new Error(payloadError);
      const recordId =
        data.TapCreateOne?.recordId ?? data.TapCreateOne?.record?._id;
      if (!recordId) throw new Error("Content record was not created");

      const fd = new FormData();
      fd.append("file", item.file);
      fd.append("id", recordId);
      // Video → append a video subdoc; image → write the tap's top-level cover.
      // Both endpoints take (`file` + tap `id`) and persist server-side.
      await uploadWithProgress(
        item.kind === "video" ? "/admin/tap-video" : "/admin/tap-cover",
        fd,
      );

      return { file: item.file, ok: true } satisfies SliderCreateResult;
    } catch (err) {
      return {
        file: item.file,
        ok: false,
        error: toErrorMessage(err, "Failed to add slide"),
      } satisfies SliderCreateResult;
    }
  });
}
