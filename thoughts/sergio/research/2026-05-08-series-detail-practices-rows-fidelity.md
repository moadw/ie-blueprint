---
date: 2026-05-08
researcher: sergio
git_commit: HEAD
branch: HEAD
repository: innerexplorer/ie
topic: "Practices-rows visual fidelity gap: /admin/content/series/:id (ie) vs developer-admin-panel series detail (ie-prototype)"
tags: [admin, series-detail, practice-row, prototype-fidelity, ui]
status: complete
last_updated: 2026-05-08
last_updated_by: sergio
---

# Practices-rows visual fidelity: ie vs ie-prototype

## Research Question

The route `/admin/content/series/d701ccf0-1ec7-11f0-b598-a94782bad0bb` in `ie/`
shows a series detail with a list of practices. The same view exists in
`ie-prototype/` under `/developer-admin-panel` (click a series). The two views
have many visual differences in the practices rows. Identify every difference
and produce the task list needed to bring `ie/` to exact prototype fidelity
(layout, colors, spacing, fonts, components).

## Summary

Both implementations render essentially the same shape (header → action bar →
practice rows). The gap is concentrated in three areas:

1. **Header section** — `ie/` puts the back link above the row, uses
   `rounded-full` pills instead of shadcn `Badge`s, drops the description /
   item-count line, and forces type=Sequential without showing Collection.
   Outer wrapper uses `space-y-0` instead of `space-y-6`.
2. **Action bar** — `ie/` is `justify-end` with no left-side helper text, and
   uses `mt-6 mb-6` because the wrapper isn't `space-y-6`.
3. **Practice row (`PracticeRow`)** — missing drag handle, uses `rounded-full`
   pills instead of shadcn `Badge`s for the meta row, has a hardcoded
   "Missing: Category" string instead of the dynamic missing-fields list from
   `getPracticeCompleteness`, and the empty-state icon is the wrong size /
   color.

The "no extra wrappers / use literal Tailwind colors when prototype does"
project rule plus the `ie/CLAUDE.md` "rounded-lg = 16px, shadow-sm = shadow-xs"
mapping rules drive the exact class choices below.

## Source files

### ie-prototype (source of truth)
- `ie-prototype/src/components/admin/SeriesDetailView.tsx` — header + action bar + list
- `ie-prototype/src/components/admin/InlinePracticeCard.tsx` — practice row
- `ie-prototype/src/components/ui/badge.tsx` — shadcn Badge (Tailwind v3, `rounded-md`)

### ie (target)
- `ie/app/routes/admin.content.series.$id.tsx` — header + action bar + list
- `ie/app/components/admin/practice-row.tsx` — practice row
- `ie/app/components/ui/*` — primitives (Button, Switch). **No `Badge` primitive exists yet.**

## Detailed Differences

### A. Outer route wrapper / back link

| Aspect | Prototype | ie | Action |
|---|---|---|---|
| Wrapper spacing | `space-y-6` | `space-y-0` (then ad-hoc `mt-4`, `mt-6 mb-6`) | Switch to `space-y-6`, drop the ad-hoc margins. |
| Back affordance | Ghost icon `Button` (ArrowLeft) **inline at the left of the row, with `mt-1`** | `<NavLink>` "Back to Series" placed **above** the row | Move back into the row as a ghost icon button (`text-stone-500 hover:text-stone-900 hover:bg-stone-100 mt-1`). Keep route navigation via `useNavigate` or a `<Link>` wrapping the button. |

`ie/app/routes/admin.content.series.$id.tsx:101-108`

### B. Header row (cover + title + meta)

Prototype: `ie-prototype/src/components/admin/SeriesDetailView.tsx:222-309`

| Element | Prototype | ie | Action |
|---|---|---|---|
| Cover image | `w-16 h-16 rounded-lg object-cover` | `h-16 w-16 rounded-[14px] object-cover` | `rounded-lg` in prototype = **16px** per `ie/CLAUDE.md`, so use `rounded-[16px]`. |
| Cover fallback box | `w-16 h-16 rounded-lg bg-stone-100` with `Folder w-8 h-8 text-stone-300` | `h-16 w-16 rounded-[14px] bg-stone-100` with `Folder h-7 w-7 text-stone-400` | `rounded-[16px]`, icon `h-8 w-8 text-stone-300`. |
| Title row spacing | Title row → `mt-1` description → `mt-2` badges row (no `space-y-*`) | Wrapped in `space-y-2` | Drop the `space-y-2`; use literal `mt-1` on description and `mt-2` on badge row to match the prototype's tighter rhythm. |
| Status badge (Live/Draft) | shadcn `Badge` (`rounded-md` = 14px) with `bg-emerald-100 text-emerald-700 border-emerald-200` or `bg-amber-100 text-amber-700 border-amber-200` | `<span>` pill `inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ...` (no border) | Replace with Badge-shaped span: `inline-flex items-center rounded-[14px] border px-2.5 py-0.5 text-xs font-semibold` plus the prototype's `bg-*-100 text-*-700 border-*-200`. (No `Badge` primitive in `ie/` yet — either add a minimal one in `app/components/ui/badge.tsx` matching the shadcn shape, or inline the classes.) |
| Description | `text-stone-500 text-sm mt-1 max-w-xl` always rendered (falls back to "No description") | `max-w-xl text-sm text-stone-500`, conditional on truthy | Always render, fall back to "No description" string when empty. |
| Type badge | `Badge variant="outline"` Sequential = `bg-blue-50 text-blue-600 border-blue-200` w/ `ListOrdered`, Collection = `bg-purple-50 text-purple-600 border-purple-200` w/ `LayoutGrid` | Hardcoded `<span>` pill, always Sequential, `rounded-full` | Drive from `curriculum` data (Blueprint has an equivalent flag — confirm field name). Match shape: `rounded-[14px] border px-2.5 py-0.5 text-xs`, with the two color recipes above. Icon `w-3 h-3 mr-1` inside. |
| Grade badge | `Badge variant="outline" bg-stone-50 text-stone-500 border-stone-200` | `rounded-full border border-stone-200 bg-stone-50 px-2 py-0.5 text-xs text-stone-500` | Same Badge shape as above (`rounded-[14px]`, `px-2.5 py-0.5`). |
| Counts text | `"{N} practices • {A} achievements • {J} journals"` `text-sm text-stone-400` | `"{N} practices"` only | Show all three; achievements / journals counts can be hardcoded `0` until those queries land (TODO comment). |
| Right-side toolbar | Status switch + label + Edit Series outline button | Same controls; Edit button uses identical classes ✓ | No change. |

### C. Action bar (under header)

Prototype: `ie-prototype/src/components/admin/SeriesDetailView.tsx:311-390`

| Aspect | Prototype | ie | Action |
|---|---|---|---|
| Wrapper | `flex justify-between items-center border-t border-b border-stone-200 py-3` (gap from `space-y-6` on parent) | `mt-6 mb-6 flex flex-wrap items-center justify-end gap-2 border-t border-b border-stone-200 py-3` | Use `flex justify-between items-center border-t border-b border-stone-200 py-3`. Remove `mt-6 mb-6` once parent is `space-y-6`. Remove `flex-wrap`. |
| Left helper text | `<p className="text-sm text-stone-500">Drag practices to reorder. Changes are saved automatically.</p>` | absent | Add it (text always for non-unassigned series). |
| Right buttons gap | implicit `gap-2` via `flex gap-2 items-center` wrapper | `gap-2` directly on outer | Wrap right buttons in a `flex gap-2 items-center` div so left text + right buttons sit on opposite sides. |
| Button order | Sync Durations, Add Achievement, Add Journal, Bulk Import, Add Practice | same order ✓ | No change to order. (Buttons remain `disabled` until backend lands.) |
| Sync Durations icon spacing | `w-4 h-4 mr-2` | `h-4 w-4` (no `mr-2` — but Button likely has built-in icon gap) | Verify: prototype passes explicit `mr-2`; check `ie/`'s `Button` `gap-2` default. If default exists, leave; if not, add `mr-2` on every icon to match. |

### D. Practice row outer card

Prototype: `ie-prototype/src/components/admin/InlinePracticeCard.tsx:334-341`

| Aspect | Prototype | ie | Action |
|---|---|---|---|
| Outer card | `bg-white rounded-lg shadow-sm border-2` + `border-emerald-400` (complete) / `border-stone-200` (incomplete), `transition-colors` | `rounded-[16px] border-2 bg-white shadow-xs transition-colors` + same border-emerald-400/stone-200 | ✓ classes already follow the v4 mapping (`rounded-[16px]` = `rounded-lg`@v3, `shadow-xs` = `shadow-sm`@v3). Keep. |
| Inner row padding | `p-4 flex items-center justify-between gap-3` | `flex items-center justify-between gap-3 p-4` | ✓ |

### E. Practice row — drag handle (MISSING in ie)

Prototype: `InlinePracticeCard.tsx:348-355`

```tsx
<button {...attributes} {...listeners}
  className="cursor-grab active:cursor-grabbing p-1 text-stone-400 hover:text-stone-600 touch-none flex-shrink-0">
  <GripVertical className="w-5 h-5" />
</button>
```

**ie has no GripVertical at all.** It also has no drag-and-drop reordering.
The list container in `ie/` is just `space-y-3`.

Action: add a visual GripVertical button matching the prototype classes
(non-functional placeholder is acceptable per the project's "build the UI,
leave it visually complete, wire to no-op or TODO" rule). Real reordering can
be a follow-up.

### F. Practice row — cover & background image tiles

Prototype: `InlinePracticeCard.tsx:357-425`

| Aspect | Prototype | ie | Action |
|---|---|---|---|
| Cover tile | `w-12 h-12 rounded` (4px), drag-and-drop `<label>` | `h-12 w-12 rounded` button | ✓ shape OK. ie's hover overlay is correct. |
| Cover empty fallback | `ImageIcon w-4 h-4 text-stone-300` + `<span className="text-[8px] text-stone-400 mt-0.5">Cover</span>` (no inner border) | identical ✓ | ✓ |
| BG tile | `w-12 h-12 rounded`, when no bg image: inner div with **`border-2 border-dashed border-stone-200 rounded`** plus `ImageIcon w-4 h-4 text-stone-300` + `<span className="text-[8px] text-stone-400 mt-0.5">BG</span>` | matches structure ✓ | ✓ |

### G. Practice row — day-number tile

Prototype: `w-8 h-8 rounded bg-stone-100 flex items-center justify-center text-stone-700 font-serif font-semibold text-sm flex-shrink-0`
ie: `flex h-8 w-8 flex-shrink-0 items-center justify-center rounded bg-stone-100 font-serif text-sm font-semibold text-stone-700` ✓

### H. Practice row — title + meta badges (MAIN VISUAL GAP)

Prototype: `InlinePracticeCard.tsx:432-500`

The prototype uses shadcn `Badge` (v3 default = `rounded-md` = 14px,
`px-2.5 py-0.5 text-xs font-semibold`). ie uses raw `<span>` pills with
`rounded-full px-2 py-0.5`. **Different shape and different padding.**

Required badges (in this exact order when present):

| # | Condition | Classes |
|---|---|---|
| 1 | `practice.category` present | `Badge variant="outline" text-stone-500 border-stone-300 text-xs` (effectively: `inline-flex items-center rounded-[14px] border border-stone-300 px-2.5 py-0.5 text-xs font-semibold text-stone-500`) |
| 2 | always | grade label badge — same outline classes as #1 |
| 3 | `mediaCount > 0` | `bg-blue-100 text-blue-700 border-blue-200 text-xs gap-1` w/ `Volume2 w-3 h-3` + `"{count} ({LANGS})"` |
| 3' | `mediaCount === 0` | `variant="outline" text-amber-600 border-amber-300 bg-amber-50 text-xs gap-1` w/ `AlertCircle w-3 h-3` + `"No audio"` |
| 4 | `has_journal` | `bg-amber-100 text-amber-700 border-amber-200 text-xs gap-1` w/ `BookOpen w-3 h-3` + `"Journal"` |
| 5 | `isComplete` | `bg-emerald-100 text-emerald-700 border-emerald-200 text-xs gap-1` w/ `CheckCircle2 w-3 h-3` + `"Complete"` |
| 5' | `!isComplete` | plain text `<span className="text-xs text-stone-400">Missing: {missing.join(', ')}</span>` |

`getPracticeCompleteness` (prototype lines 60-74) computes `missing` as a list:
`["Cover image", "Audio/Video", "Description", "Category"]` (any subset).

ie currently:
- Always renders the "No audio" amber pill (no audio/video data wiring yet) ✓ acceptable as placeholder, but classes need swap to Badge shape.
- Hardcodes `Missing: Category` regardless of state ❌. Replace with the
  computed missing list from a local `getPracticeCompleteness(practice)` that
  uses Blueprint fields (`practice.cover?.url`, `practice.description`, no
  category data → category goes in missing always; no media data → audio
  always missing for now). Compute and join.

Action: introduce a `Badge` primitive at `app/components/ui/badge.tsx` (or an
inline helper in `practice-row.tsx`) that matches the shadcn shape:
`inline-flex items-center rounded-[14px] border px-2.5 py-0.5 text-xs font-semibold`
+ `gap-1` when `gap` prop. Use it for badges 1-5 above and in the header
section. Drop `rounded-full` everywhere these pills appear.

### I. Practice row — audio/video drop zones

Prototype: `InlinePracticeCard.tsx:502-599`

ie matches the **empty** state visually:
- `w-12 h-12 rounded border-2 border-dashed border-stone-300 bg-stone-100`
- Icon `w-4 h-4 text-stone-400`, label `text-[8px] font-medium text-stone-400`

This is correct as a placeholder. **No change needed** until media data is
wired. (Filled-state variants — blue/amber/purple — are not reachable yet.)

### J. Practice row — expand & delete buttons

Prototype: shadcn `Button variant="ghost" size="icon"` (which renders as
`h-9 w-9 rounded-md`). Hover: `text-stone-500 hover:text-stone-700 hover:bg-stone-100` for expand, `text-red-500 hover:text-red-700 hover:bg-red-50` for delete.

ie: native `<button className="flex h-9 w-9 items-center justify-center rounded ...">` — close, but uses bare `rounded` (4px) instead of the shadcn Button `rounded-md` (= 14px in prototype, but in v4 ie's Button primitive has its own radius).

Action: use ie's existing `Button` primitive (`variant="ghost" size="icon"`) for both, so radius/padding/focus ring match the rest of the app. Keep the same color pairs.

### K. List container

Prototype: `<div className="space-y-2">` (lines 410, 438)
ie: `<div className="space-y-3">`

Action: change to `space-y-2`.

### L. Empty state

Prototype: `text-center py-16 bg-stone-50 rounded-xl border-2 border-dashed border-stone-200`, icon `Folder w-12 h-12 text-stone-300 mx-auto mb-3`, text `text-stone-500 mb-4`, button `bg-stone-900 hover:bg-stone-800 text-white`.

ie: `rounded-xl border-2 border-dashed border-stone-200 bg-stone-50 py-16 text-center`, icon `Folder mx-auto mb-3 h-10 w-10 text-stone-400`, button wrapped in extra `<div className="flex justify-center">`.

Actions:
- Folder icon → `h-12 w-12 text-stone-300` (not `h-10 w-10 text-stone-400`).
- Remove the `flex justify-center` wrapper around the button — the parent's `text-center` already centers an inline-flex button.

## Code References

- `ie/app/routes/admin.content.series.$id.tsx:101` — outer wrapper uses `space-y-0`
- `ie/app/routes/admin.content.series.$id.tsx:102-108` — back link above row (should be inline icon button)
- `ie/app/routes/admin.content.series.$id.tsx:113,119` — cover uses `rounded-[14px]` (should be 16)
- `ie/app/routes/admin.content.series.$id.tsx:121` — fallback Folder icon `h-7 w-7 text-stone-400` (should be `h-8 w-8 text-stone-300`)
- `ie/app/routes/admin.content.series.$id.tsx:128-137` — status pill is `rounded-full` no border (should be Badge shape)
- `ie/app/routes/admin.content.series.$id.tsx:144-155` — type/grade pills `rounded-full`, hardcoded Sequential, missing achievements/journals counts
- `ie/app/routes/admin.content.series.$id.tsx:181` — action bar `mt-6 mb-6 ... justify-end`
- `ie/app/routes/admin.content.series.$id.tsx:181-226` — missing left helper text
- `ie/app/routes/admin.content.series.$id.tsx:229-242` — empty state icon size + extra wrapper
- `ie/app/routes/admin.content.series.$id.tsx:244` — list `space-y-3` (should be `space-y-2`)
- `ie/app/components/admin/practice-row.tsx:196` — main row OK
- `ie/app/components/admin/practice-row.tsx` — entire file: missing GripVertical, all meta badges are `rounded-full` pills, `Missing: Category` is hardcoded

## Tasks (in execution order)

These are fidelity tasks only — no behavioral changes beyond visual ones.

### T1. Add `Badge` primitive (or inline helper)
- **File:** `ie/app/components/ui/badge.tsx` (new) **or** local helper in row + route
- Recipe: `inline-flex items-center rounded-[14px] border px-2.5 py-0.5 text-xs font-semibold gap-1`
- Variants:
  - `default` (no extra classes — caller passes color trio)
  - `outline` — adds `bg-transparent` and lets caller add bg
- Single export `Badge` accepting `className` so all call sites stay literal-color (per memory rule "use literal Tailwind colors when prototype does").
- **Justification:** ≥6 call sites (header status, header type, header grade, row category, row grade, row audio, row journal, row complete) — passes the "audit primitives, justify new one" bar in `ie/CLAUDE.md`.

### T2. Route — outer wrapper + back link
- `ie/app/routes/admin.content.series.$id.tsx:101` → change `space-y-0` to `space-y-6` and drop `mt-4`, `mt-6 mb-6` on children.
- Replace lines 102-108 (`<NavLink>Back to Series</NavLink>` above row) with an inline ghost icon `Button` at the start of the inner left flex group:
  ```tsx
  <Button variant="ghost" size="icon"
    onClick={() => navigate("/admin/content")}
    className="text-stone-500 hover:text-stone-900 hover:bg-stone-100 mt-1">
    <ArrowLeft className="h-5 w-5" />
  </Button>
  ```
- Wrap left side in `flex items-start gap-4` to match prototype.

### T3. Route — cover image
- Lines 113-122: change `rounded-[14px]` → `rounded-[16px]` on both `<img>` and fallback `<div>`.
- Fallback Folder icon: `h-8 w-8 text-stone-300` (currently `h-7 w-7 text-stone-400`).

### T4. Route — header title + description rhythm
- Drop the `space-y-2` wrapper on the title column.
- Title row + `<Badge>` status side-by-side: `flex items-center gap-3`.
- Description: always render `<p className="text-stone-500 text-sm mt-1 max-w-xl">{curriculum.description || "No description"}</p>`.
- Replace status `<span>` (line 128-137) with `<Badge>` (T1) using `bg-emerald-100 text-emerald-700 border-emerald-200` or `bg-amber-100 text-amber-700 border-amber-200`.

### T5. Route — type / grade / counts row
- Replace lines 144-155 wrapper with `<div className="flex items-center gap-3 mt-2">`.
- Type badge: drive from `curriculum` (confirm field). Render Sequential (`bg-blue-50 text-blue-600 border-blue-200` + `<ListOrdered className="w-3 h-3 mr-1" />`) or Collection (`bg-purple-50 text-purple-600 border-purple-200` + `<LayoutGrid className="w-3 h-3 mr-1" />`).
- Grade badge: `<Badge>` with `bg-stone-50 text-stone-500 border-stone-200`.
- Counts: `<span className="text-sm text-stone-400">{lessons.length} practices • 0 achievements • 0 journals</span>` (TODO: wire achievements/journals counts when those queries land).

### T6. Route — action bar
- Line 181: change to `flex justify-between items-center border-t border-b border-stone-200 py-3` (no `mt-6 mb-6`, no `flex-wrap`, no `justify-end`).
- Add left side: `<p className="text-sm text-stone-500">Drag practices to reorder. Changes are saved automatically.</p>`.
- Wrap the existing buttons in `<div className="flex gap-2 items-center">`.
- Audit each Button — if ie's Button primitive does not auto-gap icons, add `mr-2` on each icon to match prototype.

### T7. Route — list container
- Line 244: `space-y-3` → `space-y-2`.

### T8. Route — empty state
- Lines 229-242:
  - Folder icon: `h-12 w-12 text-stone-300` (currently `h-10 w-10 text-stone-400`).
  - Remove `<div className="flex justify-center">` wrapper around the button — keep just `<Button ...>` directly under the centered parent.

### T9. PracticeRow — add drag handle (visual only)
- `ie/app/components/admin/practice-row.tsx`, before the cover button (line ~208), add:
  ```tsx
  <button type="button"
    className="cursor-grab active:cursor-grabbing p-1 text-stone-400 hover:text-stone-600 touch-none flex-shrink-0"
    aria-label="Drag to reorder"
    title="Drag to reorder (coming soon)">
    <GripVertical className="h-5 w-5" />
  </button>
  ```
- Import `GripVertical` from `lucide-react`.
- Leave non-functional with a `// TODO(reorder): wire to dnd-kit + LessonUpdateOne order mutation` comment.

### T10. PracticeRow — replace meta pills with Badge
- Lines 301-329: rewrite the meta row to use `<Badge>` from T1.
- Replace each `<span className="inline-flex items-center rounded-full ...">` with a `<Badge className="...">`.
- Keep wrapper `mt-1 flex flex-wrap items-center gap-1.5`.
- Each badge keeps its existing color trio (the colors are already correct — only the shape is wrong).

### T11. PracticeRow — dynamic missing list
- Replace the hardcoded `<span className="text-stone-400">Missing: Category</span>` (line 327) with the prototype's logic:
  ```ts
  function getPracticeCompleteness(p: Practice) {
    const hasImage = !!p.cover?.url;
    const hasMedia = false;            // TODO(media): wire when LessonMedia lands
    const hasDescription = !!p.description;
    const hasCategory = !!category;    // currently visual-only state
    const missing: string[] = [];
    if (!hasImage) missing.push("Cover image");
    if (!hasMedia) missing.push("Audio/Video");
    if (!hasDescription) missing.push("Description");
    if (!hasCategory) missing.push("Category");
    return { isComplete: missing.length === 0, missing };
  }
  ```
- Wire `isComplete` to the outer card border and the Complete badge.
- Render `<span className="text-xs text-stone-400">Missing: {missing.join(", ")}</span>` when not complete.

### T12. PracticeRow — expand/delete buttons use Button primitive
- Lines 366-391: replace the two native `<button>`s with `<Button variant="ghost" size="icon">` from `~/components/ui/button`, keeping the same color classes (`text-stone-500 hover:text-stone-700 hover:bg-stone-100` / `text-red-500 hover:text-red-700 hover:bg-red-50`).

### T13. Visual review pass
Per `ie/CLAUDE.md`:
- Run `ie/` and `ie-prototype/` side-by-side at 100% zoom.
- Compare: header back-link placement, cover radius, all badge shapes (rounded-md not rounded-full), counts text, action bar helper text, list gap, empty-state icon size, practice-row drag handle visible, dynamic missing list, button shapes.
- Fix any residual mismatches.

## Open Questions

None — the comparison is exhaustive against the two source files.
A few items are bounded by data not yet available in `ie/`:

- **Type flag (Sequential vs Collection):** confirm the Blueprint
  `curriculum` field that drives this. If not exposed yet, hardcode
  Sequential and add `// TODO(curriculum-type): drive from curriculum.<field>`.
- **Achievements / journals counts:** no queries exist yet in `ie/`. T5
  hardcodes `0` with a TODO.
- **Audio/video data:** no LessonMedia query yet in `ie/`. T11 keeps
  `hasMedia = false` so "No audio" + "Missing: Audio/Video" always show, which
  matches the current placeholder behavior.
