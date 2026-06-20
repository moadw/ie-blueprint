import { ApiError } from "~/lib/api";
import { getToken } from "~/lib/auth";
import { env } from "~/lib/env";

export interface UploadOptions {
  method?: string;
  onProgress?: (pct: number) => void;
  signal?: AbortSignal;
}

/**
 * XHR-based upload helper that reports an upload percentage via `onProgress`.
 *
 * This exists because `fetch` (used by the `api()` helper in `~/lib/api`) does
 * not expose upload-progress events — only `XMLHttpRequest`'s `upload.onprogress`
 * does. It mirrors `api()`'s `access-token` header and REST base-URL join, but
 * intentionally does NOT replicate `api()`'s 401 refresh-retry: uploads run
 * inside an already-authenticated admin session, so a 401 surfaces as an error
 * rather than triggering a token refresh.
 *
 * Like `api()`, it does NOT set `Content-Type` for the `FormData` body — the
 * browser/XHR sets the multipart boundary itself.
 */
export async function uploadWithProgress<T = unknown>(
  path: string,
  formData: FormData,
  opts?: UploadOptions,
): Promise<T> {
  const url = path.startsWith("http") ? path : `${env.REST_URL}${path}`;

  return new Promise<T>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(opts?.method ?? "PUT", url);

    // Mirror api(): set the access-token header when present. Do NOT set
    // Content-Type — XHR sets the multipart boundary for a FormData body.
    const token = getToken();
    if (token) {
      xhr.setRequestHeader("access-token", token);
    }

    if (opts?.onProgress) {
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          opts.onProgress?.(Math.round((e.loaded / e.total) * 100));
        }
      });
    }

    const parseBody = (): unknown => {
      const contentType = xhr.getResponseHeader("Content-Type") ?? "";
      if (contentType.includes("application/json")) {
        try {
          return JSON.parse(xhr.responseText);
        } catch {
          return xhr.responseText;
        }
      }
      return xhr.responseText;
    };

    const cleanup = () => {
      if (opts?.signal) {
        opts.signal.removeEventListener("abort", onAbort);
      }
    };

    const onAbort = () => {
      xhr.abort();
    };

    xhr.addEventListener("load", () => {
      cleanup();
      const body = parseBody();
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(body as T);
      } else {
        reject(
          new ApiError(xhr.status, body, `Upload ${xhr.status} on ${path}`),
        );
      }
    });

    xhr.addEventListener("error", () => {
      cleanup();
      reject(new ApiError(xhr.status, null, `Upload failed on ${path}`));
    });

    xhr.addEventListener("timeout", () => {
      cleanup();
      reject(new ApiError(xhr.status, null, `Upload timed out on ${path}`));
    });

    xhr.addEventListener("abort", () => {
      cleanup();
      reject(new ApiError(xhr.status, null, `Upload aborted on ${path}`));
    });

    if (opts?.signal) {
      if (opts.signal.aborted) {
        reject(new ApiError(0, null, `Upload aborted on ${path}`));
        return;
      }
      opts.signal.addEventListener("abort", onAbort);
    }

    xhr.send(formData);
  });
}
