---
date: 2026-05-08T00:00:00Z
topic: "Series Detail Practices Rows — Visual Fidelity Plan"
researcher: sergio
status: ready
related_research: thoughts/sergio/research/2026-05-08-series-detail-practices-rows-fidelity.md
branch: feat/series-detail-fidelity
tags: [admin, series-detail, practice-row, prototype-fidelity, ui]
---

# Series Detail Practices Rows — Visual Fidelity Plan

## Overview

Bring `/admin/content/series/:id` (and its `PracticeRow`) to exact visual
parity with the equivalent view in `ie-prototype/` (`SeriesDetailView` +
`InlinePracticeCard`). All edits are visual-fidelity only; no behavioral
changes beyond what's already wired in `ie/`.

- **Motivation**: UI is load-bearing; the current view diverges from the
  prototype on header structure, badge shape, action-bar layout, drag
  handle, and several spacing / icon details.
- **Related**:
  - Research: `thoughts/sergio/research/2026-05-08-series-detail-practices-rows-fidelity.md`
  - Prototype: `ie-prototype/src/components/admin/SeriesDetailView.tsx`,
    `ie-prototype/src/components/admin/InlinePracticeCard.tsx`
  - Target files:
    - `app/routes/admin.content.series.$id.tsx`
    - `app/components/admin/practice-row.tsx`
    - `app/components/ui/badge.tsx`

## Current State Analysis

The route + row render the right shape but with the wrong primitives and
spacing. Concretely (refs in research doc):

- **Wrapper rhythm wrong** — `space-y-0` on the route + ad-hoc `mt-4`,
  `mt-6 mb-6` on children (`admin.content.series.$id.tsx:101`, `:110`,
  `:181`). Prototype uses `space-y-6`.
- **Back affordance** is a `<NavLink>` *above* the header row
  (`admin.content.series.$id.tsx:102-108`); prototype has it as an inline
  ghost icon `Button` on the left of the header.
- **Header pills are `rounded-full <span>`s without borders**
  (`admin.content.series.$id.tsx:128-137`, `:145-151`); prototype uses
  shadcn `Badge` (effectively `rounded-[14px] border px-2.5 py-0.5 text-xs
  font-semibold`).
- **Type badge is hardcoded Sequential**, no Collection variant.
- **Counts text shows only "N practices"** — prototype shows
  `"N practices • A achievements • J journals"`.
- **Cover radius is `rounded-[14px]`** (`:113`, `:119`) — should be
  `rounded-[16px]` (prototype `rounded-lg` = 16px per `ie/CLAUDE.md`).
- **Fallback Folder icon** `h-7 w-7 text-stone-400` (`:121`) — should be
  `h-8 w-8 text-stone-300`.
- **Action bar is `justify-end flex-wrap`** with `mt-6 mb-6`
  (`admin.content.series.$id.tsx:181`); prototype is `justify-between`
  with a left-side helper text `"Drag practices to reorder. Changes are
  saved automatically."`.
- **Empty-state Folder icon** `h-10 w-10 text-stone-400` (`:230`) —
  should be `h-12 w-12 text-stone-300`; the inner `flex justify-center`
  wrapper around the button is redundant (parent is `text-center`).
- **List uses `space-y-3`** (`:244`) — prototype uses `space-y-2`.
- **PracticeRow** (`practice-row.tsx`):
  - Missing `GripVertical` drag handle entirely.
  - Meta badges are `rounded-full <span>` pills (`:301-329`); should use
    the Badge primitive in tag-shape.
  - "Missing: Category" is hardcoded (`:327`); prototype computes a
    dynamic missing-fields list (Cover image, Audio/Video, Description,
    Category) via `getPracticeCompleteness`.
  - Expand & delete are native `<button>`s (`:366-391`); prototype uses
    shadcn `Button variant="ghost" size="icon"`.

The existing `Badge` primitive (`app/components/ui/badge.tsx`) is
`rounded-full` with subscription-state variants (`neutral`, `active`,
`trial`, `suspended`) and is currently used in
`app/routes/admin.districts/_components/DistrictRow.tsx:62`. It must be
extended (not forked) per `ie/CLAUDE.md` "Components: reuse before you
create".

## Desired End State

Side-by-side at 100% zoom, the practices rows view in `ie/` is visually
indistinguishable from `ie-prototype/`'s series detail view in:

- Outer wrapper rhythm and back-arrow placement.
- Cover radius (16px) and fallback icon (`h-8 w-8 text-stone-300`).
- Header badges (status / type / grade) as Badge tags, not pills.
- Counts text format `"N practices • 0 achievements • 0 journals"`.
- Action bar with left helper text and right-aligned button group.
- Practice row drag handle visible (`GripVertical`, non-functional placeholder).
- Practice row meta badges as Badge tags with the prototype's colors.
- Practice row "Missing: …" line dynamic.
- Practice row expand/delete using `Button` primitive.
- Empty state icon `h-12 w-12 text-stone-300`, no extra centering wrapper.
- List `space-y-2`.

`DistrictRow` continues to render its existing pill badge unchanged
(backwards-compatible Badge extension).

## What We're NOT Doing

- **Wiring drag-and-drop reordering.** `GripVertical` is visual-only with a
  `// TODO(reorder): wire to dnd-kit + LessonUpdateOne order mutation`.
- **Wiring real audio/video data** into the row's three media tiles or
  the audio badge variants. Empty-state placeholders only;
  `hasMedia = false` in the completeness helper, so "No audio" + "Missing:
  Audio/Video" always show.
- **Wiring achievements / journals counts** — hardcoded `0` with a
  `// TODO(counts): drive from achievements / journals queries`.
- **Driving the Sequential vs Collection toggle from data.** Hardcoded
  Sequential with `// TODO(curriculum-type): drive from curriculum.<field>`
  until the Blueprint field is identified.
- **Refactoring `DistrictRow`.** Badge extension is backwards compatible.

## Implementation Approach

- **Linear, single feature branch**: most edits land in two files; a DAG
  buys nothing. Branch off `main` as `feat/series-detail-fidelity` before
  the first edit (per `ie/CLAUDE.md` workflow).
- **Extend `Badge` primitive first** so route + row can both consume it.
  Add a `shape` prop (`"pill" | "tag"`, default `"pill"` for back-compat).
- **Two implementation phases** — route, then row — both editing
  independent files. Each phase verifies with `npm run typecheck` and a
  dev-server smoke check.
- **No commits mid-implementation**: one final commit at the end after
  the side-by-side visual review pass passes (per `ie/CLAUDE.md`).
- **Side-by-side visual review is its own phase** so the manual gate is
  explicit and not buried inside an implementation phase.

## Quick Verification Reference

```bash
# from ie/
npm run typecheck                                      # tsc + react-router typegen
npm run dev                                            # http://localhost:5173/admin/content/series/d701ccf0-1ec7-11f0-b598-a94782bad0bb
# in ie-prototype/, side-by-side reference
cd ../ie-prototype && bun run dev                      # http://localhost:8080/developer-admin-panel
```

---

## Phase 0: Branch off main

### Overview

Create the feature branch so all edits in subsequent phases land in one
place and the final commit is well-scoped.

### Changes Required:

#### 1. Git branch
**File**: working tree
**Changes**: `git switch -c feat/series-detail-fidelity` from `main`.

### Success Criteria:

#### Automated Verification:
- [ ] Branch exists and is checked out: `git rev-parse --abbrev-ref HEAD` prints `feat/series-detail-fidelity`
- [ ] Branch base is `main`: `git merge-base feat/series-detail-fidelity main` equals `git rev-parse main`
- [ ] Working tree clean: `git status --porcelain` is empty

#### Automated QA:
- [ ] (none — branch creation only)

#### Manual Verification:
- [ ] (none)

**Implementation Note**: No commits this phase.

---

## Phase 1: Extend Badge primitive (tag shape)

### Overview

Add a `shape` prop to `Badge` so it can render either the existing pill
(`rounded-full`, no border) or the prototype's tag shape (`rounded-[14px]`,
border, `px-2.5`, `font-semibold`). Default stays `pill` so `DistrictRow`
is unaffected.

### Changes Required:

#### 1. Badge primitive
**File**: `app/components/ui/badge.tsx`
**Changes**:
- Add `BadgeShape = "pill" | "tag"`.
- Add optional `shape?: BadgeShape` prop, default `"pill"`.
- Split base classes into two sets:
  - `pill`: `inline-flex items-center font-medium text-xs px-2 py-0.5 rounded-full`
    (current behavior).
  - `tag`: `inline-flex items-center gap-1 text-xs font-semibold border px-2.5 py-0.5 rounded-[14px]`.
- Keep `variantClasses` as-is. Apply the variant only when `shape="pill"`;
  when `shape="tag"`, the caller is expected to provide the color trio
  via `className` (`bg-* text-* border-*`).
- `cn()` ordering keeps `className` last so `tailwind-merge` lets callers
  override e.g. `border-blue-200` cleanly.

#### 2. (No call-site changes)
**File**: `app/routes/admin.districts/_components/DistrictRow.tsx`
**Changes**: none — defaults to `shape="pill"`, current visual unchanged.

### Success Criteria:

#### Automated Verification:
- [ ] Typecheck passes: `npm run typecheck`
- [ ] No runtime regressions in DistrictRow consumer of Badge: `grep -n 'Badge' app/routes/admin.districts/_components/DistrictRow.tsx` shows the same call signature (no breaking edits).

#### Automated QA:
- [ ] Render snapshot of `<Badge>No License</Badge>` (default pill) is
      visually identical to pre-change — verified by loading
      `/admin/districts` in dev and inspecting computed CSS on the
      "No License" badge: `border-radius: 9999px`, no border.
- [ ] Render of `<Badge shape="tag" className="bg-emerald-100 text-emerald-700 border-emerald-200">Live</Badge>`
      shows `border-radius: 14px`, 1px emerald border, `font-weight: 600`.

#### Manual Verification:
- [ ] (none — both checks above are inspectable in DevTools)

**Implementation Note**: No commit this phase.

---

## Phase 2: Route fidelity (`admin.content.series.$id.tsx`)

### Overview

Rewrite the header, action bar, list container, and empty state in the
series-detail route to match the prototype. All Badge usages flip to
`shape="tag"` with literal Tailwind color trios.

### Changes Required:

#### 1. Outer wrapper + back link
**File**: `app/routes/admin.content.series.$id.tsx`
**Changes**:
- Line 101: `space-y-0` → `space-y-6`.
- Replace lines 102-108 (`<NavLink>Back to Series</NavLink>` above row)
  with a ghost icon `Button` rendered *inside* the header row, at the
  start of the inner left flex group. Use `useNavigate()` from
  `react-router` and call `navigate("/admin/content")` on click.
- Wrap the inner left side in `flex items-start gap-4`.

#### 2. Cover image
**File**: same
**Changes**:
- Lines 113-122: `rounded-[14px]` → `rounded-[16px]` on both `<img>` and
  fallback `<div>`.
- Fallback Folder icon: `h-8 w-8 text-stone-300` (was `h-7 w-7 text-stone-400`).

#### 3. Title column rhythm
**File**: same
**Changes**:
- Drop `space-y-2` on the title column wrapper.
- Title row: `flex items-center gap-3`.
- Description: always render, fall back to "No description":
  ```tsx
  <p className="text-stone-500 text-sm mt-1 max-w-xl">
    {curriculum.description || "No description"}
  </p>
  ```
- Status `<span>` (lines 128-137) → `<Badge shape="tag" className={cn(status === "live" ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-amber-100 text-amber-700 border-amber-200")}>`.

#### 4. Type / grade / counts row
**File**: same
**Changes**:
- Replace lines 144-155 wrapper with `<div className="flex items-center gap-3 mt-2">`.
- Type badge:
  ```tsx
  <Badge shape="tag" className="bg-blue-50 text-blue-600 border-blue-200">
    <ListOrdered className="w-3 h-3 mr-1" />Sequential
  </Badge>
  ```
  with `// TODO(curriculum-type): drive from curriculum.<field>; render Collection variant`.
- Grade badge:
  ```tsx
  <Badge shape="tag" className="bg-stone-50 text-stone-500 border-stone-200">
    {gradeLabel(curriculum.grade)}
  </Badge>
  ```
- Counts text:
  ```tsx
  <span className="text-sm text-stone-400">
    {lessons.length} practices • 0 achievements • 0 journals
  </span>
  ```
  with `// TODO(counts): drive from achievements / journals queries`.

#### 5. Action bar
**File**: same
**Changes**:
- Line 181: replace classes with
  `flex justify-between items-center border-t border-b border-stone-200 py-3`.
- Drop `mt-6 mb-6` (now provided by parent `space-y-6`).
- Add left side: `<p className="text-sm text-stone-500">Drag practices to reorder. Changes are saved automatically.</p>`.
- Wrap the existing five buttons in `<div className="flex gap-2 items-center">`.

#### 6. List container
**File**: same
**Changes**:
- Line 244: `space-y-3` → `space-y-2`.

#### 7. Empty state
**File**: same
**Changes**:
- Folder icon: `h-12 w-12 text-stone-300` (was `h-10 w-10 text-stone-400`).
- Remove `<div className="flex justify-center">` wrapper around the button.

### Success Criteria:

#### Automated Verification:
- [ ] Typecheck passes: `npm run typecheck`
- [ ] No `rounded-full` left in the route file: `grep -n 'rounded-full' app/routes/admin.content.series.$id.tsx` returns nothing.
- [ ] No `<NavLink>` "Back to Series" remains: `grep -n 'Back to Series' app/routes/admin.content.series.$id.tsx` returns nothing.

#### Automated QA:
- [ ] Dev server boots cleanly: `npm run dev` reports no compile errors.
- [ ] Loading `http://localhost:5173/admin/content/series/d701ccf0-1ec7-11f0-b598-a94782bad0bb` renders without runtime errors (browser console clean).
- [ ] DOM check: header status badge has `border-radius: 14px` and a 1px border (computed style in DevTools).
- [ ] DOM check: action bar wrapper has `justify-content: space-between` and contains a `<p>` with text starting "Drag practices to reorder".
- [ ] DOM check: practices list `<div>` has class containing `space-y-2`.

#### Manual Verification:
- [ ] (deferred to Phase 4 visual review)

**Implementation Note**: No commit this phase.

---

## Phase 3: PracticeRow fidelity (`practice-row.tsx`)

### Overview

Add the missing drag handle, swap meta pills for Badge tags, drive the
"Missing: …" string from a `getPracticeCompleteness` helper, and replace
the native expand/delete buttons with the existing `Button` primitive.

### Changes Required:

#### 1. Imports
**File**: `app/components/admin/practice-row.tsx`
**Changes**:
- Add `GripVertical` and `Volume2` to the `lucide-react` import.
- Import `Badge` from `~/components/ui/badge`.

#### 2. Drag handle
**File**: same
**Changes**:
- Inside the main row (around line 196, before the cover button), insert:
  ```tsx
  {/* TODO(reorder): wire to dnd-kit + LessonUpdateOne order mutation */}
  <button
    type="button"
    aria-label="Drag to reorder"
    title="Drag to reorder (coming soon)"
    className="cursor-grab active:cursor-grabbing p-1 text-stone-400 hover:text-stone-600 touch-none flex-shrink-0"
  >
    <GripVertical className="h-5 w-5" />
  </button>
  ```

#### 3. Completeness helper (replace `isComplete` const)
**File**: same
**Changes**:
- Replace the single `isComplete` line with:
  ```ts
  const completeness = (() => {
    const hasImage = Boolean(practice.cover?.url);
    const hasMedia = false; // TODO(media): wire when LessonMedia lands
    const hasDescription = Boolean(practice.description);
    const hasCategory = Boolean(category);
    const missing: string[] = [];
    if (!hasImage) missing.push("Cover image");
    if (!hasMedia) missing.push("Audio/Video");
    if (!hasDescription) missing.push("Description");
    if (!hasCategory) missing.push("Category");
    return { isComplete: missing.length === 0, missing, hasMedia };
  })();
  const isComplete = completeness.isComplete;
  ```

#### 4. Meta-row badges
**File**: same
**Changes**:
- Replace lines 301-329 entirely. New structure:
  ```tsx
  <div className="mt-1 flex flex-wrap items-center gap-1.5">
    {category ? (
      <Badge shape="tag" className="bg-transparent text-stone-500 border-stone-300">
        {category}
      </Badge>
    ) : null}
    <Badge shape="tag" className="bg-transparent text-stone-500 border-stone-300">
      {GRADE_OPTIONS.find((g) => g.value === gradeLevel)?.label ?? "All Levels"}
    </Badge>
    {completeness.hasMedia ? (
      <Badge shape="tag" className="bg-blue-100 text-blue-700 border-blue-200">
        <Volume2 className="w-3 h-3" />
        {/* TODO(media): show count + langs */}
      </Badge>
    ) : (
      <Badge shape="tag" className="bg-amber-50 text-amber-600 border-amber-300">
        <AlertCircle className="w-3 h-3" />
        No audio
      </Badge>
    )}
    {hasJournal ? (
      <Badge shape="tag" className="bg-amber-100 text-amber-700 border-amber-200">
        <BookOpen className="w-3 h-3" />
        Journal
      </Badge>
    ) : null}
    {isComplete ? (
      <Badge shape="tag" className="bg-emerald-100 text-emerald-700 border-emerald-200">
        <CheckCircle2 className="w-3 h-3" />
        Complete
      </Badge>
    ) : (
      <span className="text-xs text-stone-400">
        Missing: {completeness.missing.join(", ")}
      </span>
    )}
  </div>
  ```

#### 5. Expand / delete buttons
**File**: same
**Changes**:
- Lines 366-391: replace each native `<button>` with shadcn-shaped:
  ```tsx
  <Button
    variant="ghost"
    size="icon"
    onClick={() => setExpanded((x) => !x)}
    aria-label={expanded ? "Collapse" : "Expand"}
    className="text-stone-500 hover:bg-stone-100 hover:text-stone-700"
  >
    {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
  </Button>
  <Button
    variant="ghost"
    size="icon"
    onClick={handleDelete}
    disabled={deleting}
    aria-label="Delete practice"
    className="text-red-500 hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
  >
    {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
  </Button>
  ```
- Confirm `~/components/ui/button` exposes `variant="ghost"` + `size="icon"`. If not, fall back to keeping native buttons but add `rounded-md` so the radius matches the rest of the app (revisit during Phase 4).

### Success Criteria:

#### Automated Verification:
- [ ] Typecheck passes: `npm run typecheck`
- [ ] No `rounded-full` in the row file: `grep -n 'rounded-full' app/components/admin/practice-row.tsx` returns nothing.
- [ ] `GripVertical` imported and rendered: `grep -n 'GripVertical' app/components/admin/practice-row.tsx` returns ≥ 2 lines (import + JSX).
- [ ] Hardcoded "Missing: Category" string is gone: `grep -n 'Missing: Category' app/components/admin/practice-row.tsx` returns nothing.
- [ ] No `inline-flex items-center rounded-full` pill literals remain: `grep -n 'inline-flex items-center rounded-full' app/components/admin/practice-row.tsx` returns nothing.

#### Automated QA:
- [ ] Loading the series detail page renders rows without runtime errors (browser console clean).
- [ ] DOM check: each row contains a `<button>` with class `cursor-grab` and an `svg` (`GripVertical`).
- [ ] DOM check: a row whose practice has no `cover.url` and no description shows text matching `Missing: Cover image, Audio/Video, Description, Category` (or the subset implied by its data).
- [ ] DOM check: meta badges have `border-radius: 14px` (computed style), not `9999px`.
- [ ] DOM check: expand and delete buttons share the same height/width and radius as other `Button variant="ghost" size="icon"` instances elsewhere in `ie/`.

#### Manual Verification:
- [ ] (deferred to Phase 4 visual review)

**Implementation Note**: No commit this phase.

---

## Phase 4: Side-by-side visual review + final commit

### Overview

Run `ie/` and `ie-prototype/` side-by-side, walk the practices-rows view
top to bottom against the research checklist, fix any residual mismatches,
then make a single feature-scoped commit.

### Changes Required:

#### 1. Visual review pass
**File**: (any of the above, as needed)
**Changes**: Whatever is required to close pixel/spacing gaps surfaced
during review. Expected to be small (≤5 line tweaks) if Phases 1-3 went
clean.

#### 2. Final commit
**File**: working tree
**Changes**: One commit on `feat/series-detail-fidelity`:
- Title: `feat(admin): match prototype fidelity for series-detail practices rows`
- Body: bullet list of the four areas (Badge tag shape, route header /
  action bar / empty state, PracticeRow drag handle / badges / dynamic
  missing / Button primitive).

### Success Criteria:

#### Automated Verification:
- [ ] Typecheck passes: `npm run typecheck`
- [ ] Branch contains exactly one new commit ahead of `main`: `git rev-list --count main..feat/series-detail-fidelity` is `1`.
- [ ] No `console.log` / debug code committed: `git diff main..HEAD -- app/ | grep -nE '(console\.log|debugger)'` returns nothing.

#### Automated QA:
- [ ] Both dev servers running concurrently: `cd ie && npm run dev` (port 5173) and `cd ie-prototype && bun run dev` (port 8080).
- [ ] Browser walk-through (agent or human, scripted): open `http://localhost:5173/admin/content/series/d701ccf0-1ec7-11f0-b598-a94782bad0bb` and `http://localhost:8080/developer-admin-panel` (click any series), capture a screenshot of each at viewport 1440×900.
- [ ] DOM diff sanity: in both pages, the badge in the page header has `border-radius: 14px` and a 1px border; the practices list container has `gap: 0.5rem` (`space-y-2`); each row contains a drag handle (`GripVertical`) at its left edge.

#### Manual Verification:
- [ ] **Eyeball at zoom level 1** per `ie/CLAUDE.md`: header back-arrow placement, cover radius, all badge shapes (tag not pill), counts text, action-bar helper text + button group, list gap, empty-state icon size, practice-row drag handle visible, dynamic missing list, expand/delete button shapes match prototype.
- [ ] No regression on `/admin/districts` (DistrictRow Badge still renders as the original pill).
- [ ] Mobile (≤375px) and desktop (≥1280px) both look right for the practices rows view.

**Implementation Note**: After manual verification passes, create the
single final commit. Do NOT push or merge — wait for the user's explicit
"merge" instruction.

---

## Appendix

- **Follow-up plans**:
  - Wire drag-and-drop reordering for practices (`dnd-kit` + `LessonUpdateOne` order mutation).
  - Wire LessonMedia query so the audio/video badge variants and tile fills become reachable.
  - Wire achievements / journals queries so counts become real.
  - Drive Sequential vs Collection from `curriculum.<field>` once the Blueprint field is identified.

- **Derail notes**:
  - Existing `Badge` is consumed by `app/routes/admin.districts/_components/DistrictRow.tsx:62` only. Backwards-compat is one call site to verify.
  - `cn()` uses `tailwind-merge` (`app/lib/utils.ts:3`), so callers can override `rounded-*`, `border-*`, `bg-*`, `text-*` cleanly via `className`.
  - Prototype's `rounded-md` resolves to 14px via the `--radius` token override; in `ie/` we transcribe to `rounded-[14px]` literals (see `ie/CLAUDE.md` "Prototype port checklist").
  - Prototype's `shadow-sm` (Tailwind v3) maps to `shadow-xs` in `ie/` (Tailwind v4) — already correctly applied on the row's outer card.

- **References**:
  - Research: `thoughts/sergio/research/2026-05-08-series-detail-practices-rows-fidelity.md`
  - Project guidance: `ie/CLAUDE.md` (Prototype port checklist, Components: reuse before you create, Feature workflow)
