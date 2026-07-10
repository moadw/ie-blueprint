import { api } from "~/lib/api";

/**
 * Single source of the group-cover upload path.
 *
 * `/common/group-cover` is the teacher-accessible endpoint (`access-token`
 * auth). It replaced the earlier admin-only `/admin/group-cover`; the group
 * cover now lives solely under `/common`. This constant is the only place the
 * path lives, so any future move is a one-line change. Mirrors the class-cover
 * upload in `app/components/admin/practice-row.tsx`.
 */
const GROUP_COVER_PATH = "/common/group-cover";

/**
 * Upload a cover image for a group. Builds the multipart body the Blueprint
 * endpoint expects: `group` = the group `_id`, `file` = the image. `api()`
 * omits Content-Type for FormData (so the browser sets the multipart boundary)
 * and attaches `access-token` from the in-memory token.
 */
export function uploadGroupCover(
  groupId: string,
  file: File,
): Promise<unknown> {
  const fd = new FormData();
  fd.append("group", groupId); // group-cover uses field "group", not "_id"
  fd.append("file", file);
  return api(GROUP_COVER_PATH, { method: "PUT", body: fd });
}
