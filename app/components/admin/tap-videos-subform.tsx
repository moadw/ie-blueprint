import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import { FileUp, ImagePlus, Loader2, Plus, X } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Progress } from "~/components/ui/progress";
import { Switch } from "~/components/ui/switch";
import { toast } from "~/components/ui/toast";
import { api } from "~/lib/api";
import { env } from "~/lib/env";
import { uploadWithProgress } from "~/lib/upload";
import { gqlClient } from "~/lib/graphql";
import { cn } from "~/lib/utils";
import { NarratorsFindManyDocument } from "~/queries/narrators";
import type { narratorsFindManyQuery, tapVideosInput } from "~/gql/graphql";

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
// TODO(tap-video-endpoint): confirm real server limit; 500MB is a generous
// client guard so valid uploads aren't blocked — server is the real backstop.
const MAX_VIDEO_UPLOAD_BYTES = 500 * 1024 * 1024;

// Unambiguous audio file extensions, used to recognize an audio entry from a
// pasted URL when the MIME `type` is unknown (uploads set `type` from the
// file; free-text URLs usually don't). `.ogg`/`.opus` are treated as audio;
// `.webm`/`.mp4` stay video.
const AUDIO_EXTENSIONS = new Set([
  "mp3",
  "m4a",
  "aac",
  "wav",
  "ogg",
  "oga",
  "opus",
  "flac",
  "weba",
  "wma",
]);

/**
 * Whether an entry should render with an `<audio>` player instead of
 * `<video>`. Trust the MIME `type` first; fall back to the URL's file
 * extension (e.g. `.mp3`) when the type is unknown.
 */
function isAudioEntry(entry: { type: string; url: string }): boolean {
  if (entry.type.startsWith("audio/")) return true;
  if (entry.type.startsWith("video/")) return false;
  const path = entry.url.split(/[?#]/)[0] ?? "";
  const file = path.split("/").pop() ?? "";
  const ext = file.includes(".") ? (file.split(".").pop() ?? "").toLowerCase() : "";
  return AUDIO_EXTENSIONS.has(ext);
}

type NarratorItem = narratorsFindManyQuery["narratorsFindMany"][number];

export type CaptionEntry = {
  language: string;
  available: boolean;
  /**
   * Display-only: the server caption file URL (or a local object URL right
   * after an upload). Never written back via GraphQL — the REST caption
   * endpoint owns `captions[].file`.
   */
  fileUrl: string | null;
};

export type VideoEntry = {
  /**
   * Server-assigned subdocument id — null until the tap is first saved.
   * Must be re-sent on every save: subdocument arrays are replaced
   * wholesale on update, and dropping `_id` breaks the thumbnail/caption
   * references keyed to it.
   */
  _id: string | null;
  url: string;
  /** File MIME format, e.g. "video/mp4". */
  type: string;
  /** Skip offset held as a string for the number input (empty = unset). */
  skip: string;
  /** Selected narrator `_id`s. */
  narrator: string[];
  captions: CaptionEntry[];
  /** Display-only thumbnail URL; the REST cover endpoint owns writes. */
  thumbnailUrl: string | null;
};

/** Structural shape of `tap.videos[]` rows from TapFindMany (typed loosely
 * to avoid a type-import cycle with tap-dialog.tsx). */
type TapVideoLike = {
  _id?: string | null;
  url?: string | null;
  skip?: number | null;
  type?: string | null;
  narrator?: Array<string | null> | null;
  thumbnail?: { url?: string | null } | null;
  captions?: Array<{
    language?: string | null;
    available?: boolean | null;
    file?: { url?: string | null } | null;
  } | null> | null;
};

/** Map `tap.videos` from the query into editable form state (drops
 * `__typename`s, normalizes nulls). */
export function videoEntriesFromTap(
  videos: Array<TapVideoLike | null> | null | undefined,
): VideoEntry[] {
  return (videos ?? []).flatMap((video) => {
    if (!video) return [];
    return [
      {
        _id: video._id ?? null,
        url: video.url ?? "",
        type: video.type ?? "",
        skip: video.skip != null ? String(video.skip) : "",
        narrator: (video.narrator ?? []).filter((id): id is string =>
          Boolean(id),
        ),
        captions: (video.captions ?? []).flatMap((caption) => {
          if (!caption) return [];
          return [
            {
              language: caption.language ?? "",
              available: caption.available ?? false,
              fileUrl: caption.file?.url ?? null,
            },
          ];
        }),
        thumbnailUrl: video.thumbnail?.url ?? null,
      },
    ];
  });
}

function parseOptionalNumber(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}

/**
 * Only a real server-assigned URL (http/https) is eligible to be echoed
 * back. A fresh upload swaps `thumbnailUrl`/`fileUrl` for a local
 * `blob:`/`data:` object URL (preview only); echoing that to the server
 * would persist a dead local reference, so we drop anything non-http.
 */
function persistableUrl(url: string | null): string | null {
  if (!url) return null;
  return /^https?:\/\//i.test(url) ? url : null;
}

/**
 * Serialize form entries to the `tapVideosInput` shape for create/update.
 * Existing `_id`s are re-sent (subdocument arrays are replaced wholesale).
 *
 * Cover-persistence fix (verify-before-fix, change #3): the whole `videos`
 * array is replaced on every `TapUpdateOne`, so previously we dropped the
 * REST-owned `thumbnail` / `captions[].file` and a later tap save wiped
 * them. The `tapVideosInput` / `UpdateByIdtapInput` schemas DO accept
 * `thumbnail` and `captions[].file` (graphql.ts:11231-11250, 8474-8487),
 * so we echo back the EXISTING server value when present — we never write
 * new upload values from the form (the REST endpoints still own uploads).
 * This makes the wholesale array replace non-destructive.
 *
 * NOTE: the live upload→save→reload persistence probe is still pending
 * manual verification (no test backend available to this step).
 */
export function serializeVideoEntries(entries: VideoEntry[]): tapVideosInput[] {
  return entries
    // Drop entries with neither a server `_id` nor a persistable (http) url:
    // an empty row, or one whose only content is a just-uploaded file. The
    // /admin/tap-video upload already created that subdocument server-side, so
    // re-sending it here without an `_id` would duplicate it (the canonical
    // row, with its `_id` + url, arrives on the next refetch/reopen).
    .filter((entry) => Boolean(entry._id) || Boolean(persistableUrl(entry.url)))
    .map((entry) => {
    const thumbnailUrl = persistableUrl(entry.thumbnailUrl);
    return {
      ...(entry._id ? { _id: entry._id } : {}),
      // A fresh upload sets `url` to a local `blob:` preview; like the cover
      // and caption, drop non-http urls so we never persist a dead local
      // reference (the canonical server url arrives via refetch/reopen).
      url: persistableUrl(entry.url.trim() || null),
      skip: parseOptionalNumber(entry.skip),
      type: entry.type.trim() || null,
      narrator: entry.narrator,
      // Echo back the server-assigned cover so the array replace can't wipe it.
      ...(thumbnailUrl ? { thumbnail: { url: thumbnailUrl } } : {}),
      captions: entry.captions.map((caption) => {
        const fileUrl = persistableUrl(caption.fileUrl);
        return {
          language: caption.language.trim() || null,
          available: caption.available,
          // Echo back the server-assigned caption file when present.
          ...(fileUrl ? { file: { url: fileUrl } } : {}),
        };
      }),
    };
  });
}

function emptyVideoEntry(): VideoEntry {
  return {
    _id: null,
    url: "",
    type: "",
    skip: "",
    narrator: [],
    captions: [],
    thumbnailUrl: null,
  };
}

export interface TapVideosSubformProps {
  value: VideoEntry[];
  /**
   * Accepts a plain array or a functional updater (a `useState` setter can
   * be passed directly) so async upload callbacks can't clobber edits made
   * while a request was in flight.
   */
  onChange: (
    update: VideoEntry[] | ((prev: VideoEntry[]) => VideoEntry[]),
  ) => void;
  /**
   * Tap `_id` in edit mode; null in create mode. The video FILE upload only
   * needs the tap id (the endpoint creates the video subdoc). Cover/caption
   * additionally need the server-assigned video `_id`, so they stay disabled
   * until the entry has been saved once.
   */
  tapId?: string | null;
  /**
   * The tap's type identifier (e.g. "video", "full-audio"). The video FILE
   * upload is available for any media tap, but the cover (thumbnail) and
   * captions are only shown for `type === "video"`.
   */
  tapType?: string | null;
}

export function TapVideosSubform({
  value,
  onChange,
  tapId,
  tapType,
}: TapVideosSubformProps) {
  const isVideoType = (tapType ?? "").trim() === "video";
  const [narrators, setNarrators] = useState<NarratorItem[]>([]);
  const [narratorsLoading, setNarratorsLoading] = useState(true);
  const [narratorsError, setNarratorsError] = useState(false);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  // Upload-progress percentage (0–100) for the single in-flight upload, or
  // null when idle. Single-flight is preserved via `uploadingKey`; only the
  // video upload feeds this (the thumbnail/caption uploads have no progress UI).
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  // Fetch narrators once on mount — the subform mounts when the dialog
  // opens (fetch-on-open precedent: ManageSeriesDialog).
  useEffect(() => {
    let cancelled = false;
    setNarratorsLoading(true);
    gqlClient
      .request(NarratorsFindManyDocument, {
        filter: { platform: env.PLATFORM },
        limit: 100,
      })
      .then((data) => {
        if (cancelled) return;
        setNarrators(data.narratorsFindMany ?? []);
        setNarratorsError(false);
      })
      .catch(() => {
        if (!cancelled) setNarratorsError(true);
      })
      .finally(() => {
        if (!cancelled) setNarratorsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function addEntry() {
    onChange((prev) => [...prev, emptyVideoEntry()]);
  }

  function removeEntry(index: number) {
    onChange((prev) => prev.filter((_, i) => i !== index));
  }

  function patchEntry(index: number, patch: Partial<VideoEntry>) {
    onChange((prev) =>
      prev.map((entry, i) => (i === index ? { ...entry, ...patch } : entry)),
    );
  }

  function toggleNarrator(index: number, narratorId: string) {
    onChange((prev) =>
      prev.map((entry, i) =>
        i === index
          ? {
              ...entry,
              narrator: entry.narrator.includes(narratorId)
                ? entry.narrator.filter((id) => id !== narratorId)
                : [...entry.narrator, narratorId],
            }
          : entry,
      ),
    );
  }

  function addCaption(index: number) {
    onChange((prev) =>
      prev.map((entry, i) =>
        i === index
          ? {
              ...entry,
              captions: [
                ...entry.captions,
                { language: "", available: false, fileUrl: null },
              ],
            }
          : entry,
      ),
    );
  }

  function removeCaption(videoIndex: number, captionIndex: number) {
    onChange((prev) =>
      prev.map((entry, i) =>
        i === videoIndex
          ? {
              ...entry,
              captions: entry.captions.filter((_, ci) => ci !== captionIndex),
            }
          : entry,
      ),
    );
  }

  function patchCaption(
    videoIndex: number,
    captionIndex: number,
    patch: Partial<CaptionEntry>,
  ) {
    onChange((prev) =>
      prev.map((entry, i) =>
        i === videoIndex
          ? {
              ...entry,
              captions: entry.captions.map((caption, ci) =>
                ci === captionIndex ? { ...caption, ...patch } : caption,
              ),
            }
          : entry,
      ),
    );
  }

  async function handleThumbnailChange(
    index: number,
    e: ChangeEvent<HTMLInputElement>,
  ) {
    const file = e.target.files?.[0];
    e.target.value = "";
    const entry = value[index];
    const videoId = entry?._id;
    if (!file || !tapId || !videoId || uploadingKey) return;
    if (file.size > MAX_UPLOAD_BYTES) {
      toast.error("Thumbnail must be 5 MB or smaller.");
      return;
    }
    const key = `thumb-${index}`;
    setUploadingKey(key);
    try {
      const fd = new FormData();
      // Endpoint contract: `id` = tap _id, `video` = video subdocument _id.
      fd.append("file", file);
      fd.append("id", tapId);
      fd.append("video", videoId);
      await api("/admin/tap-video-cover", { method: "PUT", body: fd });
      // Local preview — the canonical server URL arrives on the next
      // tap refetch (the list refetches on dialog save/close).
      const previewUrl = URL.createObjectURL(file);
      onChange((prev) =>
        prev.map((v, i) =>
          i === index ? { ...v, thumbnailUrl: previewUrl } : v,
        ),
      );
      toast.success("Thumbnail uploaded");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Thumbnail upload failed",
      );
    } finally {
      setUploadingKey(null);
    }
  }

  async function handleCaptionFileChange(
    videoIndex: number,
    captionIndex: number,
    e: ChangeEvent<HTMLInputElement>,
  ) {
    const file = e.target.files?.[0];
    e.target.value = "";
    const entry = value[videoIndex];
    const caption = entry?.captions[captionIndex];
    const videoId = entry?._id;
    if (!file || !tapId || !videoId || !caption || uploadingKey) return;
    if (file.size > MAX_UPLOAD_BYTES) {
      toast.error("Caption file must be 5 MB or smaller.");
      return;
    }
    const language = caption.language.trim();
    if (!language) {
      toast.error("Set the caption language before uploading.");
      return;
    }
    const key = `caption-${videoIndex}-${captionIndex}`;
    setUploadingKey(key);
    try {
      const fd = new FormData();
      // Endpoint contract: `id` = tap _id, `video` = video subdocument _id.
      fd.append("file", file);
      fd.append("id", tapId);
      fd.append("video", videoId);
      fd.append("available", String(caption.available));
      fd.append("language", language);
      await api("/admin/tap-video-caption", { method: "PUT", body: fd });
      const uploadedUrl = URL.createObjectURL(file);
      onChange((prev) =>
        prev.map((v, i) =>
          i === videoIndex
            ? {
                ...v,
                captions: v.captions.map((c, ci) =>
                  ci === captionIndex ? { ...c, fileUrl: uploadedUrl } : c,
                ),
              }
            : v,
        ),
      );
      toast.success("Caption uploaded");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Caption upload failed",
      );
    } finally {
      setUploadingKey(null);
    }
  }

  async function handleVideoFileChange(
    index: number,
    e: ChangeEvent<HTMLInputElement>,
  ) {
    const file = e.target.files?.[0];
    e.target.value = "";
    const entry = value[index];
    const videoId = entry?._id;
    if (!file || !tapId || uploadingKey) return;
    if (file.size > MAX_VIDEO_UPLOAD_BYTES) {
      toast.error("Video must be 500 MB or smaller.");
      return;
    }
    const key = `video-${index}`;
    setUploadingKey(key);
    setUploadProgress(0);
    try {
      const fd = new FormData();
      // Endpoint contract (verified via /doc): `id` = tap _id + `file` only.
      // The upload creates the tap's video subdocument, so it works before the
      // entry has its own `_id` (only the tap must be saved). When replacing an
      // existing entry, pass its `video` _id so the backend updates that subdoc
      // instead of creating another.
      fd.append("file", file);
      fd.append("id", tapId);
      if (videoId) fd.append("video", videoId);
      const res = await uploadWithProgress<{ url?: string }>(
        "/admin/tap-video",
        fd,
        { onProgress: (pct) => setUploadProgress(pct) },
      );
      // The endpoint response shape is unconfirmed; use a server-assigned
      // http(s) url if present, else a local blob preview. `persistableUrl`
      // reuses the http(s) test, and (paired with the serialize-side
      // `persistableUrl` on `url`) guarantees a blob preview is never
      // persisted — the canonical server url arrives on the next tap
      // refetch/reopen (consistent with the thumbnail/caption flow).
      const newUrl = persistableUrl(res?.url ?? null) ?? URL.createObjectURL(file);
      onChange((prev) =>
        prev.map((v, i) =>
          i === index
            ? { ...v, url: newUrl, type: v.type.trim() ? v.type : file.type }
            : v,
        ),
      );
      toast.success("Video uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Video upload failed");
    } finally {
      setUploadProgress(null);
      setUploadingKey(null);
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">Videos</p>
        <Button
          variant="ghost"
          size="sm"
          onClick={addEntry}
          disabled={uploadingKey !== null}
          className="h-7 px-2 text-xs text-stone-500 hover:text-stone-700"
        >
          <Plus className="h-3 w-3" />
          Add video
        </Button>
      </div>

      {value.length === 0 ? (
        <p className="text-xs text-stone-400">No videos yet.</p>
      ) : (
        <div className="space-y-3">
          {value.map((entry, vi) => {
            // Cover/caption target an existing video subdocument, so they need
            // both the tap and the entry's server `_id`. The video FILE upload
            // only needs the tap (the /admin/tap-video endpoint creates the
            // subdoc from `id` + `file`), so it unlocks as soon as the tap is
            // saved — even for a freshly-added entry.
            const canUpload = Boolean(tapId && entry._id);
            const canUploadVideo = Boolean(tapId);
            const thumbUploading = uploadingKey === `thumb-${vi}`;
            const videoUploading = uploadingKey === `video-${vi}`;
            // Detail fields stay hidden until the entry has a url (set by
            // paste now, by upload in Phase 3). The header, URL input, and
            // inline preview remain visible so a url can always be set.
            const hasUrl = entry.url.trim().length > 0;
            return (
              <div
                key={vi}
                className="rounded-lg border border-stone-200 bg-stone-50/40 p-3 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                    Video {vi + 1}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeEntry(vi)}
                    // Disabled during any in-flight upload: removing an entry
                    // would shift array indices out from under the index-keyed
                    // upload handler, landing the result on the wrong row.
                    disabled={uploadingKey !== null}
                    aria-label={`Remove video ${vi + 1}`}
                    className="h-7 w-7 text-stone-400 hover:bg-stone-100 hover:text-red-600"
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label
                    htmlFor={`tap-video-${vi}-url`}
                    className="text-xs font-medium text-muted-foreground"
                  >
                    URL
                  </Label>
                  {/* Free-text URL is kept alongside the upload control below
                      (decision: both paths — paste a url or upload a file). */}
                  <Input
                    id={`tap-video-${vi}-url`}
                    value={entry.url}
                    onChange={(e) => patchEntry(vi, { url: e.target.value })}
                    placeholder="https://bucket.s3.amazonaws.com/video.mp4"
                    className="h-9 text-sm"
                  />
                  {/* Inline native preview — `controls` only, no autoplay or
                      custom transport. Skipped entirely for an empty URL so we
                      never mount a broken `<video src="">`. */}
                  {entry.url.trim() ? (
                    isAudioEntry(entry) ? (
                      // Native audio players read as bare on the card; frame it
                      // in a white box — the transport centered on both axes
                      // with extra side padding so it doesn't run to the edges.
                      <div className="flex min-h-16 items-center justify-center rounded-md border border-border bg-card px-6 py-3">
                        <audio controls src={entry.url} className="w-full max-w-md" />
                      </div>
                    ) : (
                      // Video preview: a 16:9 framed box, letterboxed on black
                      // so any source ratio fits without cropping.
                      <video
                        controls
                        src={entry.url}
                        className="aspect-video w-full rounded-md bg-black object-contain"
                      />
                    )
                  ) : null}
                  {/* Upload control (always-visible — must show before any url
                      exists). Mirrors the thumbnail control's dashed-label
                      styling and "Save first to upload" hint. Free-text URL
                      input above is kept (decision: both paths). */}
                  <div className="flex flex-wrap items-center gap-3">
                    {canUploadVideo ? (
                      <label
                        className={cn(
                          "inline-flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-border bg-card px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-foreground/30 focus-within:ring-2 focus-within:ring-primary/30",
                          videoUploading && "pointer-events-none opacity-60",
                        )}
                      >
                        {videoUploading ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <FileUp
                            className="h-3.5 w-3.5"
                            aria-hidden="true"
                          />
                        )}
                        {entry.url.trim() ? "Replace video" : "Upload video"}
                        <input
                          type="file"
                          accept="video/*,audio/*"
                          className="sr-only"
                          disabled={videoUploading}
                          onChange={(e) => handleVideoFileChange(vi, e)}
                        />
                      </label>
                    ) : (
                      <>
                        <span className="inline-flex cursor-not-allowed items-center gap-2 rounded-md border border-dashed border-border bg-card px-3 py-2 text-xs text-muted-foreground opacity-60">
                          <FileUp
                            className="h-3.5 w-3.5"
                            aria-hidden="true"
                          />
                          Upload video
                        </span>
                        <span className="text-xs text-stone-400">
                          Save first to upload
                        </span>
                      </>
                    )}
                  </div>
                  {videoUploading ? (
                    <Progress
                      value={uploadProgress ?? 0}
                      aria-label="Video upload progress"
                    />
                  ) : null}
                </div>

                {hasUrl ? (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1.5">
                        <Label
                          htmlFor={`tap-video-${vi}-type`}
                          className="text-xs font-medium text-muted-foreground"
                        >
                          Format
                        </Label>
                        <Input
                          id={`tap-video-${vi}-type`}
                          value={entry.type}
                          onChange={(e) =>
                            patchEntry(vi, { type: e.target.value })
                          }
                          placeholder="video/mp4"
                          className="h-9 text-sm"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <Label
                          htmlFor={`tap-video-${vi}-skip`}
                          className="text-xs font-medium text-muted-foreground"
                        >
                          Skip
                        </Label>
                        <Input
                          id={`tap-video-${vi}-skip`}
                          type="number"
                          min={0}
                          step="any"
                          value={entry.skip}
                          onChange={(e) =>
                            patchEntry(vi, { skip: e.target.value })
                          }
                          className="h-9 text-sm"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <p className="text-xs font-medium text-muted-foreground">
                        Narrators
                      </p>
                      {narratorsLoading ? (
                        <p className="flex items-center gap-1.5 text-xs text-stone-400">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Loading narrators…
                        </p>
                      ) : narratorsError ? (
                        <p className="text-xs text-red-600">
                          Couldn't load narrators.
                        </p>
                      ) : narrators.length === 0 ? (
                        <p className="text-xs text-stone-400">
                          No narrators available.
                        </p>
                      ) : (
                        <div className="flex flex-wrap gap-x-4 gap-y-2">
                          {narrators.map((narrator) => {
                            const checked = entry.narrator.includes(
                              narrator._id,
                            );
                            const checkboxId = `tap-video-${vi}-narrator-${narrator._id}`;
                            return (
                              <div
                                key={narrator._id}
                                className="flex items-center gap-2"
                              >
                                <input
                                  id={checkboxId}
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() =>
                                    toggleNarrator(vi, narrator._id)
                                  }
                                  className="h-4 w-4 rounded border-border accent-foreground cursor-pointer"
                                />
                                {narrator.avatar?.url ? (
                                  <img
                                    src={narrator.avatar.url}
                                    alt=""
                                    className="h-4 w-4 rounded-full object-cover"
                                  />
                                ) : (
                                  <span
                                    className="h-4 w-4 rounded-full bg-muted"
                                    aria-hidden="true"
                                  />
                                )}
                                <Label
                                  htmlFor={checkboxId}
                                  className={
                                    checked
                                      ? "text-sm cursor-pointer"
                                      : "text-sm text-muted-foreground cursor-pointer"
                                  }
                                >
                                  {narrator.name ?? "Unnamed"}
                                </Label>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Cover (thumbnail) + captions only apply to video taps. */}
                    {isVideoType ? (
                      <>
                    <div className="flex flex-col gap-1.5">
                      <p className="text-xs font-medium text-muted-foreground">
                        Thumbnail
                      </p>
                      <div className="flex flex-wrap items-center gap-3">
                        {entry.thumbnailUrl ? (
                          <img
                            src={entry.thumbnailUrl}
                            alt={`Video ${vi + 1} thumbnail`}
                            className="h-12 w-20 flex-shrink-0 rounded-md border border-stone-200 bg-white object-cover"
                          />
                        ) : null}
                        {canUpload ? (
                          <label
                            className={cn(
                              "inline-flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-border bg-card px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-foreground/30 focus-within:ring-2 focus-within:ring-primary/30",
                              thumbUploading &&
                                "pointer-events-none opacity-60",
                            )}
                          >
                            {thumbUploading ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <ImagePlus
                                className="h-3.5 w-3.5"
                                aria-hidden="true"
                              />
                            )}
                            {entry.thumbnailUrl
                              ? "Replace thumbnail"
                              : "Upload thumbnail"}
                            <input
                              type="file"
                              accept="image/png,image/jpeg"
                              className="sr-only"
                              disabled={thumbUploading}
                              onChange={(e) => handleThumbnailChange(vi, e)}
                            />
                          </label>
                        ) : (
                          <>
                            <span className="inline-flex cursor-not-allowed items-center gap-2 rounded-md border border-dashed border-border bg-card px-3 py-2 text-xs text-muted-foreground opacity-60">
                              <ImagePlus
                                className="h-3.5 w-3.5"
                                aria-hidden="true"
                              />
                              Upload thumbnail
                            </span>
                            <span className="text-xs text-stone-400">
                              Save first to upload
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-medium text-muted-foreground">
                          Captions
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => addCaption(vi)}
                          className="h-7 px-2 text-xs text-stone-500 hover:text-stone-700"
                        >
                          <Plus className="h-3 w-3" />
                          Add caption
                        </Button>
                      </div>
                      {entry.captions.length === 0 ? (
                        <p className="text-xs text-stone-400">No captions.</p>
                      ) : (
                        <div className="space-y-2">
                          {entry.captions.map((caption, ci) => {
                            const captionUploading =
                              uploadingKey === `caption-${vi}-${ci}`;
                            const languageId = `tap-video-${vi}-caption-${ci}-language`;
                            const availableId = `tap-video-${vi}-caption-${ci}-available`;
                            return (
                              <div
                                key={ci}
                                className="flex flex-wrap items-center gap-2"
                              >
                                <Input
                                  id={languageId}
                                  value={caption.language}
                                  onChange={(e) =>
                                    patchCaption(vi, ci, {
                                      language: e.target.value,
                                    })
                                  }
                                  placeholder="en"
                                  aria-label="Caption language"
                                  containerClassName="w-24 flex-none"
                                  className="h-9 text-sm"
                                />
                                <div className="flex items-center gap-1.5">
                                  <Switch
                                    id={availableId}
                                    checked={caption.available}
                                    onCheckedChange={(checked) =>
                                      patchCaption(vi, ci, {
                                        available: checked,
                                      })
                                    }
                                  />
                                  <Label
                                    htmlFor={availableId}
                                    className="text-xs text-muted-foreground cursor-pointer"
                                  >
                                    Available
                                  </Label>
                                </div>
                                {canUpload ? (
                                  <label
                                    className={cn(
                                      "inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-dashed border-border bg-card px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:border-foreground/30 focus-within:ring-2 focus-within:ring-primary/30",
                                      captionUploading &&
                                        "pointer-events-none opacity-60",
                                    )}
                                  >
                                    {captionUploading ? (
                                      <Loader2 className="h-3 w-3 animate-spin" />
                                    ) : (
                                      <FileUp
                                        className="h-3 w-3"
                                        aria-hidden="true"
                                      />
                                    )}
                                    Upload file
                                    <input
                                      type="file"
                                      accept=".vtt,.srt"
                                      className="sr-only"
                                      disabled={captionUploading}
                                      onChange={(e) =>
                                        handleCaptionFileChange(vi, ci, e)
                                      }
                                    />
                                  </label>
                                ) : (
                                  <span
                                    className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-md border border-dashed border-border bg-card px-2.5 py-1.5 text-xs text-muted-foreground opacity-60"
                                    title="Save first to upload"
                                  >
                                    <FileUp
                                      className="h-3 w-3"
                                      aria-hidden="true"
                                    />
                                    Upload file
                                  </span>
                                )}
                                {caption.fileUrl ? (
                                  <span className="text-xs font-medium text-emerald-600">
                                    Uploaded
                                  </span>
                                ) : null}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeCaption(vi, ci)}
                                  aria-label={`Remove caption ${ci + 1}`}
                                  className="h-7 w-7 text-stone-400 hover:bg-stone-100 hover:text-red-600"
                                >
                                  <X className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                      </>
                    ) : null}
                  </>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
