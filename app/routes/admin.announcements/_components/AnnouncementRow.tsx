import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { ConfirmDialog } from "~/components/ui/alert-dialog";
import { Switch } from "~/components/ui/switch";
import { toast } from "~/components/ui/toast";
import { toErrorMessage } from "~/lib/errors";
import { gqlClient } from "~/lib/graphql";
import {
  AnnouncementDeleteOneDocument,
  AnnouncementUpdateOneDocument,
} from "~/mutations/announcements";
import { AnnouncementDialog } from "./AnnouncementDialog";

export type AnnouncementRowAnnouncement = {
  _id: string;
  message?: string | null;
  type?: string | null;
  active?: boolean | null;
  createdAt?: string | null;
};

export interface AnnouncementRowProps {
  announcement: AnnouncementRowAnnouncement;
  onChanged: () => void;
}

export function AnnouncementRow({
  announcement,
  onChanged,
}: AnnouncementRowProps) {
  const active = announcement.active ?? false;
  const [togglingActive, setTogglingActive] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleToggleActive(next: boolean) {
    setTogglingActive(true);
    try {
      const data = await gqlClient.request(AnnouncementUpdateOneDocument, {
        _id: announcement._id,
        record: { active: next },
      });
      // ErrorInterface has no concrete implementations, so codegen narrows the
      // payload `error` to `never`. Cast to read the selected `{ message }`.
      const payload = data.AnnouncementUpdateOne as
        | { error?: { message?: string | null } | null }
        | null
        | undefined;
      if (payload?.error?.message) {
        toast.error(payload.error.message);
        return;
      }
      toast.success(
        next ? "Announcement activated" : "Announcement deactivated",
      );
      onChanged();
    } catch (err) {
      toast.error(toErrorMessage(err, "Failed to update announcement"));
    } finally {
      setTogglingActive(false);
    }
  }

  async function handleConfirmDelete() {
    setDeleting(true);
    try {
      // AnnouncementDeleteOne returns a bare String — no payload envelope.
      // Backend failures throw via graphql-request and hit the catch below.
      await gqlClient.request(AnnouncementDeleteOneDocument, {
        _id: announcement._id,
      });
      toast.success("Announcement deleted");
      setConfirmOpen(false);
      onChanged();
    } catch (err) {
      toast.error(toErrorMessage(err, "Failed to delete announcement"));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="flex items-start justify-between gap-4 rounded-[14px] border border-border bg-card p-4 shadow-xs">
      <div className="min-w-0 flex-1">
        <p className="line-clamp-2 break-words text-sm text-foreground">
          {announcement.message?.trim() ? (
            announcement.message
          ) : (
            <span className="italic text-muted-foreground">No message</span>
          )}
        </p>
        <div className="mt-2">
          {active ? (
            <Badge
              shape="tag"
              className="border-emerald-300 bg-emerald-50 text-emerald-600"
            >
              Active
            </Badge>
          ) : (
            <Badge shape="tag" className="border-border text-muted-foreground">
              Inactive
            </Badge>
          )}
        </div>
      </div>

      <div className="flex flex-shrink-0 items-center gap-2">
        <Switch
          checked={active}
          disabled={togglingActive}
          onCheckedChange={(c) => void handleToggleActive(c)}
          aria-label={
            active ? "Deactivate announcement" : "Activate announcement"
          }
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setEditOpen(true)}
          aria-label="Edit announcement"
        >
          <Pencil className="h-4 w-4" aria-hidden="true" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setConfirmOpen(true)}
          className="text-red-500 hover:bg-red-50 hover:text-red-600"
          aria-label="Delete announcement"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>

      <AnnouncementDialog
        mode="edit"
        announcement={announcement}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSaved={onChanged}
      />

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={(o) => {
          if (!deleting) setConfirmOpen(o);
        }}
        title="Delete announcement"
        description="Are you sure you want to delete this announcement? This cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
        loading={deleting}
        onConfirm={() => void handleConfirmDelete()}
      />
    </div>
  );
}
