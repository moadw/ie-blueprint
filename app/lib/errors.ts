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
