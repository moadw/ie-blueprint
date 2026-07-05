import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { toast } from "~/components/ui/toast";
import { toErrorMessage } from "~/lib/errors";
import { gqlClient } from "~/lib/graphql";
import { UsersSetPasswordAdminDocument } from "~/mutations/users";
import type { AdminUserRow } from "./UserRow";

export interface SetPasswordDialogProps {
  target: AdminUserRow | null;
  onOpenChange: (open: boolean) => void;
}

export function SetPasswordDialog({
  target,
  onOpenChange,
}: SetPasswordDialogProps) {
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);

  // Reset the field whenever a new target is selected so reopening the dialog
  // never shows the previously-typed value.
  useEffect(() => {
    if (target !== null) {
      setPassword("");
    }
  }, [target]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!target || !target.userId) return;
    setSaving(true);
    try {
      await gqlClient.request(UsersSetPasswordAdminDocument, {
        user: target.userId,
        password,
      });
      toast.success("Password updated");
      onOpenChange(false);
    } catch (err) {
      toast.error(toErrorMessage(err, "Failed to update password"));
    } finally {
      setSaving(false);
    }
  }

  const fullName = target
    ? `${target.firstName ?? ""} ${target.lastName ?? ""}`.trim() ||
      "this user"
    : "";

  return (
    <Dialog open={target !== null} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl font-normal">
            Set password for {fullName}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="New password"
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
          <DialogFooter>
            <Button
              variant="ghost"
              type="button"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              loading={saving}
              disabled={!password}
            >
              Save password
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
