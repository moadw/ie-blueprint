import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  ExperiencesSelector,
  deriveCourses,
} from "~/components/admin/experiences-selector";
import type { CurriculumLite } from "~/components/admin/experiences-selector";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select } from "~/components/ui/select";
import { ConfirmDialog } from "~/components/ui/alert-dialog";

export interface LicenseDialogDistrict {
  _id: string;
  name?: string | null;
  courses?: Array<string | null> | null;
  coursesCollections?: Array<string | null> | null;
  licenseLabel?: string | null;
}

export interface LicenseDialogPreset {
  _id: string;
  label?: string | null;
  identifier?: string | null;
  courses?: Array<string | null> | null;
  coursesCollection?: Array<string | null> | null;
}

export interface LicenseDialogCurriculum {
  _id: string;
  title?: string | null;
  curriculumCollection?: Array<{ _id: string } | null> | null;
  cover?: { url?: string | null } | null;
}

export interface DistrictLicenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  district: LicenseDialogDistrict | null;
  presets: ReadonlyArray<LicenseDialogPreset>;
  curriculums: ReadonlyArray<LicenseDialogCurriculum>;
  onSubmit: (args: {
    coursesCollections: string[];
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
  const [selection, setSelection] = useState<{
    coursesCollection: string[];
    courses: string[];
  }>({ coursesCollection: [], courses: [] });
  const [selectedPresetId, setSelectedPresetId] = useState<string>("");
  const [customLabel, setCustomLabel] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmUnassignOpen, setConfirmUnassignOpen] = useState(false);

  // Map loader curricula to the selector's lite shape for save-time /
  // hydration-time deriveCourses (mirrors classrooms_.create.tsx).
  const curriculaLite = useMemo<CurriculumLite[]>(
    () =>
      curriculums.map((c) => ({
        _id: c._id,
        title: c.title ?? "Untitled",
        collectionIds: (c.curriculumCollection ?? [])
          .filter((cc): cc is NonNullable<typeof cc> => cc != null)
          .map((cc) => cc._id),
        coverUrl: c.cover?.url ?? null,
      })),
    [curriculums],
  );

  // Hydrate from district + presets on every open flip.
  useEffect(() => {
    if (!open || !district) return;
    const collections = (district.coursesCollections ?? []).filter(
      (id): id is string => !!id,
    );
    const storedCourses = (district.courses ?? []).filter(
      (id): id is string => !!id,
    );
    // Legacy districts (collections assigned but no explicit series list) grant
    // the whole collection — expand to the full union so the granular UI
    // hydrates with those experiences fully checked.
    const courses =
      storedCourses.length > 0
        ? storedCourses
        : deriveCourses(collections, curriculaLite);
    setSelection({ coursesCollection: collections, courses });

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
  }, [open, district, presets, curriculaLite]);

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
    // Replace semantics: a modern preset sets the selection to exactly its
    // collections + series; a legacy preset (no coursesCollection) applies its
    // hand-picked courses (its collections are empty, so nothing is checked at
    // the experience level).
    const collections = (preset.coursesCollection ?? []).filter(
      (id): id is string => !!id,
    );
    const storedCourses = (preset.courses ?? []).filter(
      (id): id is string => !!id,
    );
    const courses =
      storedCourses.length > 0
        ? storedCourses
        : deriveCourses(collections, curriculaLite);
    setSelection({ coursesCollection: collections, courses });
    setSelectedPresetId(preset._id);
    setCustomLabel("");
  }

  function handleSelectorChange(next: {
    coursesCollection: string[];
    courses: string[];
  }) {
    // Persist the exact selection (including a granular per-experience series
    // subset) — no longer re-derived at save time.
    setSelection(next);
    if (selectedPresetId === "") return;
    const preset = presets.find((p) => p._id === selectedPresetId);
    const presetCollections = new Set(
      (preset?.coursesCollection ?? []).filter((id): id is string => !!id),
    );
    const diverged =
      presetCollections.size !== next.coursesCollection.length ||
      !next.coursesCollection.every((id) => presetCollections.has(id));
    if (diverged) setSelectedPresetId("");
  }

  async function handleSave() {
    const preset =
      selectedPresetId !== ""
        ? presets.find((p) => p._id === selectedPresetId)
        : undefined;

    let effectiveLabel: string;
    if (selectedPresetId !== "") {
      effectiveLabel = preset?.label ?? "";
    } else {
      const trimmed = customLabel.trim();
      effectiveLabel = trimmed !== "" ? trimmed : "Custom";
    }

    // Legacy presets (no coursesCollection) apply their courses directly and
    // clear coursesCollections; everything else derives courses from the
    // selected collections.
    const legacyPreset =
      preset &&
      (preset.coursesCollection ?? []).filter((id) => !!id).length === 0
        ? preset
        : undefined;
    const coursesCollections = legacyPreset ? [] : selection.coursesCollection;
    const courses = legacyPreset
      ? (legacyPreset.courses ?? []).filter((id): id is string => !!id)
      : selection.courses;

    setSubmitting(true);
    try {
      await onSubmit({
        coursesCollections,
        courses,
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

          {/* Experiences selector */}
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-muted-foreground">
              Experiences
            </span>
            <ExperiencesSelector
              value={selection}
              onChange={handleSelectorChange}
              disabled={submitting}
            />
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
