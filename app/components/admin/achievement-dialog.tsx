import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { ImagePlus } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { toast } from "~/components/ui/toast";
import { api } from "~/lib/api";
import { env } from "~/lib/env";
import { toErrorMessage } from "~/lib/errors";
import { gqlClient } from "~/lib/graphql";
import { PinCreateOneDocument } from "~/mutations/pins";
import type { PinFindManyQuery } from "~/gql/graphql";

export type PinItem = PinFindManyQuery["PinFindMany"][number];

const MAX_COVER_BYTES = 5 * 1024 * 1024;

export interface AchievementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classId: string;
  curriculumId: string | null;
  onSaved: () => void;
  /** Reserved for a future edit mode; this slice only supports create. */
  pin?: PinItem | null;
}

export function AchievementDialog({
  open,
  onOpenChange,
  classId,
  curriculumId,
  onSaved,
}: AchievementDialogProps) {
  const [name, setName] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Reset whenever the dialog opens.
  useEffect(() => {
    if (open) {
      setName("");
      setCoverFile(null);
      setSubmitting(false);
    }
  }, [open]);

  function handleCoverChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      e.target.value = "";
      return;
    }
    if (file.size > MAX_COVER_BYTES) {
      toast.error("Cover must be 5 MB or smaller.");
      e.target.value = "";
      return;
    }
    setCoverFile(file);
    e.target.value = "";
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    const trimmedName = name.trim();
    if (!trimmedName) return;

    setSubmitting(true);
    try {
      // 1. Create the pin (label + relation ids + platform).
      const data = await gqlClient.request(PinCreateOneDocument, {
        record: {
          label: trimmedName,
          class: classId,
          ...(curriculumId ? { curriculum: curriculumId } : {}),
          platform: env.PLATFORM,
        },
      });
      const payload = data.PinCreateOne;
      // `error` is typed `never` by codegen (ErrorInterface has no concrete
      // implementors on the live schema) — cast to read the selected shape.
      const payloadError = (
        payload as { error?: { message?: string } | null } | null | undefined
      )?.error;
      if (payloadError?.message) throw new Error(payloadError.message);
      const recordId = payload?.recordId;
      if (!recordId) {
        throw new Error("Achievement created but response was missing a record id.");
      }

      // 2. Upload the cover in its own try/catch — a cover failure must not
      //    roll back the created pin.
      let coverFailed = false;
      if (coverFile) {
        try {
          const fd = new FormData();
          fd.append("file", coverFile);
          fd.append("id", recordId);
          await api("/admin/pin-cover", { method: "PUT", body: fd });
        } catch (uploadErr) {
          coverFailed = true;
          console.error("[pin-cover] upload failed", uploadErr);
        }
      }

      if (coverFailed) {
        toast.warning("Achievement created — cover upload failed.");
      } else {
        toast.success("Achievement created");
      }
      onSaved();
      onOpenChange(false);
    } catch (err) {
      const message = toErrorMessage(err, "Failed to create achievement");
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl font-normal">
            Add Achievement
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="achievement-name"
              className="text-sm font-medium text-muted-foreground"
            >
              Name *
            </Label>
            <Input
              id="achievement-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
              className="h-10 text-sm"
            />
          </div>

          {/* Cover dropzone */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium text-muted-foreground">
              Cover
            </Label>
            <label className="flex items-center gap-3 p-3 rounded-[14px] border border-dashed border-border bg-card cursor-pointer hover:border-foreground/30 transition-colors">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                <ImagePlus
                  className="w-4 h-4 text-muted-foreground"
                  aria-hidden="true"
                />
              </span>
              <span className="text-muted-foreground text-sm truncate">
                {coverFile ? coverFile.name : "Choose image"}
              </span>
              <input
                type="file"
                accept="image/png,image/jpeg"
                className="hidden"
                onChange={handleCoverChange}
              />
            </label>
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
              disabled={submitting || !name.trim()}
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

export default AchievementDialog;
