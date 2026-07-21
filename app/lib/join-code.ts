import { toErrorMessage } from "~/lib/errors";

/**
 * Outcome of interpreting a `UserJoinByCode` redemption error.
 *
 * - `{ ok: true }` — the error is really an idempotent success ("User
 *   Organization already exists": the session user is already attached to this
 *   org, or a concurrent join won the race). Callers should proceed as if the
 *   redemption succeeded.
 * - `{ message }` — friendly, user-facing copy to surface (e.g. a sonner toast).
 */
export type RedeemErrorResult = { ok: true } | { message: string };

const FALLBACK_MESSAGE =
  "We couldn't redeem your invite code. Please try again.";

/**
 * Extract the backend error text from a graphql-request `ClientError` (or any
 * thrown value). We duck-type the ClientError shape rather than
 * `instanceof ClientError` so it survives module boundaries and minified builds
 * — the same approach as `app/lib/errors.ts`. Both the structured
 * `response.errors[].message` list and the flat `.message` string are folded in,
 * because the redemption controller's message can land in either.
 */
function backendErrorText(err: unknown): string {
  const parts: string[] = [];

  const gqlErrors = (
    err as {
      response?: { errors?: ReadonlyArray<{ message?: string | null }> | null };
    }
  )?.response?.errors;
  if (Array.isArray(gqlErrors)) {
    for (const gqlError of gqlErrors) {
      if (gqlError?.message) parts.push(gqlError.message);
    }
  }

  if (err instanceof Error && err.message) parts.push(err.message);
  if (typeof err === "string") parts.push(err);

  return parts.join(" ");
}

/**
 * Map a `UserJoinByCode` redemption error to either idempotent success or
 * friendly, user-facing copy. Backend messages (see the 2026-07-15 Blueprint
 * invite-code guide + the research redemption-error table) are never shown raw.
 *
 *   "User Organization already exists"             → { ok: true } (already in this org)
 *   "…only available for Inner Explorer"           → wrong platform
 *   "Organization not available for your platform" → code belongs to another platform
 *   "User already belongs to another organization" → already in a different org
 *   "User type not found"                          → role could not be resolved
 *
 * Anything unmatched falls back to `toErrorMessage`.
 */
export function redeemErrorToMessage(err: unknown): RedeemErrorResult {
  const text = backendErrorText(err).toLowerCase();

  // Already a member of this org (or a concurrent join) — treat as success.
  if (text.includes("user organization already exists")) {
    return { ok: true };
  }

  // The code belongs to a different platform.
  if (text.includes("organization not available for your platform")) {
    return { message: "That code isn't valid for your account." };
  }

  // Already attached to a *different* organization.
  if (text.includes("user already belongs to another organization")) {
    return {
      message:
        "You already belong to another organization. Contact support if you need to switch.",
    };
  }

  // Wrong platform — the redemption endpoint is Inner Explorer only.
  if (text.includes("only available for inner explorer")) {
    return { message: "This invite is only available on Inner Explorer." };
  }

  // The user's role could not be resolved.
  if (text.includes("user type not found")) {
    return {
      message:
        "We couldn't finish setting up your account. Please try logging in again.",
    };
  }

  return { message: toErrorMessage(err, FALLBACK_MESSAGE) };
}
