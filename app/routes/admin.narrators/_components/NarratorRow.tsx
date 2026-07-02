import { useEffect, useRef, useState } from "react";
import { useRevalidator } from "react-router";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Loader2,
  Trash2,
  User,
  X,
} from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { ConfirmDialog } from "~/components/ui/alert-dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { Textarea } from "~/components/ui/textarea";
import { toast } from "~/components/ui/toast";
import { api } from "~/lib/api";
import { env } from "~/lib/env";
import { toErrorMessage } from "~/lib/errors";
import { gqlClient } from "~/lib/graphql";
import {
  NarratorsDeleteOneDocument,
  NarratorsUpdateOneDocument,
} from "~/queries/narrators";
import { NARRATOR_LANGUAGES } from "./languages";

const MAX_AVATAR_BYTES = 5 * 1024 * 1024;

export type NarratorRowNarrator = {
  _id: string;
  name?: string | null;
  bio?: string | null;
  avatar?: { url?: string | null; type?: string | null } | null;
  languages?: Array<string | null> | null;
  active?: boolean | null;
  order?: number | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export interface NarratorRowProps {
  narrator: NarratorRowNarrator;
  onUpdated: (narrator: NarratorRowNarrator) => void;
  onDeleted: (id: string) => void;
}

function normalizeLanguages(
  languages: NarratorRowNarrator["languages"],
): string[] {
  return (languages ?? []).filter(
    (l): l is string => typeof l === "string" && l.length > 0,
  );
}

export function NarratorRow({
  narrator,
  onUpdated,
  onDeleted,
}: NarratorRowProps) {
  const revalidator = useRevalidator();
  const name = narrator.name ?? "";
  const active = narrator.active ?? true;

  // Inline name edit
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(name);
  const [savingName, setSavingName] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Expanded edit
  const [expanded, setExpanded] = useState(false);
  const [bio, setBio] = useState(narrator.bio ?? "");
  const [languages, setLanguages] = useState<string[]>(
    normalizeLanguages(narrator.languages),
  );
  const [activeState, setActiveState] = useState(active);
  const [savingExpanded, setSavingExpanded] = useState(false);

  // Avatar upload
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Delete
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (editingName && nameInputRef.current) {
      nameInputRef.current.focus();
      nameInputRef.current.select();
    }
  }, [editingName]);

  // Re-sync local state if the parent passes in a fresh narrator (e.g. after
  // an update from elsewhere).
  useEffect(() => {
    setNameValue(narrator.name ?? "");
    setBio(narrator.bio ?? "");
    setLanguages(normalizeLanguages(narrator.languages));
    setActiveState(narrator.active ?? true);
  }, [narrator]);

  async function handleNameSave() {
    const trimmed = nameValue.trim();
    if (!trimmed || trimmed === name) {
      setEditingName(false);
      setNameValue(name);
      return;
    }
    setSavingName(true);
    try {
      const data = await gqlClient.request(NarratorsUpdateOneDocument, {
        _id: narrator._id,
        record: { name: trimmed, platform: env.PLATFORM },
      });
      const payload = data.narratorsUpdateOne;
      // See NarratorDialog: ErrorInterface has no concrete implementations, so
      // codegen narrows `error` to `never`. Cast to access the selected shape.
      const payloadError = (
        payload as { error?: { message?: string } | null } | null | undefined
      )?.error;
      if (payloadError?.message) {
        throw new Error(payloadError.message);
      }
      const updated = payload?.record;
      if (!updated) {
        toast.error("Narrator updated but response was missing a record.");
        return;
      }
      onUpdated({ ...narrator, ...updated });
      setEditingName(false);
      toast.success("Narrator renamed");
    } catch (err) {
      const message = toErrorMessage(err, "Failed to rename narrator");
      toast.error(message);
    } finally {
      setSavingName(false);
    }
  }

  function handleNameKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      void handleNameSave();
    } else if (e.key === "Escape") {
      e.preventDefault();
      setNameValue(name);
      setEditingName(false);
    }
  }

  function toggleLanguage(code: string) {
    setLanguages((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code],
    );
  }

  function setPrimary(code: string) {
    setLanguages((prev) => {
      if (!prev.includes(code)) return prev;
      // Move `code` to index 0; preserve relative order of the rest.
      return [code, ...prev.filter((c) => c !== code)];
    });
  }

  async function handleExpandedSave() {
    setSavingExpanded(true);
    try {
      // languages[0] is primary by convention (see ./languages.ts).
      const data = await gqlClient.request(NarratorsUpdateOneDocument, {
        _id: narrator._id,
        record: {
          bio: bio.trim(),
          languages,
          active: activeState,
          platform: env.PLATFORM,
        },
      });
      const payload = data.narratorsUpdateOne;
      // See NarratorDialog: ErrorInterface has no concrete implementations, so
      // codegen narrows `error` to `never`. Cast to access the selected shape.
      const payloadError = (
        payload as { error?: { message?: string } | null } | null | undefined
      )?.error;
      if (payloadError?.message) {
        throw new Error(payloadError.message);
      }
      const updated = payload?.record;
      if (!updated) {
        toast.error("Narrator updated but response was missing a record.");
        return;
      }
      onUpdated({ ...narrator, ...updated });
      toast.success("Narrator updated");
      setExpanded(false);
    } catch (err) {
      const message = toErrorMessage(err, "Failed to update narrator");
      toast.error(message);
    } finally {
      setSavingExpanded(false);
    }
  }

  function handleExpandedCancel() {
    setBio(narrator.bio ?? "");
    setLanguages(normalizeLanguages(narrator.languages));
    setActiveState(narrator.active ?? true);
    setExpanded(false);
  }

  async function handleConfirmDelete() {
    setDeleting(true);
    try {
      // narratorsDeleteOne returns nullable String. We drop the row by the id
      // we already hold locally regardless of the returned value (it may be
      // null even when the mutation completed). Backend failures throw via
      // graphql-request and flow through the catch block below.
      await gqlClient.request(NarratorsDeleteOneDocument, {
        id: narrator._id,
      });
      onDeleted(narrator._id);
      toast.success("Narrator deleted");
      setConfirmOpen(false);
    } catch (err) {
      const message = toErrorMessage(err, "Failed to delete narrator");
      toast.error(message);
    } finally {
      setDeleting(false);
    }
  }

  async function handleAvatarPick(file: File) {
    if (file.size > MAX_AVATAR_BYTES) {
      toast.error("Avatar must be 5 MB or smaller.");
      return;
    }
    setUploadingAvatar(true);
    try {
      const fd = new FormData();
      fd.append("_id", narrator._id); // underscore — not "id"
      fd.append("file", file);
      await api("/admin/narrator-avatar", { method: "PUT", body: fd });
      toast.success("Avatar updated");
      revalidator.revalidate();
    } catch (err) {
      const message = toErrorMessage(err, "Avatar upload failed");
      toast.error(message);
    } finally {
      setUploadingAvatar(false);
    }
  }

  return (
    <div className="bg-card rounded-[14px] shadow-xs border border-border">
      {/* Main row */}
      <div className="p-4 flex items-center justify-between gap-3">
        {/* Avatar dropzone */}
        <label
          className="w-12 h-12 rounded-full bg-muted flex-shrink-0 overflow-hidden cursor-pointer relative ring-1 ring-transparent hover:ring-2 hover:ring-dashed hover:ring-border transition-shadow"
          title="Click to upload avatar"
        >
          {narrator.avatar?.url ? (
            <img
              src={narrator.avatar.url}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <User
                className="w-5 h-5 text-muted-foreground"
                aria-hidden="true"
              />
            </div>
          )}
          {uploadingAvatar ? (
            <div className="absolute inset-0 flex items-center justify-center bg-background/60">
              <Loader2
                className="w-4 h-4 animate-spin text-muted-foreground"
                aria-hidden="true"
              />
            </div>
          ) : null}
          <input
            type="file"
            accept="image/png,image/jpeg"
            className="hidden"
            disabled={uploadingAvatar}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleAvatarPick(file);
              e.target.value = "";
            }}
          />
        </label>

        {/* Name + badges */}
        <div className="min-w-0 flex-1">
          {editingName ? (
            <div className="flex items-center gap-2">
              <Input
                ref={nameInputRef}
                value={nameValue}
                onChange={(e) => setNameValue(e.target.value)}
                onKeyDown={handleNameKeyDown}
                disabled={savingName}
                className="h-8 text-sm"
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => void handleNameSave()}
                disabled={savingName}
                aria-label="Save name"
              >
                {savingName ? (
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
                  setNameValue(name);
                  setEditingName(false);
                }}
                disabled={savingName}
                aria-label="Cancel rename"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </Button>
            </div>
          ) : (
            <p
              className="font-medium truncate cursor-pointer hover:text-muted-foreground transition-colors"
              onClick={() => setEditingName(true)}
              title="Click to edit name"
            >
              {name || "Unnamed narrator"}
            </p>
          )}
          <div className="flex flex-wrap gap-1.5 mt-1 items-center">
            {languages.length > 0 ? (
              languages.map((code) => (
                <Badge
                  key={code}
                  shape="tag"
                  className="text-muted-foreground border-border"
                >
                  {code.toUpperCase()}
                </Badge>
              ))
            ) : (
              <span className="text-xs text-muted-foreground">
                No languages
              </span>
            )}
            {!activeState ? (
              <Badge
                shape="tag"
                className="text-amber-600 border-amber-300 bg-amber-50"
              >
                Inactive
              </Badge>
            ) : null}
          </div>
        </div>

        {/* Expand chevron */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setExpanded((v) => !v)}
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
              htmlFor={`narrator-bio-${narrator._id}`}
              className="text-xs font-medium text-muted-foreground"
            >
              Bio
            </Label>
            <Textarea
              id={`narrator-bio-${narrator._id}`}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Brief narrator bio…"
              className="min-h-[80px] text-sm"
            />
          </div>

          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">
              Languages
            </p>
            <div className="flex flex-wrap gap-3">
              {NARRATOR_LANGUAGES.map((lang) => {
                const checked = languages.includes(lang.code);
                const isPrimary = checked && languages[0] === lang.code;
                const checkboxId = `lang-${narrator._id}-${lang.code}`;
                return (
                  <div
                    key={lang.code}
                    className="flex items-center gap-2"
                  >
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
                    {checked ? (
                      <button
                        type="button"
                        onClick={() => setPrimary(lang.code)}
                        className={
                          isPrimary
                            ? "text-xs px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700"
                            : "text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground hover:bg-muted/80"
                        }
                      >
                        {isPrimary ? "Primary" : "Set Primary"}
                      </button>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>

          {/* TODO(narrator-practices): wire when schema exposes the relation */}

          <div className="flex items-center justify-between">
            <Label
              htmlFor={`narrator-active-${narrator._id}`}
              className="text-sm text-muted-foreground"
            >
              Active
            </Label>
            <Switch
              id={`narrator-active-${narrator._id}`}
              checked={activeState}
              onCheckedChange={setActiveState}
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
              title="Delete Narrator"
              description={`Are you sure you want to delete "${name || "this narrator"}"? This will remove them from all assigned practices.`}
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
