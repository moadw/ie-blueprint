import { useEffect, useRef, useState } from "react";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Loader2,
  Trash2,
  X,
} from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { ConfirmDialog } from "~/components/ui/alert-dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { toast } from "~/components/ui/toast";
import { env } from "~/lib/env";
import { toErrorMessage } from "~/lib/errors";
import { gqlClient } from "~/lib/graphql";
import {
  LicensePresetDeleteOneDocument,
  LicensePresetUpdateOneDocument,
} from "~/queries/license-presets";
import type { LicensePresetListItem } from "~/routes/admin.license-presets";
import { ExperiencesSelector } from "~/components/admin/experiences-selector";

export interface LicensePresetRowProps {
  preset: LicensePresetListItem;
  onUpdated: (preset: LicensePresetListItem) => void;
  onDeleted: (id: string) => void;
}

export function LicensePresetRow({
  preset,
  onUpdated,
  onDeleted,
}: LicensePresetRowProps) {
  const label = preset.label ?? "";

  // Inline label edit
  const [editingLabel, setEditingLabel] = useState(false);
  const [labelValue, setLabelValue] = useState(label);
  const [savingLabel, setSavingLabel] = useState(false);
  const labelInputRef = useRef<HTMLInputElement>(null);

  // Expanded edit
  const [expanded, setExpanded] = useState(false);
  const [identifier, setIdentifier] = useState(preset.identifier ?? "");
  const [description, setDescription] = useState(preset.description ?? "");
  const [coursesState, setCoursesState] = useState<string[]>(
    () =>
      (preset.courses ?? []).filter(
        (id): id is string => typeof id === "string",
      ),
  );
  const [coursesCollectionState, setCoursesCollectionState] = useState<
    string[]
  >(
    () =>
      (preset.coursesCollection ?? []).filter(
        (id): id is string => typeof id === "string",
      ),
  );
  const [experiencesDirty, setExperiencesDirty] = useState(false);
  const [savingExpanded, setSavingExpanded] = useState(false);

  // Delete
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (editingLabel && labelInputRef.current) {
      labelInputRef.current.focus();
      labelInputRef.current.select();
    }
  }, [editingLabel]);

  // Re-sync local state if the parent passes in a fresh preset (e.g. after
  // an update from elsewhere).
  useEffect(() => {
    setLabelValue(preset.label ?? "");
    setIdentifier(preset.identifier ?? "");
    setDescription(preset.description ?? "");
    setCoursesState(
      (preset.courses ?? []).filter(
        (id): id is string => typeof id === "string",
      ),
    );
    setCoursesCollectionState(
      (preset.coursesCollection ?? []).filter(
        (id): id is string => typeof id === "string",
      ),
    );
    setExperiencesDirty(false);
  }, [preset]);

  async function handleLabelSave() {
    const trimmed = labelValue.trim();
    if (!trimmed || trimmed === label) {
      setEditingLabel(false);
      setLabelValue(label);
      return;
    }
    setSavingLabel(true);
    try {
      const data = await gqlClient.request(LicensePresetUpdateOneDocument, {
        _id: preset._id,
        record: { label: trimmed, platform: env.PLATFORM },
      });
      // ErrorInterface has no concrete implementations, so codegen narrows
      // `error` to `never`. Cast to access the selected shape.
      const payload = data.LicensePresetUpdateOne as
        | {
            record?: LicensePresetListItem | null;
            error?: { message?: string | null } | null;
          }
        | null
        | undefined;
      if (payload?.error?.message) {
        throw new Error(payload.error.message);
      }
      const updated = payload?.record;
      if (!updated) {
        toast.error(
          "License preset updated but response was missing a record.",
        );
        return;
      }
      onUpdated({ ...preset, ...updated });
      setEditingLabel(false);
      toast.success("License preset renamed");
    } catch (err) {
      const message = toErrorMessage(err, "Failed to rename license preset");
      toast.error(message);
    } finally {
      setSavingLabel(false);
    }
  }

  function handleLabelKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      void handleLabelSave();
    } else if (e.key === "Escape") {
      e.preventDefault();
      setLabelValue(label);
      setEditingLabel(false);
    }
  }

  async function handleExpandedSave() {
    setSavingExpanded(true);
    try {
      const data = await gqlClient.request(LicensePresetUpdateOneDocument, {
        _id: preset._id,
        record: {
          identifier: identifier.trim(),
          description: description.trim(),
          platform: env.PLATFORM,
          // Only persist the experience selection when the user changed it,
          // so an unrelated edit (e.g. description) never wipes a legacy
          // preset's hand-picked `courses`. Keys are absent when not dirty
          // (exactOptionalPropertyTypes — never set to undefined).
          ...(experiencesDirty
            ? {
                coursesCollection: coursesCollectionState,
                courses: coursesState,
              }
            : {}),
        },
      });
      const payload = data.LicensePresetUpdateOne as
        | {
            record?: LicensePresetListItem | null;
            error?: { message?: string | null } | null;
          }
        | null
        | undefined;
      if (payload?.error?.message) {
        throw new Error(payload.error.message);
      }
      const updated = payload?.record;
      if (!updated) {
        toast.error(
          "License preset updated but response was missing a record.",
        );
        return;
      }
      onUpdated({ ...preset, ...updated });
      setExperiencesDirty(false);
      toast.success("License preset updated");
      setExpanded(false);
    } catch (err) {
      const message = toErrorMessage(err, "Failed to update license preset");
      toast.error(message);
    } finally {
      setSavingExpanded(false);
    }
  }

  function handleExpandedCancel() {
    setIdentifier(preset.identifier ?? "");
    setDescription(preset.description ?? "");
    setCoursesState(
      (preset.courses ?? []).filter(
        (id): id is string => typeof id === "string",
      ),
    );
    setCoursesCollectionState(
      (preset.coursesCollection ?? []).filter(
        (id): id is string => typeof id === "string",
      ),
    );
    setExperiencesDirty(false);
    setExpanded(false);
  }

  async function handleConfirmDelete() {
    setDeleting(true);
    try {
      // LicensePresetDeleteOne arg is `_id` (NOT `id` like narrators).
      // Returned value may be null even when the mutation completed; we drop
      // the row by the id we already hold locally regardless. Backend failures
      // throw via graphql-request and flow through the catch block below.
      await gqlClient.request(LicensePresetDeleteOneDocument, {
        _id: preset._id,
      });
      onDeleted(preset._id);
      toast.success("License preset deleted");
      setConfirmOpen(false);
    } catch (err) {
      const message = toErrorMessage(err, "Failed to delete license preset");
      toast.error(message);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="bg-card rounded-[14px] shadow-xs border border-border">
      {/* Main row */}
      <div className="p-4 flex items-center justify-between gap-3">
        {/* Label + identifier badge */}
        <div className="min-w-0 flex-1">
          {editingLabel ? (
            <div className="flex items-center gap-2">
              <Input
                ref={labelInputRef}
                value={labelValue}
                onChange={(e) => setLabelValue(e.target.value)}
                onKeyDown={handleLabelKeyDown}
                disabled={savingLabel}
                className="h-8 text-sm"
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => void handleLabelSave()}
                disabled={savingLabel}
                aria-label="Save label"
              >
                {savingLabel ? (
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                ) : (
                  <Check className="w-4 h-4 text-emerald-600" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => {
                  setLabelValue(label);
                  setEditingLabel(false);
                }}
                disabled={savingLabel}
                aria-label="Cancel rename"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </Button>
            </div>
          ) : (
            <p
              className="font-medium truncate cursor-pointer hover:text-muted-foreground transition-colors"
              onClick={() => setEditingLabel(true)}
              title="Click to edit label"
            >
              {preset.label ?? "Unnamed preset"}
            </p>
          )}
          <div className="flex flex-wrap gap-1.5 mt-1 items-center">
            <Badge
              shape="tag"
              className="text-muted-foreground border-border font-mono text-[10px]"
            >
              {preset.identifier ?? "—"}
            </Badge>
          </div>
        </div>

        {/* Expand chevron */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 flex-shrink-0"
          onClick={() => setExpanded((e) => !e)}
          aria-label={expanded ? "Collapse" : "Expand"}
          aria-expanded={expanded}
        >
          {expanded ? (
            <ChevronUp className="w-4 h-4" aria-hidden="true" />
          ) : (
            <ChevronDown className="w-4 h-4" aria-hidden="true" />
          )}
        </Button>
      </div>

      {/* Expanded section */}
      {expanded ? (
        <div className="px-4 pb-4 pt-2 border-t border-border space-y-4">
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor={`license-preset-identifier-${preset._id}`}
              className="text-xs font-medium text-muted-foreground"
            >
              Identifier
            </Label>
            <Input
              id={`license-preset-identifier-${preset._id}`}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="h-9 text-sm font-mono text-xs"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor={`license-preset-description-${preset._id}`}
              className="text-xs font-medium text-muted-foreground"
            >
              Description
            </Label>
            <Textarea
              id={`license-preset-description-${preset._id}`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief license preset description…"
              className="min-h-[80px] text-sm"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-muted-foreground">
              Experiences
            </span>
            <ExperiencesSelector
              value={{
                coursesCollection: coursesCollectionState,
                courses: coursesState,
              }}
              onChange={({ coursesCollection, courses }) => {
                setCoursesCollectionState(coursesCollection);
                setCoursesState(courses);
                setExperiencesDirty(true);
              }}
              disabled={savingExpanded}
            />
          </div>

          <div className="flex justify-between items-center gap-2 pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setConfirmOpen(true)}
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" aria-hidden="true" /> Delete
            </Button>
            <ConfirmDialog
              open={confirmOpen}
              onOpenChange={(o) => {
                if (!deleting) setConfirmOpen(o);
              }}
              title="Delete License Preset"
              description={`This will permanently delete "${preset.label ?? preset.identifier ?? "this license preset"}".`}
              confirmLabel="Delete"
              variant="destructive"
              loading={deleting}
              onConfirm={() => void handleConfirmDelete()}
            />
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleExpandedCancel}
                disabled={savingExpanded}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => void handleExpandedSave()}
                loading={savingExpanded}
                disabled={savingExpanded}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
