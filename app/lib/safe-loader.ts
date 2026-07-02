import { toErrorMessage } from "~/lib/errors";

export type SafeResult<T> =
  | { ok: true; data: T; error: null }
  | { ok: false; data: null; error: string };

export async function safe<T>(p: Promise<T>): Promise<SafeResult<T>> {
  try {
    return { ok: true, data: await p, error: null };
  } catch (err) {
    return { ok: false, data: null, error: toErrorMessage(err) };
  }
}
