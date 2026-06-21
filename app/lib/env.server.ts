import { z } from "zod";

/**
 * SERVER-ONLY environment.
 *
 * These values must NEVER reach the client bundle. They are read from
 * `process.env` (server runtime), NOT `import.meta.env` (Vite build-time inline
 * into the browser bundle), and this module is a `.server.ts` so React
 * Router / Vite excludes it from the client build entirely. The companion
 * `~/lib/env.ts` holds only the public, `VITE_`-prefixed values that are safe
 * to inline into the browser.
 *
 * The Amplitude Dashboard REST API authenticates with HTTP Basic
 * `apiKey:secretKey`. The secret key is sensitive and lives here; the API key
 * can be the same public project key (`VITE_AMPLITUDE_API_KEY`) or a non-VITE
 * server copy (`AMPLITUDE_API_KEY`).
 *
 * Everything is `.optional()` so the app still boots without these provisioned
 * (the Amplitude server client then degrades to soft errors / empty results).
 */
const ServerEnvSchema = z.object({
  // Amplitude Dashboard REST secret key — HTTP Basic password half. Sensitive.
  AMPLITUDE_SECRET_KEY: z.string().min(1).optional(),
  // Server-side API key — HTTP Basic username half. Falls back to the public
  // VITE key below so a single project key can serve both client + server.
  AMPLITUDE_API_KEY: z.string().min(1).optional(),
  // Amplitude data region: "us" (amplitude.com) or "eu"
  // (analytics.eu.amplitude.com). Defaults to "us". Case-insensitive: a
  // hand-typed "US"/"EU" in .env is lowercased before validation so it can't
  // 500 the app at boot over casing.
  AMPLITUDE_REGION: z
    .string()
    .transform((s) => s.toLowerCase())
    .pipe(z.enum(["us", "eu"]))
    .optional(),
});

const parsed = ServerEnvSchema.safeParse({
  AMPLITUDE_SECRET_KEY: process.env.AMPLITUDE_SECRET_KEY,
  AMPLITUDE_API_KEY: process.env.AMPLITUDE_API_KEY,
  AMPLITUDE_REGION: process.env.AMPLITUDE_REGION,
});

if (!parsed.success) {
  throw new Error(
    `Invalid server environment configuration: ${parsed.error.message}`,
  );
}

export const serverEnv = {
  AMPLITUDE_SECRET_KEY: parsed.data.AMPLITUDE_SECRET_KEY,
  // Prefer the dedicated server key; fall back to the public VITE key, which is
  // also present in `process.env` server-side. Result may be undefined.
  AMPLITUDE_API_KEY:
    parsed.data.AMPLITUDE_API_KEY ??
    process.env.VITE_AMPLITUDE_API_KEY ??
    undefined,
  AMPLITUDE_REGION: parsed.data.AMPLITUDE_REGION ?? "us",
} as const;
