---
date: 2026-05-11T20:23:16-05:00
researcher: sergio
git_commit: 94efa143010feb4e1fcffed2fe409c0acf4b3555
branch: feat/graphql-schema-remediation
repository: ie
topic: "Admin narrators — wire the avatar upload to PUT /admin/narrator-avatar; check when the upload is required"
tags: [research, codebase, admin, narrators, avatar, upload, multipart]
status: complete
autonomy: autopilot
last_updated: 2026-05-11
last_updated_by: sergio
---

# Research: Admin narrators — avatar upload via `PUT /admin/narrator-avatar`

## Research Question
The admin "New Narrator" form (and the per-row avatar tile) currently has a
visual-only avatar picker with a `TODO(narrator-avatar): wire upload when
endpoint exists`. The user pointed to the endpoint
`https://api-test.blueprint.kids/doc/#/default/put_admin_narrator_avatar` and
asked us to check **when the upload is required** and correct the flow
accordingly.

## Summary
The REST endpoint is **`PUT /admin/narrator-avatar`**, `multipart/form-data`,
requiring two form fields: **`file`** (the image, PNG per the spec) and
**`_id`** (the narrator's `_id`, with the leading underscore). It is
authenticated with the standard `access-token` header that `api(...)` already
injects.

Because the endpoint requires the narrator's `_id`, **the avatar upload is
only possible after the narrator has been created** (the `_id` does not exist
before the GraphQL `narratorsCreateOne` returns it). The right pattern — and
the one already used in this codebase for `/admin/lesson-cover` (see
`app/components/admin/practice-dialog.tsx:107-162`) — is a **two-step
"create-then-upload" sequence in the create dialog**, plus an **in-place
upload on the row** for existing narrators.

The current admin narrator UI is wired for everything except the upload:
- The dialog's file `<input>` and the row's clickable avatar tile both exist
  but their `onChange` handlers are no-op `TODO`s
  (`app/routes/admin.narrators/_components/NarratorDialog.tsx:171-179`,
  `app/routes/admin.narrators/_components/NarratorRow.tsx:250-257`).
- The GraphQL schema already exposes `narrator.avatar { url, type }` and the
  row already renders it when present
  (`app/queries/narrators.ts:13-16`,
  `app/routes/admin.narrators/_components/NarratorRow.tsx:236-249`).
- The same FormData + `api("...", { method: "PUT", body: fd })` pattern is in
  use for sibling endpoints — no new infrastructure is required.

## Detailed Findings

### 1. The REST endpoint (authoritative spec)
Source: `https://api-test.blueprint.kids/doc/swagger-ui-init.js` (the
`/doc/` page is a static Swagger UI; the spec is inlined as
`window.options.swaggerDoc` inside `swagger-ui-init.js`).

The `put_admin_narrator_avatar` entry:

```
PUT /admin/narrator-avatar
consumes: multipart/form-data
parameters:
  - name: file   in: formData  type: file    required: true   description: "png"
  - name: _id    in: formData  type: string  required: true   description: "_id of narrator"
  - name: body   in: body      schema: { _id: any }            (Swagger artifact, ignore)
security: apiKeyAuth (header `access-token`)
responses: default (no documented shape)
```

Key constraints:
- **`_id` is mandatory** — the upload cannot precede narrator creation.
- **Form field is `_id` (with leading underscore)**, not `id`. This matches
  the sibling lesson endpoint and differs from the curriculum one — see
  §4 below.
- **Content-Type is `multipart/form-data`.** `app/lib/api.ts:49-53` already
  detects `body instanceof FormData` and skips the default
  `application/json` header so the browser sets the multipart boundary.
- **No documented success body.** Sibling cover-upload calls in the codebase
  also ignore the response and rely on revalidating the GraphQL list to
  refresh `narrator.avatar.url` (e.g. `practice-row.tsx:188-200`).

### 2. Where the upload needs to be wired in `ie/`
Two call sites, both currently a `TODO(narrator-avatar)`:

**(a) `NarratorDialog.tsx` — "New Narrator" create form**
`app/routes/admin.narrators/_components/NarratorDialog.tsx:155-180`

```
{/* Avatar dropzone — visual only for v1. */}
{/* TODO(narrator-avatar): wire upload when endpoint exists */}
<label …>
  <span>Select avatar (upload coming soon)</span>
  <input
    type="file"
    accept="image/*"
    className="hidden"
    onChange={() => {
      // TODO(narrator-avatar): wire upload when endpoint exists
    }}
  />
</label>
```

The submit flow already calls `narratorsCreateOne` and reads `recordId` /
`payload.record._id` from the returned envelope
(`NarratorDialog.tsx:71-99`). That `_id` is what the avatar endpoint needs.

**(b) `NarratorRow.tsx` — per-row avatar tile (edit mode)**
`app/routes/admin.narrators/_components/NarratorRow.tsx:230-258`

```
{/* TODO(narrator-avatar): wire upload when endpoint exists */}
<label
  className="w-12 h-12 rounded-full bg-muted … cursor-pointer …"
  title="Avatar — upload not yet supported"
>
  {narrator.avatar?.url ? <img … /> : <User … />}
  <input
    type="file"
    accept="image/*"
    className="hidden"
    onChange={() => {
      // TODO(narrator-avatar): wire upload when endpoint exists
    }}
  />
</label>
```

The row already has `narrator._id` in scope, so this case is straightforward:
upload directly on file pick, then refresh the row's local state from the
mutation response or a parent revalidate.

### 3. When the upload is required vs optional (the actual answer)
The endpoint itself **always requires** `_id` + `file`. From the product flow
side:

- **In the create dialog**, the avatar is **optional** — the user may submit
  the form with no file. If a file is present, it can only be sent **after**
  `narratorsCreateOne` succeeds and returns `recordId`. So the create flow is
  a **conditional two-step** mirroring `practice-dialog.tsx:134-145`:
  1. `narratorsCreateOne` → get `recordId`.
  2. If `coverFile` (rename: `avatarFile`) is non-null, build `FormData`
     with `_id` + `file`, `PUT /admin/narrator-avatar`.
  3. On step-2 failure, surface a partial-success toast (`practice-dialog`
     uses `toast.warning("Practice created — cover upload failed.")`) and
     still close the dialog. The narrator exists; the user can retry from
     the row.
- **From the existing row**, the upload is always **independent** — narrator
  already exists, picking a file fires the PUT immediately, then revalidate
  the list (or merge the updated `avatar` into `narrator` state).

The CURRENT dialog also blocks even a no-avatar create flow with the
"upload coming soon" copy, which is misleading once we ship — the copy
should be replaced with a normal "Choose image" / preview affordance.

### 4. Sibling upload patterns already in this codebase
Three existing PUTs follow the exact same template. They confirm both the
client-side recipe and a subtle field-name gotcha:

| Endpoint | Form fields | Caller |
|---|---|---|
| `PUT /admin/lesson-cover` | `_id`, `file` | `app/components/admin/practice-dialog.tsx:137-140`, `app/components/admin/practice-row.tsx:190-193` |
| `PUT /admin/curriculum-cover` | `id`, `file` *(no underscore)* | `app/components/admin/series-dialog.tsx:171-177` |
| `PUT /admin/narrator-avatar` | `_id`, `file` | (not yet wired) |

The narrator-avatar field-name matches **lesson-cover** (`_id`), **not**
curriculum-cover (`id`). The Swagger spec confirms this:
- `/admin/lesson-cover`: `"_id of resources category"`
- `/admin/curriculum-cover`: `"curriculum _id"` but the parameter `name`
  is literally `id`
- `/admin/narrator-avatar`: `"_id of narrator"`, parameter `name` is `_id`

In other words: copy the **lesson-cover** code path, not the curriculum-cover
one, for the narrator avatar — otherwise the upload will silently 4xx.

The full client recipe (from `practice-dialog.tsx:134-145`):

```ts
let coverFailed = false;
if (coverFile) {
  try {
    const fd = new FormData();
    fd.append("_id", recordId);   // underscore — not "id"
    fd.append("file", coverFile);
    await api("/admin/lesson-cover", { method: "PUT", body: fd });
  } catch (uploadErr) {
    coverFailed = true;
    console.error("[lesson-cover] upload failed", uploadErr);
  }
}
```

For an in-place row upload (from `practice-row.tsx:188-200`):

```ts
async function handleCoverPick(file: File) {
  try {
    const fd = new FormData();
    fd.append("_id", practiceId); // underscore — not "id"
    fd.append("file", file);
    await api("/admin/lesson-cover", { method: "PUT", body: fd });
    toast.success("Cover updated");
    onChange();
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Cover upload failed";
    toast.error(msg);
  }
}
```

### 5. Auth / transport plumbing — already in place
- `app/lib/api.ts:45-71` is the only client we need:
  - Auto-injects `access-token` header from `getToken()`.
  - Detects `FormData` and skips the default JSON Content-Type so the
    browser supplies the multipart boundary (`api.ts:49-53`).
  - Prepends `env.REST_URL` (Vite `VITE_REST_URL`) unless the path is
    absolute (`api.ts:69`).
  - Handles 401 → single refresh → retry (`api.ts:79-86`).
- The 500 / safe-loader doctrine (CLAUDE.md "Resilient loaders") applies to
  GraphQL **loaders**, not REST mutations like this one. Mutations are
  expected to toast on failure — same convention as lesson-cover.

### 6. Avatar already exists in the GraphQL schema and is rendered
Nothing needs to be added to GraphQL — the `narrator.avatar { url, type }`
shape is already selected and rendered:

- Query selection: `app/queries/narrators.ts:13-16` (and again in the
  `FindOne`, `CreateOne.record`, `UpdateOne.record` selection sets).
- Row render: `app/routes/admin.narrators/_components/NarratorRow.tsx:236-249`
  branches on `narrator.avatar?.url` for the `<img>` vs `<User />` fallback.
- TypeScript surface: `NarratorRowNarrator`
  (`NarratorRow.tsx:26-36`) types `avatar` as
  `{ url?: string | null; type?: string | null } | null`.

After a successful PUT, the easiest way to surface the new image is to
refetch the list (the existing `revalidator.revalidate()` idiom used by
`practice-dialog.tsx:153` / `series-dialog.tsx:194`) — or, if we want to
keep the optimistic local state pattern this route already uses (`setNarrators`
updates in `admin.narrators.tsx:96-105`), merge a fresh `narrator.avatar`
into the existing record by re-reading it via `narratorsFindOne` /
re-running the loader.

## Code References

| File | Line | Description |
|------|------|-------------|
| `app/routes/admin.narrators.tsx` | 16-31 | Loader for narrators list (GraphQL `narratorsFindMany` wrapped in `safe()`) |
| `app/routes/admin.narrators.tsx` | 96-114 | Local-state list updates on row update/delete and dialog create |
| `app/routes/admin.narrators/_components/NarratorDialog.tsx` | 62-107 | `narratorsCreateOne` submit; this is where step 2 (avatar PUT) needs to chain after `recordId` is in hand |
| `app/routes/admin.narrators/_components/NarratorDialog.tsx` | 155-180 | The TODO avatar dropzone — no-op `onChange` today |
| `app/routes/admin.narrators/_components/NarratorRow.tsx` | 26-36 | `NarratorRowNarrator` type — already includes `avatar: { url, type }` |
| `app/routes/admin.narrators/_components/NarratorRow.tsx` | 230-258 | The TODO row avatar tile — no-op `onChange` today |
| `app/queries/narrators.ts` | 13-16, 31-34, 53-56, 81-84 | `avatar { url type }` selection in every narrator query/mutation |
| `app/lib/api.ts` | 45-71 | `api()` with `FormData` detection and `access-token` header |
| `app/components/admin/practice-dialog.tsx` | 134-145 | **Reference pattern** — two-step create-then-PUT with partial-success toast |
| `app/components/admin/practice-row.tsx` | 188-200 | **Reference pattern** — in-place PUT on file pick |
| `app/components/admin/series-dialog.tsx` | 168-189 | Sibling pattern that uses `id` (no underscore) — **don't copy this verbatim** for the narrator |

## Resolved decisions (2026-05-11)

User answered the open questions; these are the ground rules for the plan
that will follow:

1. **Avatar is optional in the create dialog.** Submit is allowed with no
   file. If a file is present, upload runs in step 2 after
   `narratorsCreateOne` returns `_id`. Mirror `practice-dialog.tsx:134-145`,
   including the partial-success toast on step-2 failure.
2. **`accept="image/png,image/jpeg"`** on both file inputs (dialog dropzone
   and row tile). Matches `practice-row.tsx:222`. The endpoint advertises
   PNG only — if the backend rejects JPEG in practice, we'll narrow later,
   but admin-UI consistency wins here.
3. **Refresh after upload uses `useRevalidator().revalidate()`.** Same
   pattern as `practice-dialog.tsx:153` and `series-dialog.tsx:194`. Avoids
   bespoke local-state splicing of the new `avatar.url`.
4. **Client-side size cap of 5 MB.** Reject larger files at pick time with
   a `toast.error`. No sibling endpoint enforces this today — narrator
   avatar is introducing the convention; revisit if we apply it elsewhere.

## Still-open (not blocking implementation)

- **"Remove avatar" affordance.** The swagger excerpt I read documents
  upload only, no delete. Defer until/unless a delete endpoint surfaces.
- **Shipping copy.** Replace "Select avatar (upload coming soon)" in the
  dialog and the "Avatar — upload not yet supported" tooltip in the row.
  Picking final strings is a plan-phase concern, not research.

## Appendix

- **Architecture notes**
  - REST mutations from the admin UI go through `api()` in
    `app/lib/api.ts`, which already handles `FormData` + `access-token`.
  - GraphQL reads/writes go through `gqlClient` (graphql-request) — see
    `app/lib/graphql.ts`. The narrator-avatar endpoint is REST, not
    GraphQL, which is the same split used for every other artwork/cover
    upload in this codebase.
  - The route already follows the resilient-loader pattern from
    `CLAUDE.md` (`safe()` wrapper at `admin.narrators.tsx:18-23`). REST
    mutations are exempt and toast on failure.
- **Convention gotcha**
  - `_id` vs `id` in form fields is inconsistent across endpoints.
    `/admin/lesson-cover` and `/admin/narrator-avatar` use `_id`;
    `/admin/curriculum-cover` uses `id`. Copy from `practice-dialog.tsx`,
    not `series-dialog.tsx`, when wiring the narrator avatar.
- **Related thoughts/**
  - No prior research doc on narrator avatar; nearest neighbor is
    `thoughts/sergio/research/2026-05-08-series-detail-practices-rows-fidelity.md`
    (different topic, same area of the admin UI).
