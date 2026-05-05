import { getToken, setToken } from "~/lib/auth";
import { env } from "~/lib/env";

export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(status: number, body: unknown, message?: string) {
    super(message ?? `API error ${status}`);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

export interface ApiOptions extends Omit<RequestInit, "body"> {
  json?: unknown;
  body?: BodyInit | null;
}

interface SessionRefreshResponse {
  accessToken: string | null;
}

/**
 * Call the local /api/session resource route to attempt to refresh the
 * access token from the httpOnly refresh cookie. The route does not yet
 * exist in milestone 1 — this returns null gracefully on miss/failure
 * to avoid infinite retry loops.
 */
async function refreshSession(): Promise<string | null> {
  try {
    const res = await fetch("/api/session", {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as SessionRefreshResponse;
    return data.accessToken ?? null;
  } catch {
    return null;
  }
}

async function doFetch(path: string, opts: ApiOptions): Promise<Response> {
  const headers = new Headers(opts.headers);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  const token = getToken();
  if (token) {
    headers.set("access-token", token);
  }

  const init: RequestInit = {
    ...opts,
    headers,
  };
  if (opts.json !== undefined) {
    init.body = JSON.stringify(opts.json);
  } else if (opts.body !== undefined) {
    init.body = opts.body;
  }

  const url = path.startsWith("http") ? path : `${env.REST_URL}${path}`;
  return fetch(url, init);
}

export async function api<T = unknown>(
  path: string,
  opts: ApiOptions = {},
): Promise<T> {
  let res = await doFetch(path, opts);

  if (res.status === 401) {
    // Single retry: try to refresh token via /api/session, then retry once.
    const newToken = await refreshSession();
    if (newToken) {
      setToken(newToken);
      res = await doFetch(path, opts);
    }
  }

  if (!res.ok) {
    let body: unknown = null;
    try {
      body = await res.json();
    } catch {
      try {
        body = await res.text();
      } catch {
        body = null;
      }
    }
    throw new ApiError(res.status, body, `API ${res.status} on ${path}`);
  }

  // Try JSON; fall back to text/empty.
  const contentType = res.headers.get("Content-Type") ?? "";
  if (contentType.includes("application/json")) {
    return (await res.json()) as T;
  }
  return (await res.text()) as unknown as T;
}
