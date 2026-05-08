import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

export interface DeleteClassroomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classroomName?: string | null;
  isDeleting: boolean;
  onConfirm: () => void;
}

export function DeleteClassroomDialog({
  open,
  onOpenChange,
  classroomName,
  isDeleting,
  onConfirm,
}: DeleteClassroomDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white border-stone-200 text-stone-900 max-w-md font-sans rounded-[16px]">
        <DialogHeader className="mb-0">
          <DialogTitle className="font-serif text-xl font-normal text-stone-900">
            Delete classroom
          </DialogTitle>
        </DialogHeader>
        <p className="mt-4 text-sm text-stone-600">
          {`Delete "${classroomName ?? "this classroom"}"? This action cannot be undone.`}
        </p>
        <div className="flex gap-3 pt-4 border-t border-stone-100 mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={onConfirm}
            loading={isDeleting}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
