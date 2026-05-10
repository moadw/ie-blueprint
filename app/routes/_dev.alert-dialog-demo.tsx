import { useState } from "react";
import { Button } from "~/components/ui/button";
import { ConfirmDialog } from "~/components/ui/alert-dialog";

// TEMP harness for QA of the AlertDialog primitive (step-1).
// Delete when step-3 / step-4 land or earlier.
export default function AlertDialogDemo() {
  const [open, setOpen] = useState(false);
  const [fired, setFired] = useState(false);
  return (
    <div className="min-h-screen bg-background p-8 flex flex-col gap-4 items-start">
      <h1 className="text-2xl font-medium">AlertDialog harness</h1>
      <Button onClick={() => setOpen(true)} data-testid="open-confirm">
        Delete something
      </Button>
      {fired ? (
        <p data-testid="confirm-fired" className="text-sm text-foreground">
          Confirm fired.
        </p>
      ) : null}
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Delete this thing?"
        description="This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={() => {
          setFired(true);
          setOpen(false);
        }}
      />
    </div>
  );
}
