# ie/ project guidance

## ie-prototype is visual reference only

The `ie-prototype/` folder is a Lovable-generated Supabase prototype. Treat it
as a screenshot, not a codebase. Specifically:

- Do NOT copy code, hooks, lib utilities, or component implementations from it.
- The shadcn ui kit there is NOT our component system. We build our own
  primitives in `app/components/ui/` on demand.
- When implementing a feature, look at the prototype to understand the visual
  outcome (layout, copy, tokens), then rebuild the JSX from scratch using
  Tailwind v4 utilities and `@theme` tokens. If the prototype's markup is
  sub-optimal, rebuild cleanly — preserve the visual result, not the code.
- Logic / data flow in the prototype is irrelevant: it talks to Supabase,
  while `ie/` talks to the Blueprint REST + GraphQL APIs.

## Auth header

Blueprint API expects `access-token` (lowercase, hyphenated) — NOT `Authorization: Bearer`.
This is wired in `app/lib/api.ts` and `app/lib/graphql.ts`. Do not change.

## Strict TS gotchas

- `verbatimModuleSyntax: true` → all type-only imports MUST use `import type`.
- `exactOptionalPropertyTypes: true` → optional props can't be set to `undefined` explicitly.
- `noUncheckedIndexedAccess: true` → array/index access yields `T | undefined`.
