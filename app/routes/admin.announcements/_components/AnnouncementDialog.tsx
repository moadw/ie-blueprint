import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { Textarea } from "~/components/ui/textarea";
import { toast } from "~/components/ui/toast";
import { toErrorMessage } from "~/lib/errors";
import { gqlClient } from "~/lib/graphql";
import {
  AnnouncementCreateOneDocument,
  AnnouncementUpdateOneDocument,
} from "~/mutations/announcements";
import type { AnnouncementType } from "./AnnouncementTypeTabs";
import type { AnnouncementRowAnnouncement } from "./AnnouncementRow";

// ErrorInterface has no concrete implementations on the live schema, so codegen
// narrows the payload `error` to `never`. Cast to read the `{ message }` shape
// we actually selected (mirrors LicensePresetDialog).
type AnnouncementPayload =
  | {
      recordId?: string | null;
      record?: { _id?: string } | null;
      error?: { message?: string | null } | null;
    }
  | null
  | undefined;

const TYPE_LABELS: Record<string, string> = {
  district: "District Portal",
  educator: "Educator",
  family: "Family",
};

type CommonProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
};

export type AnnouncementDialogProps = CommonProps &
  (
    | { mode: "create"; type: AnnouncementType }
    | { mode: "edit"; announcement: AnnouncementRowAnnouncement }
  );

export function AnnouncementDialog(props: AnnouncementDialogProps) {
  const { open, onOpenChange, onSaved } = props;
  const isEdit = props.mode === "edit";
  const audienceType =
    props.mode === "edit" ? (props.announcement.type ?? "") : props.type;
  const audienceLabel = TYPE_LABELS[audienceType] ?? audienceType;

  const [message, setMessage] = useState("");
  const [active, setActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (props.mode === "edit") {
      setMessage(props.announcement.message ?? "");
      setActive(props.announcement.active ?? false);
    } else {
      setMessage("");
      setActive(true);
    }
  }, [open]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    const trimmed = message.trim();
    if (!trimmed) return;

    setSubmitting(true);
    try {
      if (props.mode === "create") {
        const data = await gqlClient.request(AnnouncementCreateOneDocument, {
          record: { message: trimmed, type: props.type, active },
        });
        const payload = data.AnnouncementCreateOne as AnnouncementPayload;
        if (payload?.error?.message) {
          toast.error(payload.error.message);
          return;
        }
        toast.success("Announcement created");
      } else {
        const data = await gqlClient.request(AnnouncementUpdateOneDocument, {
          _id: props.announcement._id,
          record: { message: trimmed, active },
        });
        const payload = data.AnnouncementUpdateOne as AnnouncementPayload;
        if (payload?.error?.message) {
          toast.error(payload.error.message);
          return;
        }
        toast.success("Announcement updated");
      }
      onOpenChange(false);
      onSaved();
    } catch (err) {
      toast.error(toErrorMessage(err, "Failed to save announcement"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl font-normal">
            {isEdit ? "Edit announcement" : "New announcement"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-muted-foreground">
              Audience
            </span>
            <span className="text-sm text-foreground">{audienceLabel}</span>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="announcement-message"
              className="text-sm font-medium text-muted-foreground"
            >
              Message
            </Label>
            <Textarea
              id="announcement-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter announcement message…"
              className="min-h-[96px] resize-none text-sm"
              autoFocus
            />
          </div>

          <div className="flex items-center gap-3">
            <Switch
              id="announcement-active"
              checked={active}
              onCheckedChange={setActive}
            />
            <Label
              htmlFor="announcement-active"
              className="text-sm text-muted-foreground"
            >
              {active ? "Active — visible to users" : "Inactive — hidden"}
            </Label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
              className="h-10 px-4 text-sm font-medium"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={submitting}
              disabled={submitting || !message.trim()}
              className="h-10 px-4 text-sm font-medium"
            >
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
