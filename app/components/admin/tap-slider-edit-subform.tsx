import { useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { FileUp, ImagePlus, Loader2 } from "lucide-react";
import { Progress } from "~/components/ui/progress";
import { toast } from "~/components/ui/toast";
import { toErrorMessage } from "~/lib/errors";
import { cn } from "~/lib/utils";
import {
  MAX_VIDEO_UPLOAD_BYTES,
  uploadTapVideoAndRefetch,
  type VideoEntry,
} from "~/components/admin/tap-videos-subform";

/** Loose structural shape of the tap's top-level `cover` (query: `cover { url type }`). */
type TapCoverLike = { url?: string | null; type?: string | null } | null;

export interface TapSliderEditSubformProps {
  /** Tap `_id` (edit mode always has one). Needed for the video upload + refetch. */
  tapId: string | null;
  /**
   * The tap's stored videos as editable form state (owned by `TapDialog`, the
   * same state its Save serializes). A non-empty `videos[0]` selects the video
   * branch; the outer Save persists it via `TapUpdateOne` (wholesale replace,
   * `_id` echoed).
   */
  videos: VideoEntry[];
  onVideosChange: (
    update: VideoEntry[] | ((prev: VideoEntry[]) => VideoEntry[]),
  ) => void;
  /** The tap's stored top-level cover. Display-only in pass 1 (see below). */
  cover?: TapCoverLike;
  /**
   * Notifies the parent whenever a video upload starts/stops. The parent can't
   * otherwise see this subform's local `uploading` state, so it uses this to
   * disable Save/Cancel mid-upload (clicking Save then would wholesale-replace
   * `videos` with the stale entry and drop the just-uploaded video).
   */
  onUploadingChange?: (uploading: boolean) => void;
}

/**
 * Media-only edit form for a single existing "slider" tap. Shows exactly ONE
 * field, chosen by the stored media — never both:
 *
 * - `videos[0]` present → replace-video (upload → `PUT /admin/tap-video` →
 *   refetch → persist via the outer `TapUpdateOne`, `videos` wholesale-replaced
 *   with `_id` echoed).
 * - Otherwise → the cover field (image). GATED in pass 1: `PUT /admin/tap-cover`
 *   is not shipped, so the replace control is disabled ("coming soon"). This
 *   covers both a tap that already has `cover.url` (shows the image) and the
 *   common empty image-placeholder created from an image in the multi-create.
 *   *Edge case:* a video slider tap whose upload failed is also empty and lands
 *   here — acceptable for pass 1 (admin can delete + recreate).
 *
 * Deliberately media-only: no narrators / captions / thumbnail UI, unlike the
 * full `TapVideosSubform`.
 */
export function TapSliderEditSubform({
  tapId,
  videos,
  onVideosChange,
  cover,
  onUploadingChange,
}: TapSliderEditSubformProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  // Tracks the fallback blob URL created when the post-upload refetch fails, so
  // the unmount cleanup can revoke it (an in-flight replacement revokes the
  // prior blob below, so at unmount only the latest can still be live).
  const fallbackUrlRef = useRef<string | null>(null);

  // Surface the in-flight upload state to the parent (disables Save/Cancel).
  useEffect(() => {
    onUploadingChange?.(uploading);
  }, [uploading, onUploadingChange]);

  // Revoke a lingering fallback blob URL on unmount so it doesn't leak.
  useEffect(() => {
    return () => {
      if (fallbackUrlRef.current) URL.revokeObjectURL(fallbackUrlRef.current);
    };
  }, []);

  const videoEntry = videos[0] ?? null;
  const hasVideo = Boolean(videoEntry && (videoEntry.url.trim() || videoEntry._id));
  const coverUrl = cover?.url?.trim() ?? "";

  async function handleReplaceVideo(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !tapId || uploading) return;
    if (file.size > MAX_VIDEO_UPLOAD_BYTES) {
      toast.error("Media must be 500 MB or smaller.");
      return;
    }
    setUploading(true);
    setUploadProgress(0);
    try {
      // Track the ids we already had so a freshly-appended subdoc is picked over
      // a same-`_id` in-place update (matches the multi-entry media subform).
      const priorIds = new Set(
        videos.map((v) => v._id).filter((id): id is string => Boolean(id)),
      );
      const serverVideos = await uploadTapVideoAndRefetch(
        tapId,
        file,
        videoEntry?._id ?? null,
        (pct) => setUploadProgress(pct),
      );
      const canonical =
        serverVideos?.find((s) => s._id && !priorIds.has(s._id)) ??
        (videoEntry?._id
          ? serverVideos?.find((s) => s._id === videoEntry._id)
          : undefined) ??
        null;

      // Side effects (allocate/revoke object URLs) stay out of the state update.
      const prevUrl = videoEntry?.url ?? "";
      const fallbackUrl = canonical ? null : URL.createObjectURL(file);
      if (prevUrl.startsWith("blob:")) URL.revokeObjectURL(prevUrl);
      // Remember the live fallback blob (if any) so the unmount cleanup revokes
      // it. On success `fallbackUrl` is null and the prior blob was revoked
      // above, so there's nothing left to clean up.
      fallbackUrlRef.current = fallbackUrl;

      if (canonical) {
        onVideosChange([canonical]);
      } else {
        // Refetch failed — keep a local preview. The upload persisted, so
        // reopening the tap will show the server video.
        onVideosChange([
          {
            _id: videoEntry?._id ?? null,
            url: fallbackUrl ?? prevUrl,
            type: videoEntry?.type.trim() ? videoEntry.type : file.type,
            narrator: videoEntry?.narrator ?? [],
            captions: videoEntry?.captions ?? [],
            thumbnailUrl: videoEntry?.thumbnailUrl ?? null,
          },
        ]);
      }
      toast.success("Media uploaded");
    } catch (err) {
      toast.error(toErrorMessage(err, "Media upload failed"));
    } finally {
      setUploadProgress(null);
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-muted-foreground">Media</p>
      <div className="rounded-lg border border-border bg-card p-3 space-y-3">
        {hasVideo ? (
          <>
            {videoEntry?.url.trim() ? (
              <video
                controls
                src={videoEntry.url}
                className="aspect-video w-full rounded-md bg-black object-contain"
              />
            ) : null}
            <div className="flex flex-wrap items-center gap-3">
              <label
                className={cn(
                  "inline-flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-border bg-card px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-foreground/30 focus-within:ring-2 focus-within:ring-primary/30",
                  uploading && "pointer-events-none opacity-60",
                )}
              >
                {uploading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <FileUp className="h-3.5 w-3.5" aria-hidden="true" />
                )}
                Replace media
                <input
                  type="file"
                  accept="video/mp4"
                  className="sr-only"
                  disabled={uploading}
                  onChange={handleReplaceVideo}
                />
              </label>
            </div>
            {uploading ? (
              <Progress
                value={uploadProgress ?? 0}
                aria-label="Media upload progress"
              />
            ) : null}
          </>
        ) : (
          <>
            {coverUrl ? (
              <img
                src={coverUrl}
                alt="Slide cover"
                className="aspect-video w-full rounded-md bg-black object-contain"
              />
            ) : (
              <div className="flex aspect-video w-full items-center justify-center rounded-md border border-dashed border-border bg-muted text-xs text-muted-foreground">
                No image yet
              </div>
            )}
            {/* TODO(tap-cover): un-gate once `PUT /admin/tap-cover` ships — on
                select, upload the image, refetch, and persist `cover { url type }`
                via the outer TapUpdateOne (do NOT use POST /admin/upload-image). */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex cursor-not-allowed items-center gap-2 rounded-md border border-dashed border-border bg-card px-3 py-2 text-xs text-muted-foreground opacity-60">
                <ImagePlus className="h-3.5 w-3.5" aria-hidden="true" />
                Replace image
              </span>
              <span className="text-xs text-stone-400">Coming soon</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default TapSliderEditSubform;
