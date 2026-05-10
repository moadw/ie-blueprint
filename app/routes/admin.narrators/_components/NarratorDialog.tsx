import { useEffect, useState } from "react";
import type { FormEvent } from "react";
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
import { Switch } from "~/components/ui/switch";
import { Textarea } from "~/components/ui/textarea";
import { toast } from "~/components/ui/toast";
import { gqlClient } from "~/lib/graphql";
import { NarratorsCreateOneDocument } from "~/queries/narrators";
import type { NarratorRowNarrator } from "./NarratorRow";
import { NARRATOR_LANGUAGES } from "./languages";

export interface NarratorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (narrator: NarratorRowNarrator) => void;
}

type FormState = {
  name: string;
  bio: string;
  languages: string[];
  active: boolean;
};

const EMPTY_FORM: FormState = {
  name: "",
  bio: "",
  languages: [],
  active: true,
};

export function NarratorDialog({
  open,
  onOpenChange,
  onCreated,
}: NarratorDialogProps) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) setForm(EMPTY_FORM);
  }, [open]);

  function toggleLanguage(code: string) {
    setForm((f) => ({
      ...f,
      languages: f.languages.includes(code)
        ? f.languages.filter((c) => c !== code)
        : [...f.languages, code],
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    const trimmedName = form.name.trim();
    if (!trimmedName) return;

    setSubmitting(true);
    try {
      // languages[0] is primary by convention (see ./languages.ts).
      const data = await gqlClient.request(NarratorsCreateOneDocument, {
        input: {
          name: trimmedName,
          bio: form.bio.trim(),
          languages: form.languages,
          active: form.active,
        },
      });
      const created = data.narratorsCreateOne;
      if (!created || !created._id) {
        toast.error("Narrator created but response was missing a record.");
        return;
      }
      toast.success("Narrator created");
      onCreated(created);
      onOpenChange(false);
      setForm(EMPTY_FORM);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create narrator";
      toast.error(`Failed to create narrator: ${message}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl font-normal">
            New Narrator
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="narrator-create-name"
              className="text-sm font-medium text-muted-foreground"
            >
              Name *
            </Label>
            <Input
              id="narrator-create-name"
              value={form.name}
              onChange={(e) =>
                setForm((f) => ({ ...f, name: e.target.value }))
              }
              required
              autoFocus
              className="h-10 text-sm"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="narrator-create-bio"
              className="text-sm font-medium text-muted-foreground"
            >
              Bio
            </Label>
            <Textarea
              id="narrator-create-bio"
              value={form.bio}
              onChange={(e) =>
                setForm((f) => ({ ...f, bio: e.target.value }))
              }
              placeholder="Brief narrator bio…"
              className="min-h-[80px] text-sm"
            />
          </div>

          {/* Avatar dropzone — visual only for v1. */}
          {/* TODO(narrator-avatar): wire upload when endpoint exists */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium text-muted-foreground">
              Avatar
            </Label>
            <label className="flex items-center gap-3 p-3 rounded-[14px] border border-dashed border-border bg-card cursor-pointer hover:border-foreground/30 transition-colors">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                <ImagePlus
                  className="w-4 h-4 text-muted-foreground"
                  aria-hidden="true"
                />
              </span>
              <span className="text-muted-foreground text-sm">
                Select avatar (upload coming soon)
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={() => {
                  // TODO(narrator-avatar): wire upload when endpoint exists
                }}
              />
            </label>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">
              Languages
            </p>
            <div className="flex flex-wrap gap-3">
              {NARRATOR_LANGUAGES.map((lang) => {
                const checked = form.languages.includes(lang.code);
                const checkboxId = `narrator-create-lang-${lang.code}`;
                return (
                  <div key={lang.code} className="flex items-center gap-2">
                    <input
                      id={checkboxId}
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleLanguage(lang.code)}
                      className="h-4 w-4 rounded border-border accent-foreground cursor-pointer"
                    />
                    <Label
                      htmlFor={checkboxId}
                      className={
                        checked
                          ? "text-sm cursor-pointer"
                          : "text-sm text-muted-foreground cursor-pointer"
                      }
                    >
                      {lang.name}
                    </Label>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label
              htmlFor="narrator-create-active"
              className="text-sm text-muted-foreground"
            >
              Active
            </Label>
            <Switch
              id="narrator-create-active"
              checked={form.active}
              onCheckedChange={(checked) =>
                setForm((f) => ({ ...f, active: checked }))
              }
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
              disabled={submitting || !form.name.trim()}
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
