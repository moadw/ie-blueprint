import { z } from "zod";

const EnvSchema = z.object({
  VITE_GRAPHQL_URL: z.string().url(),
  VITE_REST_URL: z.string().url(),
  VITE_PLATFORM: z.string().min(1),
  VITE_AMPLITUDE_API_KEY: z.string().min(1).optional(),
});

const parsed = EnvSchema.safeParse({
  VITE_GRAPHQL_URL: import.meta.env.VITE_GRAPHQL_URL,
  VITE_REST_URL: import.meta.env.VITE_REST_URL,
  VITE_PLATFORM: import.meta.env.VITE_PLATFORM,
  VITE_AMPLITUDE_API_KEY: import.meta.env.VITE_AMPLITUDE_API_KEY,
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
} as const;
