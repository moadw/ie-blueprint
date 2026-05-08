export type SafeResult<T> =
  | { ok: true; data: T; error: null }
  | { ok: false; data: null; error: string };

export async function safe<T>(p: Promise<T>): Promise<SafeResult<T>> {
  try {
    return { ok: true, data: await p, error: null };
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    return { ok: false, data: null, error };
  }
}
