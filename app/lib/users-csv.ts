import { api } from "~/lib/api";
import { env } from "~/lib/env";
import { getToken } from "~/lib/auth";

export interface UploadUsersCsvResponse {
  success?: boolean;
  message?: string;
}

/**
 * Upload a CSV of users to the Blueprint backend for bulk teacher creation.
 * The endpoint accepts a multipart body with a `file` field plus a required
 * `platform` field (the platform `_id`). The shared `api()` helper strips the
 * default JSON Content-Type for FormData bodies and injects the lowercase
 * `access-token` header, so no extra plumbing is needed here.
 */
export async function uploadUsersCsv(
  file: File,
): Promise<UploadUsersCsvResponse> {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("platform", env.PLATFORM);
  return api<UploadUsersCsvResponse>("/admin/create-teachers-csv", {
    method: "POST",
    body: fd,
  });
}

export interface UsersCsvQuery {
  organizationId?: string;
  districtId?: string;
  schoolId?: string;
  type?: string;
  search?: string;
}

const EXPORT_PAGE_SIZE = 1000;

/**
 * Download the user list as CSV, paginated 1000 rows per request, and
 * concatenate the pages in the browser into a single text/csv Blob.
 *
 * The Blueprint endpoint at `GET ${REST_URL}/common/users/export/csv` returns
 * raw CSV text (header on line 1, rows after), so we deliberately bypass the
 * `api()` JSON helper and use `fetch` directly. Auth still flows from the
 * same in-memory `getToken()` store via the lowercase `access-token` header.
 */
export async function exportUsersCsv(
  query: UsersCsvQuery,
  total: number,
  onProgress?: (page: number, pages: number) => void,
): Promise<Blob> {
  const pages = Math.max(1, Math.ceil(total / EXPORT_PAGE_SIZE));
  const rows: string[] = [];
  let header: string | null = null;

  for (let p = 0; p < pages; p++) {
    const params = new URLSearchParams();
    const entries: Record<string, string | undefined> = {
      ...query,
      platformId: env.PLATFORM,
      sortBy: "createdAt",
      sortOrder: "-1",
      limit: String(EXPORT_PAGE_SIZE),
      skip: String(p * EXPORT_PAGE_SIZE),
    };
    for (const [k, v] of Object.entries(entries)) {
      if (v != null && v !== "") params.set(k, String(v));
    }
    const token = getToken();
    const res = await fetch(
      `${env.REST_URL}/common/users/export/csv?${params.toString()}`,
      {
        method: "GET",
        headers: token ? { "access-token": token } : {},
      },
    );
    if (!res.ok) throw new Error(`Export failed (HTTP ${res.status})`);
    const text = await res.text();
    const [first, ...rest] = text.split(/\r?\n/);
    if (p === 0) {
      header = first ?? "";
      rows.push(header);
    }
    for (const line of rest) {
      if (line.trim().length > 0) rows.push(line);
    }
    onProgress?.(p + 1, pages);
  }

  return new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8;" });
}
