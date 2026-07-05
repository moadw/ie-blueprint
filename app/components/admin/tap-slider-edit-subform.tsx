import { useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { FileUp, ImagePlus, Loader2 } from "lucide-react";
import { Progress } from "~/components/ui/progress";
import { toast } from "~/components/ui/toast";
import { toErrorMessage } from "~/lib/errors";
import { cn } from "~/lib/utils";
import {
  MAX_IMAGE_UPLOAD_BYTES,
  MAX_VIDEO_UPLOAD_BYTES,
  uploadTapCoverAndRefetch,
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
  /** The tap's stored top-level cover — seeds the editable image field. */
  cover?: TapCoverLike;
  /**
   * Notifies the parent whenever a media upload starts/stops. The parent can't
   * otherwise see this subform's local `uploading` state, so it uses this to
   * disable Save/Cancel mid-upload (clicking Save then would wholesale-replace
   * `videos` with the stale entry and drop the just-uploaded video; the cover
   * write persists server-side but disabling Save/Cancel is still correct UX).
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
 * - Otherwise → the cover field (image): current `<img>` preview + an add/replace
 *   control → `PUT /admin/tap-cover` (file + tap id, writes `tap.cover`
 *   server-side) → refetch for the canonical url. Persists immediately and
 *   independently of the outer `TapUpdateOne` (which never sends `cover`, so it
 *   can't wipe it). Covers both a tap that already has `cover.url` and the common
 *   empty image-placeholder created from an image in the multi-create.
 *   *Edge case:* a video slider tap whose upload failed is also empty and lands
 *   here — acceptable (the admin can add an image, or delete + recreate).
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

  // A cover uploaded in THIS edit session (the dialog doesn't refetch the tap
  // after our upload, so the `cover` prop stays stale — our local value wins).
  // Tied to `tapId` so switching to a different tap drops the stale local value
  // instead of showing the previous tap's image.
  const [uploadedCover, setUploadedCover] = useState<{
    tapId: string;
    url: string;
  } | null>(null);
  const coverUrl =
    uploadedCover && uploadedCover.tapId === tapId
      ? uploadedCover.url
      : (cover?.url?.trim() ?? "");

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

  async function handleReplaceImage(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !tapId || uploading) return;
    if (file.size > MAX_IMAGE_UPLOAD_BYTES) {
      toast.error("Image must be 5 MB or smaller.");
      return;
    }
    setUploading(true);
    setUploadProgress(0);
    try {
      const result = await uploadTapCoverAndRefetch(tapId, file, (pct) =>
        setUploadProgress(pct),
      );
      // Revoke any prior fallback blob before swapping in the new preview.
      if (fallbackUrlRef.current) {
        URL.revokeObjectURL(fallbackUrlRef.current);
        fallbackUrlRef.current = null;
      }
      if (result) {
        setUploadedCover({ tapId, url: result.url });
      } else {
        // Refetch failed — the upload persisted server-side, so show a local
        // preview until the tap is reopened. Track the blob for unmount cleanup.
        const blobUrl = URL.createObjectURL(file);
        fallbackUrlRef.current = blobUrl;
        setUploadedCover({ tapId, url: blobUrl });
      }
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(toErrorMessage(err, "Image upload failed"));
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
                  <ImagePlus className="h-3.5 w-3.5" aria-hidden="true" />
                )}
                {coverUrl ? "Replace image" : "Add image"}
                <input
                  type="file"
                  accept="image/jpeg,image/webp,image/png"
                  className="sr-only"
                  disabled={uploading}
                  onChange={handleReplaceImage}
                />
              </label>
            </div>
            {uploading ? (
              <Progress
                value={uploadProgress ?? 0}
                aria-label="Image upload progress"
              />
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}

export default TapSliderEditSubform;
