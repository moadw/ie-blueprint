import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { useRevalidator } from "react-router";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { toast } from "~/components/ui/toast";
import { env } from "~/lib/env";
import { toErrorMessage } from "~/lib/errors";
import { gqlClient } from "~/lib/graphql";
import { LicensePresetCreateOneDocument } from "~/queries/license-presets";
import type { LicensePresetListItem } from "~/routes/admin.license-presets";
import { ExperiencesSelector } from "~/components/admin/experiences-selector";

export interface LicensePresetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (preset: LicensePresetListItem) => void;
}

type FormState = {
  label: string;
  identifier: string;
  description: string;
  coursesCollection: string[];
  courses: string[];
};

const EMPTY_FORM: FormState = {
  label: "",
  identifier: "",
  description: "",
  coursesCollection: [],
  courses: [],
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function LicensePresetDialog({
  open,
  onOpenChange,
  onCreated,
}: LicensePresetDialogProps) {
  const revalidator = useRevalidator();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const identifierTouchedRef = useRef(false);

  useEffect(() => {
    if (open) {
      setForm(EMPTY_FORM);
      identifierTouchedRef.current = false;
    }
  }, [open]);

  function handleLabelChange(value: string) {
    setForm((f) => ({
      ...f,
      label: value,
      identifier: identifierTouchedRef.current ? f.identifier : slugify(value),
    }));
  }

  function handleIdentifierChange(value: string) {
    identifierTouchedRef.current = true;
    setForm((f) => ({ ...f, identifier: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    const trimmedLabel = form.label.trim();
    if (!trimmedLabel) return;
    const trimmedIdentifier = form.identifier.trim();
    const trimmedDescription = form.description.trim();

    setSubmitting(true);
    try {
      const data = await gqlClient.request(LicensePresetCreateOneDocument, {
        record: {
          label: trimmedLabel,
          identifier: trimmedIdentifier,
          description: trimmedDescription,
          coursesCollection: form.coursesCollection,
          courses: form.courses,
          platform: env.PLATFORM,
        },
      });
      // Read the CreateOnelicensepresetPayload envelope: { recordId, record, error }.
      // The `error` field is typed as `never` by codegen because `ErrorInterface`
      // is a GraphQL interface with no concrete implementations on the live
      // schema — so we cast to read the `{ message }` shape we actually selected.
      const payload = data.LicensePresetCreateOne as
        | {
            recordId?: string | null;
            record?: LicensePresetListItem | null;
            error?: { message?: string | null } | null;
          }
        | null
        | undefined;

      if (payload?.error?.message) {
        toast.error(payload.error.message);
        return;
      }
      const created = payload?.record;
      const recordId = payload?.recordId;
      if (!created || !(created._id || recordId)) {
        toast.error("License preset created but response was missing a record.");
        return;
      }

      toast.success(
        `License preset "${created.label ?? trimmedLabel}" created`,
      );
      onCreated?.(created);
      onOpenChange(false);
      setForm(EMPTY_FORM);
      identifierTouchedRef.current = false;
      revalidator.revalidate();
    } catch (err) {
      const message = toErrorMessage(err, "Failed to create license preset");
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl font-normal">
            New License Preset
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="license-preset-label"
              className="text-sm font-medium text-muted-foreground"
            >
              Label *
            </Label>
            <Input
              id="license-preset-label"
              value={form.label}
              onChange={(e) => handleLabelChange(e.target.value)}
              required
              autoFocus
              className="h-10 text-sm"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="license-preset-identifier"
              className="text-sm font-medium text-muted-foreground"
            >
              Identifier
            </Label>
            <Input
              id="license-preset-identifier"
              value={form.identifier}
              onChange={(e) => handleIdentifierChange(e.target.value)}
              className="h-10 font-mono text-xs"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="license-preset-description"
              className="text-sm font-medium text-muted-foreground"
            >
              Description
            </Label>
            <Textarea
              id="license-preset-description"
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              placeholder="Brief license preset description…"
              className="min-h-[80px] text-sm"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-muted-foreground">
              Experiences
            </span>
            <ExperiencesSelector
              value={{
                coursesCollection: form.coursesCollection,
                courses: form.courses,
              }}
              onChange={({ coursesCollection, courses }) =>
                setForm((f) => ({ ...f, coursesCollection, courses }))
              }
              disabled={submitting}
            />
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
              disabled={submitting || !form.label.trim()}
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
