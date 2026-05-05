import { z } from "zod";

const EnvSchema = z.object({
  VITE_GRAPHQL_URL: z.string().url(),
  VITE_REST_URL: z.string().url(),
});

const parsed = EnvSchema.safeParse({
  VITE_GRAPHQL_URL: import.meta.env.VITE_GRAPHQL_URL,
  VITE_REST_URL: import.meta.env.VITE_REST_URL,
});

if (!parsed.success) {
  throw new Error(
    `Invalid environment configuration: ${parsed.error.message}`,
  );
}

export const env = {
  GRAPHQL_URL: parsed.data.VITE_GRAPHQL_URL,
  REST_URL: parsed.data.VITE_REST_URL,
} as const;
