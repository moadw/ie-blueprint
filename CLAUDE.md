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

## UI strictness when porting from the prototype

UI is load-bearing on this project. When building any page or feature whose
visual reference is in `ie-prototype/`, follow this discipline — every bullet
is a thing reviewers will reject the PR for.

### Prototype port checklist (do this BEFORE the first edit)

Class names lie. The prototype is Tailwind v3 with overridden tokens; `ie/` is
Tailwind v4 with its own theme. Matching `bg-stone-100` in both files does not
mean matching pixels. Run this checklist the first time per session you touch
UI ported from the prototype, and again whenever a new component is in scope:

1. **Read the prototype's design system source:**
   - `ie-prototype/tailwind.config.*` — note the `borderRadius` override (driven
     by `--radius`), any `boxShadow` overrides, palette extensions.
   - `ie-prototype/src/index.css` — note `--radius`, `--foreground`,
     `--muted-foreground`, `--background`, etc. (HSL triples).
2. **Read `ie/`'s tokens:** `app/styles/app.css` — note the matching
   `--color-*` variables. Cross-check that the prototype HSL == `ie/` HSL
   before reusing a token; if they disagree, use a literal Tailwind palette
   class instead.
3. **Resolve every prototype class to its actual value before reusing it:**
   - `rounded-md` in the prototype = `calc(var(--radius) - 2px)` = **14px**,
     not Tailwind's default 6px. Same shift on `sm` (=12px) and `lg` (=16px).
     In `ie/`, write the explicit pixel literal: `rounded-[14px]`,
     `rounded-[12px]`, `rounded-[16px]`. (This is why commit `382b37f` set the
     top admin tabs to those literals.)
   - `shadow-sm` in v3 (prototype) = subtle 1px / 5% opacity. In v4 (`ie/`)
     `shadow-sm` is heavier — what v3 called `shadow-sm` is now `shadow-xs`.
     **Use `shadow-xs` in `ie/` wherever the prototype writes `shadow-sm`.**
     Same shift up the scale (`shadow` → `shadow-sm`, etc.).
   - Color tokens: `text-foreground` resolves to the same RGB on both sides
     only because both files set `--foreground: 220 20% 20%`. Don't substitute
     `text-stone-900` (= rgb 28, 25, 23, warmer/darker) — they are not the
     same color even though both look "dark".
4. **Match the literal RGB the prototype renders, not the class name.** If the
   class name and the rendered color disagree, the rendered color wins. Pick
   either the matching `ie/` token, the same literal Tailwind palette class,
   or a `rounded-[Npx]` / `text-[rgb(...)]` arbitrary value — whichever lands
   the exact value.
5. **Eyeball at zoom level 1.** Side-by-side the prototype in one tab and
   `ie/` in another at 100% zoom before declaring a component done.

This checklist supersedes the "Don't introduce ad-hoc `rounded-[14px]`" line
in **Tokens, not magic numbers** below: when 14px is the prototype's actual
`rounded-md`, write `rounded-[14px]`. Magic numbers are bad when invented;
they are mandatory when transcribing.

### Components: reuse before you create

- **Audit `app/components/ui/` and `app/components/layout/` first.** If a
  primitive (button, input, logo, divider, password input, …) covers the role,
  reuse it as-is. Do NOT fork or wrap it just to add one prop — extend the
  primitive itself.
- **Before writing a new primitive, justify it:** name the role, name the
  callers (≥1 today, plausibly ≥1 more later). One-off inline JSX inside a
  route is fine; a second instance of the same shape across two files is the
  trigger to extract a primitive.
- **Never inline shapes that already have a primitive.** If `CircleTile`,
  `IconTile`, etc. exist, no route file should contain raw
  `<div className="w-24 h-24 rounded-full ...">`. Add a grep-level guard in
  the plan if needed.
- **Route-private composites live in `routes/<route>/_components/`.** Shared
  primitives live in `app/components/ui/`. Don't put route-specific composites
  in the shared folder.
- The prototype's shadcn pieces are NOT our primitives — see "ie-prototype is
  visual reference only" above.

### Tokens, not magic numbers

- **Colors**: use `@theme` tokens from `app/styles/app.css` (`bg-primary`,
  `text-foreground`, `border-border`, `bg-card/30`, etc.). No raw hex,
  no `bg-blue-500`, no off-token grays except in genuinely neutral
  decorative contexts (and even then, prefer `muted-foreground`).
- **Radii**: stick to the documented set — `rounded-full` (pills, circle
  tiles), `rounded-2xl` (cards), `rounded-xl` (icon tiles, name inputs),
  `rounded-lg` (compact inputs). Don't introduce ad-hoc `rounded-[14px]`.
- **Typography**: `font-sans` (Inter) is the default; `font-serif`
  (Instrument Serif) is reserved for hero/onboarding titles. Match the
  prototype's size *step* (`text-2xl sm:text-3xl lg:text-4xl`), not a
  pixel-perfect clone — keep the responsive ladder.
- **Spacing rhythm**: respect the prototype's vertical rhythm (e.g.
  `mb-4 lg:mb-5` between fields, `mb-5 lg:mb-6` before button rows,
  `gap-3` between paired buttons). Don't pick spacing values by feel.
- **Shadows / glass**: the glass recipe is *white-translucent gradient +
  `backdrop-blur` + light white border + soft shadow*. Reuse the same
  recipe across primitives — don't invent a second glass treatment.

### Animations, transitions, and loaders

- **Default to none.** Only add motion if the prototype actually has it
  AND it's load-bearing (drawing the eye, communicating state). Decorative
  entrance animations are deferred unless explicitly in scope.
- **Loaders use `Button`'s built-in `loading` prop** (renders `Loader2`).
  Don't introduce a second spinner component, full-page overlay, or custom
  skeleton without proposing it first.
- **Transitions stay short and token-driven**: `transition-colors`,
  `transition-opacity`, `duration-150`/`duration-200`. No bespoke cubic
  beziers or staggered keyframes unless the prototype has them and they're
  in scope.
- **Hover/focus states are mandatory, not optional.** Every interactive
  element gets a visible focus ring (use `focus-visible:ring-*` from the
  primitive — don't disable it) and a hover state if the prototype shows
  one.

### Visual review is part of "done"

- Eyeball the page side-by-side with the prototype before declaring a
  phase complete. Check: background, logo position, container width,
  padding, font weight, button shape, dot indicators, spacing between
  groups of fields.
- Mobile (≤375px) and desktop (≥1280px) both have to look right. The
  prototype's right-column previews are typically `lg+` only — confirm the
  collapse behavior matches.
- If the prototype's markup is messy, rebuild cleanly — but the visual
  outcome must match. The deliverable is the look, not the JSX.

### When the prototype has something we can't ship yet

Build the UI, leave it visually complete, and either (a) wire it to a
no-op or local state, or (b) leave a `// TODO(<short-tag>): wire to <X>`
referencing the follow-up plan. Never ship a half-styled placeholder.

## Auth header

Blueprint API expects `access-token` (lowercase, hyphenated) — NOT `Authorization: Bearer`.
This is wired in `app/lib/api.ts` and `app/lib/graphql.ts`. Do not change.

## Strict TS gotchas

- `verbatimModuleSyntax: true` → all type-only imports MUST use `import type`.
- `exactOptionalPropertyTypes: true` → optional props can't be set to `undefined` explicitly.
- `noUncheckedIndexedAccess: true` → array/index access yields `T | undefined`.

## Feature workflow

The standard loop for any non-trivial feature is research → validate →
plan → implement → merge. Don't skip steps and don't swap tooling.

1. **Research in autopilot.** When the user asks for research (`/research`
   or any "look into / document / map out X" request), invoke
   `desplega:researching` with `--autonomy=autopilot` by default. Only drop
   to `critical` / `verbose` if the user explicitly says so.
2. **Surface Open Questions immediately.** As soon as the research doc is
   written, post the "Open Questions" section back to the user via
   `AskUserQuestion` (one question per item, batched up to 4 at a time) and
   wait for answers before proposing anything else. Don't move to planning
   with unresolved questions.
3. **Plan with desplega.** Once questions are validated, create the plan
   with `desplega:planning` (linear) or `desplega:v-planning` (parallel /
   DAG) — pick based on whether the work fans out into independent slices.
   Never hand-roll a plan or use a non-desplega planner.
4. **Implement with desplega.** After plan approval, run
   `desplega:implementing` (linear plans) or `desplega:v-implementing` (DAG
   plans). No ad-hoc implementation outside the plan.
5. **New feature branch + final commit.** Before the first edit, create a
   new branch off the current default (e.g. `feat/<short-tag>`). Don't
   commit mid-implementation; make a single commit (or a small set of
   logically-grouped commits) at the very end once the plan is complete and
   verified.
6. **Merge on request only.** Do NOT push or merge automatically. Wait for
   the user to explicitly say "merge". When they do, fast-forward / merge
   into `main` locally. (This rule is temporary and will change once CI/CD
   is in place.)
