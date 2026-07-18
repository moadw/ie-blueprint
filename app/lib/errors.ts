import { ApiError } from "~/lib/api";

/**
 * Normalize any thrown value into a single user-facing line, and log the full
 * error to the console so we can still debug it.
 *
 * The wall of JSON users used to see in toasts came from graphql-request's
 * `ClientError`, whose `.message` is `"<real message>: <full JSON of response +
 * request>"`. The clean line lives at `err.response.errors[0].message`. We
 * duck-type that shape (rather than `instanceof ClientError`) so it survives
 * across module boundaries and minified builds.
 *
 * Use at every mutation/action catch site instead of
 * `err instanceof Error ? err.message : "…"`:
 *
 *   catch (err) {
 *     toast.error(toErrorMessage(err, "Failed to save experience"));
 *   }
 */
export function toErrorMessage(
  err: unknown,
  fallback = "Something went wrong",
): string {
  // Always keep the raw error in the console for debugging.
  console.error(err);

  // graphql-request ClientError → first GraphQL error message.
  const gqlMessage = graphqlErrorMessage(err);
  if (gqlMessage) return gqlMessage;

  // Our REST wrapper → Blueprint bodies expose { error: { message } } | { message }.
  if (err instanceof ApiError) {
    const body = err.body as
      | { error?: { message?: string | null } | null; message?: string | null }
      | null
      | undefined;
    return body?.error?.message ?? body?.message ?? firstLine(err.message);
  }

  if (err instanceof Error && err.message) {
    return firstLine(err.message);
  }

  if (typeof err === "string" && err.trim()) return firstLine(err);

  return fallback;
}

/**
 * Blueprint mutation payloads surface domain errors on `payload.error.message`
 * rather than throwing — the ErrorInterface has no resolveType, so a thrown
 * payload error masks the real message (see CLAUDE.md). Duck-type that shape and
 * return the message, or `null` when the payload succeeded. Callers throw
 * `new Error(msg)` and display it via `toErrorMessage`.
 */
export function payloadErrorMessage(payload: unknown): string | null {
  const err = (
    payload as { error?: { message?: string } | null } | null | undefined
  )?.error;
  return err?.message ?? null;
}

/**
 * Detect a MongoDB duplicate-key error (E11000). These surface as a raw driver
 * string, e.g.:
 *   "E11000 duplicate key error collection: main.users index: email_1 dup key: { email: \"x\" }"
 * Returns the offending field name when it can be parsed (e.g. "email"), an
 * empty string for an unparseable duplicate-key error, or `null` when the error
 * is not a duplicate-key error at all.
 */
export function duplicateKeyField(err: unknown): string | null {
  const text = rawErrorText(err);
  if (!text || !/E11000|duplicate key/i.test(text)) return null;
  // "index: email_1" → email
  const byIndex = text.match(/index:\s*([A-Za-z0-9]+?)_\d+/);
  if (byIndex?.[1]) return byIndex[1];
  // "dup key: { email: ... }" → email
  const byDupKey = text.match(/dup key:\s*\{\s*([A-Za-z0-9_]+)\s*:/);
  if (byDupKey?.[1]) return byDupKey[1];
  return "";
}

/** Concatenate every message a thrown value might carry, untruncated. */
function rawErrorText(err: unknown): string {
  const parts: string[] = [];
  const gqlErrors = (
    err as {
      response?: { errors?: ReadonlyArray<{ message?: string | null }> | null };
    }
  )?.response?.errors;
  if (Array.isArray(gqlErrors)) {
    for (const e of gqlErrors) if (e?.message) parts.push(e.message);
  }
  if (err instanceof ApiError) {
    const body = err.body as
      | { error?: { message?: string | null } | null; message?: string | null }
      | null
      | undefined;
    if (body?.error?.message) parts.push(body.error.message);
    if (body?.message) parts.push(body.message);
  }
  if (err instanceof Error && err.message) parts.push(err.message);
  if (typeof err === "string") parts.push(err);
  return parts.join(" ");
}

/** Pull the first GraphQL error message out of a graphql-request ClientError. */
function graphqlErrorMessage(err: unknown): string | null {
  const errors = (
    err as {
      response?: { errors?: ReadonlyArray<{ message?: string | null }> | null };
    }
  )?.response?.errors;
  const message = Array.isArray(errors) ? errors[0]?.message : null;
  return message && message.trim() ? message : null;
}

/** Cut a message down to a single readable line, dropping any JSON tail. */
function firstLine(message: string): string {
  // ClientError joins "<message>: <json>" — cut at the "{" / "[" tail first.
  const beforeJsonTail = message.split(/:\s*[{[]/)[0] ?? message;
  const line = beforeJsonTail.split("\n")[0] ?? beforeJsonTail;
  return line.trim() || message;
}
