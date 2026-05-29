import { useEffect, useMemo, useState } from "react";
import { Check, Folder } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select } from "~/components/ui/select";
import { ConfirmDialog } from "~/components/ui/alert-dialog";

export interface LicenseDialogDistrict {
  _id: string;
  name?: string | null;
  courses?: Array<string | null> | null;
  licenseLabel?: string | null;
}

export interface LicenseDialogPreset {
  _id: string;
  label?: string | null;
  identifier?: string | null;
  courses?: Array<string | null> | null;
}

export interface LicenseDialogCurriculum {
  _id: string;
  title?: string | null;
  description?: string | null;
  cover?: { url?: string | null } | null;
}

export interface DistrictLicenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  district: LicenseDialogDistrict | null;
  presets: ReadonlyArray<LicenseDialogPreset>;
  curriculums: ReadonlyArray<LicenseDialogCurriculum>;
  onSubmit: (args: {
    courses: string[];
    licenseLabel: string;
  }) => Promise<void> | void;
  onUnassign: () => Promise<void> | void;
}

export function DistrictLicenseDialog({
  open,
  onOpenChange,
  district,
  presets,
  curriculums,
  onSubmit,
  onUnassign,
}: DistrictLicenseDialogProps) {
  const [selected, setSelected] = useState<Set<string>>(() => new Set());
  const [selectedPresetId, setSelectedPresetId] = useState<string>("");
  const [customLabel, setCustomLabel] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmUnassignOpen, setConfirmUnassignOpen] = useState(false);

  // Hydrate from district + presets on every open flip.
  useEffect(() => {
    if (!open || !district) return;
    const initialCourses = (district.courses ?? []).filter(
      (id): id is string => !!id,
    );
    setSelected(new Set(initialCourses));

    const matchPreset = district.licenseLabel
      ? presets.find((p) => p.label === district.licenseLabel)
      : undefined;
    if (matchPreset) {
      setSelectedPresetId(matchPreset._id);
      setCustomLabel("");
    } else {
      setSelectedPresetId("");
      setCustomLabel(district.licenseLabel ?? "");
    }
  }, [open, district, presets]);

  const sortedCurriculums = useMemo(
    () =>
      [...curriculums].sort((a, b) =>
        (a.title ?? "")
          .toLocaleLowerCase()
          .localeCompare((b.title ?? "").toLocaleLowerCase()),
      ),
    [curriculums],
  );

  function togglePresetSelect(nextPresetId: string) {
    if (nextPresetId === "") {
      setSelectedPresetId("");
      return;
    }
    const preset = presets.find((p) => p._id === nextPresetId);
    if (!preset) {
      setSelectedPresetId("");
      return;
    }
    const presetCourses = (preset.courses ?? []).filter(
      (id): id is string => !!id,
    );
    setSelected((prev) => {
      const next = new Set(prev);
      for (const id of presetCourses) next.add(id);
      return next;
    });
    setSelectedPresetId(preset._id);
    setCustomLabel("");
  }

  function toggleCurriculum(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function clearAll() {
    setSelected(new Set());
  }

  async function handleSave() {
    let effectiveLabel: string;
    if (selectedPresetId !== "") {
      const preset = presets.find((p) => p._id === selectedPresetId);
      effectiveLabel = preset?.label ?? "";
    } else {
      const trimmed = customLabel.trim();
      effectiveLabel = trimmed !== "" ? trimmed : "Custom";
    }

    setSubmitting(true);
    try {
      await onSubmit({
        courses: Array.from(selected),
        licenseLabel: effectiveLabel,
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUnassignConfirmed() {
    setSubmitting(true);
    try {
      await onUnassign();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white border-stone-200 text-stone-900 max-w-lg max-h-[85vh] overflow-hidden flex flex-col font-sans rounded-[16px]">
        <DialogHeader className="mb-0">
          <DialogTitle className="font-serif text-xl font-normal text-stone-900">
            License — {district?.name ?? "District"}
          </DialogTitle>
        </DialogHeader>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto py-2 space-y-4">
          {/* Preset selector */}
          <div>
            <Label htmlFor="license-preset" className="text-sm font-medium">
              License preset
            </Label>
            <Select
              id="license-preset"
              value={selectedPresetId}
              onChange={(e) => togglePresetSelect(e.target.value)}
              className="mt-1.5"
              disabled={submitting}
            >
              <option value="">— No preset (custom) —</option>
              {presets.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.label ?? p.identifier ?? p._id}
                </option>
              ))}
            </Select>
          </div>

          {/* Custom label input (only when no preset) */}
          {selectedPresetId === "" ? (
            <div>
              <Label
                htmlFor="license-custom-label"
                className="text-sm font-medium"
              >
                Custom label
              </Label>
              <Input
                id="license-custom-label"
                value={customLabel}
                onChange={(e) => setCustomLabel(e.target.value)}
                placeholder="Custom"
                className="mt-1.5"
                disabled={submitting}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Leave empty to use the default label &quot;Custom&quot;.
              </p>
            </div>
          ) : null}

          {/* Curriculum list */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">
                Curricula ({selected.size} selected)
              </Label>
              <button
                type="button"
                onClick={clearAll}
                disabled={submitting || selected.size === 0}
                className="text-xs text-muted-foreground hover:text-foreground underline-offset-2 hover:underline disabled:opacity-50 disabled:no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 rounded"
              >
                Clear all selections
              </button>
            </div>
            <div className="space-y-2">
              {sortedCurriculums.length === 0 ? (
                <p className="text-center text-stone-400 py-8 text-sm">
                  No curricula available
                </p>
              ) : (
                sortedCurriculums.map((c) => {
                  const isSelected = selected.has(c._id);
                  return (
                    <label
                      key={c._id}
                      className={`flex items-center gap-3 p-3 rounded-[14px] border cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-blue-50 border-blue-200"
                          : "bg-card border-border hover:border-foreground/30"
                      }`}
                    >
                      <div className="relative h-12 w-12 flex-shrink-0">
                        {c.cover?.url ? (
                          <img
                            src={c.cover.url}
                            alt=""
                            className="h-12 w-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-stone-100">
                            <Folder
                              className="h-5 w-5 text-stone-400"
                              aria-hidden="true"
                            />
                          </div>
                        )}
                        <span
                          aria-hidden="true"
                          className={`absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white transition-colors ${
                            isSelected
                              ? "bg-foreground text-background"
                              : "bg-white text-transparent border-stone-300"
                          }`}
                        >
                          <Check className="h-3 w-3" />
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate">
                          {c.title ?? "Untitled"}
                        </p>
                        {c.description ? (
                          <p className="text-sm text-muted-foreground truncate">
                            {c.description}
                          </p>
                        ) : null}
                      </div>
                      <input
                        type="checkbox" className="sr-only"
                        checked={isSelected}
                        onChange={() => toggleCurriculum(c._id)}
                        aria-label={`Toggle ${c.title ?? "curriculum"}`}
                      />
                    </label>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Footer: destructive Unassign on left, Cancel + Save on right */}
        <DialogFooter className="mt-4 flex flex-row items-center justify-between gap-3 sm:justify-between">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setConfirmUnassignOpen(true)}
            disabled={submitting || !district?.licenseLabel}
            className="h-10 px-4 text-sm font-medium"
          >
            Unassign License
          </Button>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
              className="h-10 px-4 text-sm font-medium"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => void handleSave()}
              loading={submitting}
              className="h-10 px-4 text-sm font-medium"
            >
              Save
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>

      {/* Destructive confirm */}
      <ConfirmDialog
        open={confirmUnassignOpen}
        onOpenChange={setConfirmUnassignOpen}
        title="Unassign license?"
        description={
          <>
            This removes the assigned label and all curricula from{" "}
            <strong>{district?.name ?? "this district"}</strong>. The district
            will show as <em>No License</em> until reassigned.
          </>
        }
        confirmLabel="Unassign"
        onConfirm={() => void handleUnassignConfirmed()}
      />
    </Dialog>
  );
}
