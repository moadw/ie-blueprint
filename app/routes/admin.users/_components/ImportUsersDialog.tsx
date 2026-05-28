import { useState } from "react";
import type { ChangeEvent } from "react";
import { FileUp, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { uploadUsersCsv } from "~/lib/users-csv";

type Status = "idle" | "uploading" | "success" | "error";

interface ImportUsersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImported: () => void;
}

export function ImportUsersDialog({
  open,
  onOpenChange,
  onImported,
}: ImportUsersDialogProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);

  function reset() {
    setStatus("idle");
    setMessage(null);
  }

  function handleOpenChange(next: boolean) {
    onOpenChange(next);
    if (!next) reset();
  }

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-picking the same file
    if (!file) return;
    setStatus("uploading");
    setMessage(null);
    try {
      await uploadUsersCsv(file);
      setStatus("success");
      onImported();
      toast.success("Import started");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Unknown error");
      toast.error("Import failed");
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl font-normal">
            Import users (CSV)
          </DialogTitle>
          <DialogDescription>
            Make sure the District and Schools referenced in the CSV already
            exist in the platform. District and school names in the CSV must
            match the names exactly.
          </DialogDescription>
        </DialogHeader>

        {status === "idle" ? (
          <label className="flex items-center gap-3 p-4 rounded-[14px] border border-dashed border-border bg-card cursor-pointer hover:border-foreground/30 transition-colors">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              <FileUp
                className="w-4 h-4 text-muted-foreground"
                aria-hidden="true"
              />
            </span>
            <span className="text-muted-foreground text-sm">
              Choose CSV file
            </span>
            <input
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={handleFile}
            />
          </label>
        ) : null}

        {status === "uploading" ? (
          <div className="flex items-center gap-3 p-4">
            <Loader2
              className="w-5 h-5 animate-spin text-muted-foreground"
              aria-hidden="true"
            />
            <p className="text-sm text-muted-foreground">Uploading…</p>
          </div>
        ) : null}

        {status === "success" ? (
          <div className="rounded-xl bg-green-50 border border-green-200 p-4">
            <p className="text-sm font-medium text-green-700">
              Import started.
            </p>
            <p className="text-xs text-green-700">
              It may take a few minutes for new users to appear in the list.
            </p>
          </div>
        ) : null}

        {status === "error" ? (
          <div className="rounded-xl border-2 border-dashed border-red-200 bg-red-50 p-4">
            <p className="text-sm font-medium text-red-700">Import failed</p>
            <p className="text-xs text-red-600">
              {message ?? "Please try again."}
            </p>
          </div>
        ) : null}

        <DialogFooter>
          {status === "success" || status === "error" ? (
            <Button variant="ghost" onClick={reset}>
              {status === "error" ? "Try again" : "Import another"}
            </Button>
          ) : null}
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
