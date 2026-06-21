import { z } from "zod";

// Vite resolves a declared-but-blank `.env` var (e.g. `VITE_FOO=`) to an empty
// string, not `undefined` — so a bare `.optional()` still trips `.min(1)`/`.url()`
// and 500s every route (the "Amplitude env gotcha"). Treat empty/whitespace-only
// values as absent so optional config degrades gracefully instead of crashing.
const blankToUndefined = (v: unknown) =>
  typeof v === "string" && v.trim() === "" ? undefined : v;

const EnvSchema = z.object({
  VITE_GRAPHQL_URL: z.string().url(),
  VITE_REST_URL: z.string().url(),
  VITE_PLATFORM: z.string().min(1),
  VITE_AMPLITUDE_API_KEY: z.preprocess(blankToUndefined, z.string().min(1).optional()),
  VITE_APP_URL: z.preprocess(blankToUndefined, z.string().url().optional()),
  VITE_CLEVER_CLIENT_ID: z.preprocess(blankToUndefined, z.string().min(1).optional()),
  VITE_CLASSLINK_CLIENT_ID: z.preprocess(blankToUndefined, z.string().min(1).optional()),
  VITE_FIREBASE_API_KEY: z.preprocess(blankToUndefined, z.string().min(1).optional()),
  VITE_FIREBASE_AUTH_DOMAIN: z.preprocess(blankToUndefined, z.string().min(1).optional()),
  VITE_FIREBASE_PROJECT_ID: z.preprocess(blankToUndefined, z.string().min(1).optional()),
  VITE_FIREBASE_APP_ID: z.preprocess(blankToUndefined, z.string().min(1).optional()),
});

const parsed = EnvSchema.safeParse({
  VITE_GRAPHQL_URL: import.meta.env.VITE_GRAPHQL_URL,
  VITE_REST_URL: import.meta.env.VITE_REST_URL,
  VITE_PLATFORM: import.meta.env.VITE_PLATFORM,
  VITE_AMPLITUDE_API_KEY: import.meta.env.VITE_AMPLITUDE_API_KEY,
  VITE_APP_URL: import.meta.env.VITE_APP_URL,
  VITE_CLEVER_CLIENT_ID: import.meta.env.VITE_CLEVER_CLIENT_ID,
  VITE_CLASSLINK_CLIENT_ID: import.meta.env.VITE_CLASSLINK_CLIENT_ID,
  VITE_FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY,
  VITE_FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  VITE_FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  VITE_FIREBASE_APP_ID: import.meta.env.VITE_FIREBASE_APP_ID,
});

if (!parsed.success) {
  throw new Error(
    `Invalid environment configuration: ${parsed.error.message}`,
  );
}

export const env = {
  GRAPHQL_URL: parsed.data.VITE_GRAPHQL_URL,
  REST_URL: parsed.data.VITE_REST_URL,
  PLATFORM: parsed.data.VITE_PLATFORM,
  AMPLITUDE_API_KEY: parsed.data.VITE_AMPLITUDE_API_KEY,
  APP_URL: parsed.data.VITE_APP_URL,
  CLEVER_CLIENT_ID: parsed.data.VITE_CLEVER_CLIENT_ID,
  CLASSLINK_CLIENT_ID: parsed.data.VITE_CLASSLINK_CLIENT_ID,
  FIREBASE_API_KEY: parsed.data.VITE_FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN: parsed.data.VITE_FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID: parsed.data.VITE_FIREBASE_PROJECT_ID,
  FIREBASE_APP_ID: parsed.data.VITE_FIREBASE_APP_ID,
} as const;
