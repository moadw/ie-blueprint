---
date: 2026-05-11T20:30:00-05:00
topic: "Admin narrator avatar upload — PUT /admin/narrator-avatar"
researcher: sergio
git_commit: 94efa143010feb4e1fcffed2fe409c0acf4b3555
branch: feat/graphql-schema-remediation
target_branch: feat/narrator-avatar-upload
repository: ie
tags: [plan, admin, narrators, avatar, upload, multipart]
status: completed
autonomy: autopilot
last_updated: 2026-05-11
last_updated_by: phase-running
---

# Admin Narrator Avatar Upload — Implementation Plan

## Overview

Wire the existing visual-only avatar dropzone (create dialog) and per-row
avatar tile to the `PUT /admin/narrator-avatar` REST endpoint. After this
plan, admin users can attach a PNG/JPEG avatar when creating a narrator and
swap the avatar on any existing narrator row.

- **Motivation**: Both call sites currently ship as `TODO(narrator-avatar):
  wire upload when endpoint exists`. The endpoint exists
  (`https://api-test.blueprint.kids/doc/#/default/put_admin_narrator_avatar`)
  and the rest of the admin UI already uses the same multipart-upload
  pattern (`/admin/lesson-cover`, `/admin/curriculum-cover`). Closing the
  gap unblocks the admin avatar workflow with no schema or backend work.
- **Related**:
  - `thoughts/sergio/research/2026-05-11-admin-narrator-avatar-upload.md`
  - `app/routes/admin.narrators/_components/NarratorDialog.tsx:155-180`
  - `app/routes/admin.narrators/_components/NarratorRow.tsx:230-258`
  - Reference impl: `app/components/admin/practice-dialog.tsx:134-145`,
    `app/components/admin/practice-row.tsx:188-200`

## Current State Analysis

- The narrator list route is wired end-to-end except for the avatar upload:
  - Loader fetches via GraphQL: `app/routes/admin.narrators.tsx:16-31`.
  - Local-state list with create/update/delete merges:
    `app/routes/admin.narrators.tsx:96-114`.
- The dialog's file `<input>` is a no-op `onChange`
  (`NarratorDialog.tsx:171-179`) and shows the placeholder copy
  "Select avatar (upload coming soon)" (`NarratorDialog.tsx:168-169`).
- The row's clickable avatar tile is similarly inert
  (`NarratorRow.tsx:250-257`) with tooltip
  "Avatar — upload not yet supported" (`NarratorRow.tsx:234`).
- `narrator.avatar { url, type }` is already selected in every narrator
  query (`app/queries/narrators.ts:13-16, 31-34, 53-56, 81-84`) and the row
  already renders it when present (`NarratorRow.tsx:236-249`).
- `app/lib/api.ts:45-71` is the only HTTP client we need: it injects the
  `access-token` header, prepends `env.REST_URL`, and detects `FormData` to
  skip the default JSON Content-Type so the browser sets the multipart
  boundary itself.
- The codebase already has the exact two-shape recipe we'll reuse:
  - **Create dialog → upload chained after recordId**:
    `practice-dialog.tsx:134-145`. Uses `fd.append("_id", recordId)` (note
    the underscore) and surfaces a partial-success toast via
    `toast.warning("Practice created — cover upload failed.")` on step-2
    failure, then `revalidator.revalidate()` (line 153).
  - **In-row upload on file pick**:
    `practice-row.tsx:188-200`. Uses the same `_id` + `file` shape and
    fires `onChange()` to refresh the list.
- Field-name gotcha: `/admin/curriculum-cover` uses `id` (no underscore) —
  `series-dialog.tsx:172` — **do not** copy from that file. The narrator
  endpoint takes `_id` like `/admin/lesson-cover`.
- `useRevalidator` is already imported in the admin pattern
  (`practice-dialog.tsx:2,56,153`) but not yet in
  `NarratorDialog.tsx`/`NarratorRow.tsx`; we'll add it in both places.

## Desired End State

- Picking a PNG/JPEG ≤ 5 MB in the **New Narrator** dialog and submitting
  the form creates the narrator AND uploads the avatar; the new row in the
  list shows the avatar without a page reload.
- Submitting the dialog with **no** file still works (avatar is optional).
- If the GraphQL create succeeds but the avatar PUT fails, the dialog
  closes, the row appears without an avatar, and a
  `toast.warning("Narrator created — avatar upload failed.")` is shown.
- Picking a PNG/JPEG ≤ 5 MB on an existing **row's avatar tile** uploads
  immediately and the new avatar appears after revalidation.
- Files outside `image/png,image/jpeg` are filtered by the OS picker
  (`accept=` attribute) and files > 5 MB are rejected at pick time with
  `toast.error("Avatar must be 5 MB or smaller.")`.
- Placeholder copy ("upload coming soon" / "upload not yet supported") is
  removed from both call sites.

## What We're NOT Doing

- No "Remove avatar" affordance — the swagger entry I read documents only
  upload, no delete endpoint.
- No drag-and-drop reorder of the narrator list (separate concern).
- No GraphQL schema changes — `narrator.avatar { url, type }` is already
  selected everywhere.
- No backend-side validation work; size cap is purely client-side.
- No file-format coercion (e.g. resizing/transcoding on the client) — pass
  the picked file through.
- No retry UI for failed in-row uploads beyond the existing toast — the
  user can simply pick the file again.

## Implementation Approach

- Single phase: both call sites share the same `api()` helper and the same
  FormData shape, so splitting them only adds session overhead. ~6 edits
  across 2 files. Manual verification is one create flow + one row swap.
- Reuse the existing sibling recipe (`practice-dialog.tsx` /
  `practice-row.tsx`) literally — same `_id` field name, same partial-
  success toast wording shape, same `revalidator.revalidate()` refresh.
- Branch from `main` as `feat/narrator-avatar-upload` (the current
  `feat/graphql-schema-remediation` branch is unrelated; see `ie/CLAUDE.md`
  "New feature branch + final commit" rule).
- Single commit at the end of the phase (per `ie/CLAUDE.md` rule 5).

## Quick Verification Reference

- Typecheck: `npm run typecheck` (runs `react-router typegen && tsc`)
- Dev server: `npm run dev`
- Build: `npm run build`

There is no test runner wired in `ie/package.json`; verification is
typecheck + build + manual flows in the dev server.

---

## Phase 1: Wire the avatar upload at both call sites

### Overview

After this phase, the **New Narrator** dialog uploads an optional avatar
after `narratorsCreateOne` returns, and the per-row avatar tile uploads
immediately on file pick — both via `PUT /admin/narrator-avatar` with
`FormData{ _id, file }`, behind a 5 MB / `image/png,image/jpeg` client
filter, with `revalidator.revalidate()` refresh and a partial-success toast
on step-2 failure in the create flow.

### Changes Required:

#### 1. New Narrator dialog
**File**: `app/routes/admin.narrators/_components/NarratorDialog.tsx`
**Changes**:
- Import `useRevalidator` from `react-router`; instantiate `const
  revalidator = useRevalidator();` inside `NarratorDialog`.
- Import `api` from `~/lib/api`.
- Add `const [avatarFile, setAvatarFile] = useState<File | null>(null);`
  alongside the existing `form`/`submitting` state. Reset it whenever
  `open` flips true (next to the existing `setForm(EMPTY_FORM)` reset at
  `NarratorDialog.tsx:49-51`).
- Replace the no-op `<input … onChange={() => {}}>` (lines 171-179) with:
  - `accept="image/png,image/jpeg"`.
  - An `onChange` that reads `e.target.files?.[0]`, rejects > 5 MB with
    `toast.error("Avatar must be 5 MB or smaller.")` and clears the
    input value, otherwise sets `avatarFile`. Always reset
    `e.target.value = ""` after handling.
- Replace the dropzone copy "Select avatar (upload coming soon)"
  (`NarratorDialog.tsx:168-169`) so it shows the picked filename when
  `avatarFile` is non-null and a normal "Choose image" prompt otherwise.
  No new components — inline `<span>` swap. Keep the existing
  `ImagePlus` icon and the dashed `<label>` styling.
- Remove the two `TODO(narrator-avatar): wire upload when endpoint exists`
  comments (lines 156 and 176-177).
- In `handleSubmit` (lines 62-107): after `onCreated(created)` is
  available, if `avatarFile` is non-null AND `created._id` is truthy,
  build `FormData`, append `_id` (underscore, matching
  `practice-dialog.tsx:137-140`) and `file`, then
  `await api("/admin/narrator-avatar", { method: "PUT", body: fd })`
  inside a `try/catch`.
- On step-2 failure: `toast.warning("Narrator created — avatar upload
  failed.")` and `console.error("[narrator-avatar] upload failed",
  uploadErr)`. Do NOT throw — the narrator is already created.
- On step-2 success: keep the existing
  `toast.success("Narrator created")` exactly as today.
- After either step-2 branch, call `revalidator.revalidate()` so the
  loader re-runs and the row picks up `avatar.url`. (The optimistic
  `onCreated` already inserts the row without the avatar; the
  revalidation patches the URL in.)

#### 2. Narrator row avatar tile
**File**: `app/routes/admin.narrators/_components/NarratorRow.tsx`
**Changes**:
- Import `useRevalidator` from `react-router`.
- Import `api` from `~/lib/api`.
- Instantiate `const revalidator = useRevalidator();` inside
  `NarratorRow`.
- Add a `uploadingAvatar` boolean state (drives a subtle loading state on
  the tile — see below).
- Add `handleAvatarPick(file: File)` mirroring
  `practice-row.tsx:188-200`: validate ≤ 5 MB (else `toast.error("Avatar
  must be 5 MB or smaller.")`); `FormData{ _id: narrator._id, file }`;
  `await api("/admin/narrator-avatar", { method: "PUT", body: fd })`;
  on success `toast.success("Avatar updated")` and
  `revalidator.revalidate()`; on failure `toast.error(err.message ??
  "Avatar upload failed")`. Wrap in a `try/finally` to clear
  `uploadingAvatar`.
- Replace the no-op `<input … onChange={() => {}}>` (lines 250-257) with
  `accept="image/png,image/jpeg"` and an `onChange` that calls
  `handleAvatarPick`, then resets `e.target.value = ""`.
- Replace the `title="Avatar — upload not yet supported"` tooltip
  (line 234) with `title="Click to upload avatar"`.
- Remove the `TODO(narrator-avatar)` comments at lines 231 and 254-255.
- While `uploadingAvatar` is true, show a `Loader2` spin overlay inside
  the tile (use the `Loader2` already imported at line 6 — no new icon).
  The existing avatar/`<User />` fallback stays underneath.

### Success Criteria:

#### Automated Verification:

- [x] Typecheck passes: `npm run typecheck`
- [x] Build passes: `npm run build`
- [x] No `TODO(narrator-avatar)` left in `app/routes/admin.narrators/`: `! grep -R "TODO(narrator-avatar)" app/routes/admin.narrators`
- [x] Both call sites hit the endpoint: `grep -n "/admin/narrator-avatar" app/routes/admin.narrators/_components/*.tsx` returns exactly 2 occurrences (one in `NarratorDialog.tsx`, one in `NarratorRow.tsx`).
- [x] Both call sites use the `_id` (underscore) form field, not `id`: `grep -n 'fd.append("id"' app/routes/admin.narrators/_components/*.tsx` returns no matches, and `grep -n 'fd.append("_id"' app/routes/admin.narrators/_components/*.tsx` returns 2.
- [x] Both call sites use `accept="image/png,image/jpeg"`: `grep -nE 'accept="image/png,image/jpeg"' app/routes/admin.narrators/_components/*.tsx` returns 2.

#### Automated QA:

- [ ] Browser-use agent: log in as admin, open `/admin/narrators`, click **Add Narrator**, fill name "QA Narrator", pick a known PNG ≤ 5 MB via the dropzone, submit. Assert: (a) dialog closes, (b) a row labelled "QA Narrator" appears in the list within 3 s, (c) the row's avatar tile renders an `<img>` (not the `<User />` fallback) within 5 s after revalidation. Cleanup: delete the row.
- [ ] Browser-use agent: from the same list, pick a different PNG ≤ 5 MB on an existing row's avatar tile. Assert: a success toast appears and the row's `<img src>` changes within 5 s. (Use a fixture with a known SHA so the change is detectable.)
- [ ] Browser-use agent: attempt to pick a > 5 MB JPEG via the row tile. Assert: a `toast.error` reading "Avatar must be 5 MB or smaller." appears and no network request to `/admin/narrator-avatar` fires.
- [ ] Browser-use agent: with `VITE_REST_URL` overridden to an unreachable host before the dialog submit (so GraphQL still succeeds via `VITE_GRAPHQL_URL` but REST fails), submit the create flow with a valid PNG. Assert: the row still appears (GraphQL succeeded) and a `toast.warning` reading "Narrator created — avatar upload failed." is shown.

#### Manual Verification:

- [ ] Visual side-by-side at zoom 100%: the new dropzone affordance in the dialog still matches the prototype's spacing/rounded-[14px] border and the row's tile still renders the focus/hover ring per `ie/CLAUDE.md` "Hover/focus states are mandatory".
- [ ] Pick a JPEG via the dialog file picker on macOS Safari to confirm the OS dialog honors the `accept` attribute (Safari is the laxest and worth eyeballing once).

**Implementation Note**: After this phase, pause for manual confirmation. Per `ie/CLAUDE.md` rule 5, make a single final commit on `feat/narrator-avatar-upload` (branched from `main`) once verification passes. Do not commit mid-phase.

---

## Appendix

- **Follow-up plans**:
  - "Remove avatar" affordance — pending a delete endpoint on the
    backend; not in this plan's scope.
- **Derail notes**:
  - `/admin/curriculum-cover` uses `id` (no underscore) while
    `/admin/lesson-cover` and `/admin/narrator-avatar` use `_id`. Worth
    a one-line note in `ie/CLAUDE.md` someday — out of scope here.
  - `series-dialog.tsx:172` could share an `uploadCover()` helper with
    `practice-dialog.tsx` and this plan; deferred to avoid scope creep.
- **References**:
  - Research: `thoughts/sergio/research/2026-05-11-admin-narrator-avatar-upload.md`
  - Swagger source (inlined in `https://api-test.blueprint.kids/doc/swagger-ui-init.js`): the `/admin/narrator-avatar` PUT entry — `multipart/form-data`, required `file` + `_id`, auth via `access-token`.
  - Sibling impls: `app/components/admin/practice-dialog.tsx:134-145`, `app/components/admin/practice-row.tsx:188-200`.
  - HTTP client: `app/lib/api.ts:45-71` (FormData detection at lines 49-53).
