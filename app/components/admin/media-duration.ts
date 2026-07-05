/**
 * Extract a media file's duration in whole minutes, client-side.
 *
 * Creates a detached media element, loads only metadata (`preload="metadata"`),
 * and resolves `Math.floor(durationSeconds / 60)` on `loadedmetadata` — the
 * same duration read the player uses (`use-media-player.ts` `handleLoadedMetadata`).
 *
 * Resolves `null` on any failure so a bad fetch never overwrites a good `time`
 * value with `0`/garbage:
 *  - element `error` (unreachable / decode failure / CORS-blocked source),
 *  - a non-finite duration (`Infinity`/`NaN` — live or unknown-length streams),
 *  - or a timeout (metadata never arrives).
 *
 * A `<video>` element is used because it decodes both audio- and video-only
 * containers; reading `.duration` does not require CORS (unlike canvas reads),
 * and we deliberately leave `crossOrigin` unset so a bucket without CORS
 * headers still exposes its metadata.
 *
 * SSR-safe: returns `null` when there is no `document`. Intended to be called
 * only client-side (from the admin tap dialog).
 */
const EXTRACTION_TIMEOUT_MS = 15_000;

export function extractDurationMinutes(url: string): Promise<number | null> {
  if (typeof document === "undefined") return Promise.resolve(null);
  const trimmed = url.trim();
  if (!trimmed) return Promise.resolve(null);

  return new Promise((resolve) => {
    const el = document.createElement("video");
    let settled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const cleanup = () => {
      el.removeEventListener("loadedmetadata", onLoaded);
      el.removeEventListener("error", onError);
      // Detach the source so the browser can abort/release the request.
      el.removeAttribute("src");
      el.load();
    };

    const finish = (value: number | null) => {
      if (settled) return;
      settled = true;
      if (timer !== undefined) clearTimeout(timer);
      cleanup();
      resolve(value);
    };

    const onLoaded = () => {
      const seconds = el.duration;
      finish(Number.isFinite(seconds) ? Math.floor(seconds / 60) : null);
    };
    const onError = () => finish(null);

    el.preload = "metadata";
    el.addEventListener("loadedmetadata", onLoaded);
    el.addEventListener("error", onError);
    timer = setTimeout(() => finish(null), EXTRACTION_TIMEOUT_MS);
    el.src = trimmed;
  });
}
