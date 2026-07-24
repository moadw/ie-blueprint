import { useEffect, useRef, useState } from "react";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  EllipsisVertical,
  Film,
  FolderInput,
  GalleryHorizontalEnd,
  GripVertical,
  Image as ImageIcon,
  ImageIcon as ImageOverlay,
  Images,
  Loader2,
  Music,
  NotebookPen,
  Trash2,
  X,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import { SegmentedTabs } from "~/components/ui/segmented-tabs";
import { Switch } from "~/components/ui/switch";
import { TapBlocks } from "~/components/admin/tap-blocks";
import { AchievementBlock } from "~/components/admin/achievement-block";
import { ReassignPracticeDialog } from "~/components/admin/reassign-practice-dialog";
import { api } from "~/lib/api";
import { toErrorMessage } from "~/lib/errors";
import { gqlClient } from "~/lib/graphql";
import { ClassesUpdateOneDocument } from "~/mutations/classes";
import type { ClassesAdminFindManyQuery } from "~/gql/graphql";
import { cn } from "~/lib/utils";

type Practice = NonNullable<
  ClassesAdminFindManyQuery["ClassesAdminFindMany"]
>[number];

/**
 * Per-class content summary rendered as the collapsed-row indicator boxes.
 * Each field holds the distinct language labels ("EN" | "ES" | "Both") of the
 * taps of that type in the class; an empty array = the class has no tap of that
 * type (its box renders inactive/dashed). Built server-side in the series
 * loader from one TapFindMany over all the series' classes.
 */
export type ClassContentSummary = {
  journal: string[];
  full: string[];
  fiveMin: string[];
  video: string[];
  slider: string[];
  preview: string[];
};

export const EMPTY_CONTENT_SUMMARY: ClassContentSummary = {
  journal: [],
  full: [],
  fiveMin: [],
  video: [],
  slider: [],
  preview: [],
};

// The six content-block boxes, in display order. Active tint per type mirrors
// the prototype (Full=blue, 5min=amber, Video=purple); Journal=teal,
// Slider=sky and Preview=orange are added per request. Slider and Preview are
// slide-style types and share the accent used by their expanded slide icons
// (slider=sky, preview=orange) so collapsed and expanded surfaces agree.
// Inactive types fall back to a dashed grey box.
const CONTENT_BOXES: ReadonlyArray<{
  key: keyof ClassContentSummary;
  label: string;
  Icon: LucideIcon;
  active: string;
}> = [
  { key: "journal", label: "Journal", Icon: NotebookPen, active: "border-teal-200 bg-teal-50 text-teal-600" },
  { key: "full", label: "Full", Icon: Music, active: "border-blue-200 bg-blue-50 text-blue-600" },
  { key: "fiveMin", label: "5min", Icon: Clock, active: "border-amber-300 bg-amber-50 text-amber-700" },
  { key: "video", label: "Video", Icon: Film, active: "border-purple-200 bg-purple-50 text-purple-600" },
  { key: "slider", label: "Slider", Icon: Images, active: "border-sky-200 bg-sky-50 text-sky-600" },
  { key: "preview", label: "Preview", Icon: GalleryHorizontalEnd, active: "border-orange-200 bg-orange-50 text-orange-600" },
];

// Collapsed-row content checklist. One box per block type; colored when the
// class has that type (with its EN/ES/Both language tag), dashed grey when not.
// Hidden below `sm` to keep narrow rows uncluttered — the info is still on the
// tap subtitles inside the accordion.
function ContentTypeBoxes({ content }: { content: ClassContentSummary }) {
  return (
    <div className="hidden flex-shrink-0 items-stretch gap-2 sm:flex">
      {CONTENT_BOXES.map(({ key, label, Icon, active }) => {
        const langs = content[key];
        const isActive = langs.length > 0;
        return (
          <div
            key={key}
            title={isActive ? `${label}: ${langs.join(", ")}` : `No ${label} content`}
            className={cn(
              "flex w-14 flex-col items-center justify-center gap-0.5 rounded-[12px] border px-1 py-1.5 text-center",
              isActive
                ? active
                : "border-dashed border-stone-200 bg-transparent text-stone-300",
            )}
          >
            <Icon className="h-4 w-4" />
            <span className="text-[10px] font-medium leading-none">{label}</span>
            <span className="text-[9px] leading-none">
              {isActive ? langs.join(" ") : "—"}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export interface PracticeRowProps {
  practice: Practice;
  /** Content-block summary for the collapsed row; null hides the boxes. */
  content?: ClassContentSummary | null;
  /** The current series' title, shown in the reassign confirm copy. */
  currentSeriesTitle?: string | null;
  onChange: () => void;
}

const labelClass = "block text-[14px] text-foreground mb-2 font-medium";

export function PracticeRow({
  practice,
  content = null,
  currentSeriesTitle = null,
  onChange,
}: PracticeRowProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const bgInputRef = useRef<HTMLInputElement | null>(null);
  const practiceId = practice._id ?? "";

  const [expanded, setExpanded] = useState(false);
  const [title, setTitle] = useState(practice.title ?? "");
  const [description, setDescription] = useState(practice.description ?? "");
  const [spanishTitle, setSpanishTitle] = useState(
    practice.language?.spanish?.title ?? "",
  );
  const [spanishDescription, setSpanishDescription] = useState(
    practice.language?.spanish?.description ?? "",
  );
  const [locale, setLocale] = useState<"en" | "es">("en");
  const initialDay = Math.max(1, Math.round(practice.order ?? 1));
  const [day, setDay] = useState<number>(initialDay);

  // Access is wired to the record's `free` flag.
  const [accessLevel, setAccessLevel] = useState<string>(
    practice.free ? "free" : "premium",
  );
  // Persisted to the record's `feedback` flag. Read-back reflects the stored
  // value: pre-existing records have `feedback = null` (field is new, never
  // written), which is "not enabled" → show off. Only an explicit `true` shows
  // on. (Create defaults to on; that's a new-record choice, not a read-back.)
  const [feedback, setFeedback] = useState<boolean>(practice.feedback ?? false);

  // Visual-only state (not persisted)
  const [active, setActive] = useState<boolean>(true);

  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [titleEditing, setTitleEditing] = useState(false);
  const [titleSaving, setTitleSaving] = useState(false);

  // Kebab action menu + reassign dialog. `reassignOpen` is set here but
  // consumed by the ReassignPracticeDialog wired in a later phase (no-op now).
  const [menuOpen, setMenuOpen] = useState(false);
  const [reassignOpen, setReassignOpen] = useState(false);

  // The class background persists like the cover: `PUT /admin/class-background`
  // writes it, and the GraphQL `classes` type exposes `background { url type }`
  // to read it back. `bgPreview` is an optimistic local preview of the
  // just-uploaded file shown until the parent revalidates and
  // `practice.background.url` refetches.
  const [bgPreview, setBgPreview] = useState<string | null>(null);
  const [bgUploading, setBgUploading] = useState(false);

  // Revoke the previous object URL whenever the preview changes or on unmount.
  useEffect(() => {
    if (!bgPreview) return;
    return () => URL.revokeObjectURL(bgPreview);
  }, [bgPreview]);

  // Re-sync local state if practice changes from parent revalidate.
  useEffect(() => {
    setTitle(practice.title ?? "");
    setDescription(practice.description ?? "");
    setDay(Math.max(1, Math.round(practice.order ?? 1)));
    setFeedback(practice.feedback ?? false);
    setSpanishTitle(practice.language?.spanish?.title ?? "");
    setSpanishDescription(practice.language?.spanish?.description ?? "");
  }, [
    practice._id,
    practice.title,
    practice.description,
    practice.order,
    practice.feedback,
    practice.language?.spanish?.title,
    practice.language?.spanish?.description,
  ]);

  const dayValue = Math.max(1, Math.round(day || 1));

  // Prefer the optimistic just-uploaded preview, else the persisted background.
  const bgUrl = bgPreview ?? practice.background?.url ?? null;

  async function persistTitle(nextTitle: string) {
    const trimmed = nextTitle.trim();
    if (!trimmed || trimmed === (practice.title ?? "").trim()) {
      setTitle(practice.title ?? "");
      return;
    }
    setTitleSaving(true);
    try {
      const data = await gqlClient.request(ClassesUpdateOneDocument, {
        _id: practiceId,
        record: { title: trimmed },
      });
      const payloadError = (
        data.ClassesUpdateOne as { error?: { message?: string } | null } | null | undefined
      )?.error;
      if (payloadError?.message) throw new Error(payloadError.message);
      toast.success("Practice updated");
      onChange();
    } catch (err) {
      const msg = toErrorMessage(err, "Failed to update title");
      toast.error(msg);
      setTitle(practice.title ?? "");
    } finally {
      setTitleSaving(false);
    }
  }

  async function handleSave() {
    setSubmitting(true);
    try {
      // Shared write helper (mirrors practice-dialog): build `language` from the
      // trimmed EN/ES values and whether Spanish participates now (`hasSpanish`)
      // or previously (`hadSpanish`). English mirrors the top-level fields; empty
      // subfields are sent as "" (migration-fidelity shape, no label/identifier).
      // Blanking both Spanish fields on a record that HAD Spanish therefore sends
      // `spanish: { title: "", description: "" }` (empty strings, NOT null).
      const enTitle = title.trim();
      const enDescription = description.trim();
      const esTitle = spanishTitle.trim();
      const esDescription = spanishDescription.trim();
      const hasSpanish = Boolean(esTitle || esDescription);
      const hadSpanish = Boolean(
        practice.language?.spanish?.title ||
          practice.language?.spanish?.description,
      );
      let language:
        | {
            english: { title: string; description: string };
            spanish: { title: string; description: string };
          }
        | undefined;
      if (hasSpanish || hadSpanish) {
        language = {
          english: { title: enTitle, description: enDescription },
          spanish: { title: esTitle, description: esDescription },
        };
      }

      const data = await gqlClient.request(ClassesUpdateOneDocument, {
        _id: practiceId,
        record: {
          title: title.trim(),
          description: description.trim() || null,
          order: dayValue,
          free: accessLevel === "free",
          feedback,
          // Category, Grade, Active are visual-only (I2/I3).
          // `deleted` is not written here — soft delete is the Delete button's job (I3).
          ...(language ? { language } : {}),
        },
      });
      const payloadError = (
        data.ClassesUpdateOne as { error?: { message?: string } | null } | null | undefined
      )?.error;
      if (payloadError?.message) throw new Error(payloadError.message);
      toast.success("Practice updated");
      onChange();
      setExpanded(false);
    } catch (err) {
      const msg = toErrorMessage(err, "Failed to update practice");
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (
      !window.confirm(
        `Delete practice "${practice.title ?? "Untitled"}"?`,
      )
    )
      return;
    setDeleting(true);
    try {
      // Soft delete: flag the record; loader filters out `deleted` rows.
      await gqlClient.request(ClassesUpdateOneDocument, {
        _id: practiceId,
        record: { deleted: true },
      });
      toast.success("Practice deleted");
      onChange();
    } catch (err) {
      const msg = toErrorMessage(err, "Failed to delete practice");
      toast.error(msg);
    } finally {
      setDeleting(false);
    }
  }

  async function handleCoverPick(file: File) {
    try {
      const fd = new FormData();
      fd.append("class", practiceId); // class-cover uses field "class", not "_id"
      fd.append("file", file);
      await api("/admin/class-cover", { method: "PUT", body: fd });
      toast.success("Cover updated");
      onChange();
    } catch (err) {
      const msg = toErrorMessage(err, "Cover upload failed");
      console.error("[class-cover] upload failed", err);
      toast.error(msg);
    }
  }

  async function handleBgPick(file: File) {
    // Optimistic preview until the parent revalidates and `background.url` refetches.
    setBgPreview(URL.createObjectURL(file));
    setBgUploading(true);
    try {
      const fd = new FormData();
      // /admin/class-background mirrors /admin/class-cover: field "class" = class _id.
      fd.append("class", practiceId);
      fd.append("file", file);
      await api("/admin/class-background", { method: "PUT", body: fd });
      toast.success("Background updated");
      onChange();
    } catch (err) {
      const msg = toErrorMessage(err, "Background upload failed");
      console.error("[class-background] upload failed", err);
      toast.error(msg);
      setBgPreview(null); // revert — no server value to fall back to
    } finally {
      setBgUploading(false);
    }
  }

  return (
    <div className="rounded-[16px] border-2 border-stone-200 bg-white shadow-xs transition-colors">
      <div className="flex items-center justify-between gap-3 p-4">
        {/* TODO(reorder): wire to dnd-kit + ClassesUpdateOne order mutation */}
        <button
          type="button"
          aria-label="Drag to reorder"
          title="Drag to reorder (coming soon)"
          className="cursor-grab active:cursor-grabbing p-1 text-stone-400 hover:text-stone-600 touch-none flex-shrink-0"
        >
          <GripVertical className="h-5 w-5" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleCoverPick(file);
            e.target.value = "";
          }}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="group relative h-12 w-12 flex-shrink-0 cursor-pointer overflow-hidden rounded bg-stone-100 transition-all"
          aria-label="Upload cover"
          title="Cover image — click to upload"
        >
          {practice.cover?.url ? (
            <img
              src={practice.cover.url}
              alt={practice.title ?? "Practice cover"}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center">
              <ImageIcon className="h-4 w-4 text-stone-300" />
              <span className="mt-0.5 text-[8px] text-stone-400">Cover</span>
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
            <ImageOverlay className="h-3 w-3 text-white" />
          </div>
        </button>

        <input
          ref={bgInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleBgPick(file);
            e.target.value = "";
          }}
        />
        <button
          type="button"
          onClick={() => bgInputRef.current?.click()}
          disabled={bgUploading}
          className="group relative h-12 w-12 flex-shrink-0 cursor-pointer overflow-hidden rounded bg-stone-100 transition-all disabled:cursor-wait"
          aria-label="Upload background"
          title="Background image — click to upload"
        >
          {bgUrl ? (
            <img
              src={bgUrl}
              alt={`${practice.title ?? "Practice"} background`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center rounded border-2 border-dashed border-stone-200">
              <ImageIcon className="h-4 w-4 text-stone-300" />
              <span className="mt-0.5 text-[8px] text-stone-400">BG</span>
            </div>
          )}
          {bgUploading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <Loader2 className="h-3 w-3 animate-spin text-white" />
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
              <ImageOverlay className="h-3 w-3 text-white" />
            </div>
          )}
        </button>

        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded bg-stone-100 font-serif text-sm font-semibold text-stone-700">
          {dayValue}
        </div>

        <div className="min-w-0 flex-1">
          {titleEditing ? (
            <div className="flex items-center gap-2">
              <input
                autoFocus
                value={title}
                disabled={titleSaving}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    persistTitle(title);
                    setTitleEditing(false);
                  } else if (e.key === "Escape") {
                    setTitle(practice.title ?? "");
                    setTitleEditing(false);
                  }
                }}
                className="h-8 flex-1 rounded border border-stone-200 bg-stone-50 px-2 text-sm font-medium text-stone-900 outline-none focus:ring-2 focus:ring-primary/30"
              />
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  persistTitle(title);
                  setTitleEditing(false);
                }}
                className="flex h-6 w-6 items-center justify-center rounded text-emerald-600 hover:bg-stone-100"
                aria-label="Save title"
              >
                <Check className="h-3 w-3" />
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setTitle(practice.title ?? "");
                  setTitleEditing(false);
                }}
                className="flex h-6 w-6 items-center justify-center rounded text-stone-400 hover:bg-stone-100"
                aria-label="Cancel title edit"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <p
              onClick={() => setTitleEditing(true)}
              className="cursor-pointer truncate font-medium text-stone-900 transition-colors hover:text-stone-600"
              title="Click to edit title"
            >
              {practice.title || "Untitled"}
            </p>
          )}
          <div className="mt-1 flex items-center gap-2">
            {practice.description ? (
              <p
                className="min-w-0 flex-1 truncate text-sm text-stone-500"
                title={practice.description}
              >
                {practice.description}
              </p>
            ) : (
              <span className="min-w-0 flex-1 truncate text-xs italic text-stone-400">
                No description added
              </span>
            )}
          </div>
        </div>

        {content ? <ContentTypeBoxes content={content} /> : null}

        <div className="flex flex-shrink-0 gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setExpanded((x) => !x)}
            aria-label={expanded ? "Collapse" : "Expand"}
            className="text-stone-500 hover:bg-stone-100 hover:text-stone-700"
          >
            {expanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
          <DropdownMenu
            open={menuOpen}
            onOpenChange={setMenuOpen}
            trigger={
              <Button
                variant="ghost"
                size="icon"
                aria-label="Practice actions"
                className="text-stone-500 hover:bg-stone-100 hover:text-stone-700"
              >
                <EllipsisVertical className="h-4 w-4" />
              </Button>
            }
          >
            <DropdownMenuItem
              icon={<FolderInput className="h-4 w-4" />}
              onClick={() => {
                setMenuOpen(false);
                setReassignOpen(true);
              }}
            >
              Re-assign series
            </DropdownMenuItem>
            <DropdownMenuItem
              destructive
              disabled={deleting}
              icon={
                deleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )
              }
              onClick={() => {
                setMenuOpen(false);
                handleDelete();
              }}
            >
              Delete Practice
            </DropdownMenuItem>
          </DropdownMenu>
        </div>
      </div>

      {expanded ? (
        <div className="space-y-4 border-t border-stone-100 px-4 pt-2 pb-4">
          <div className="rounded-[14px] border border-border bg-card p-4 space-y-4">
            <SegmentedTabs
              value={locale}
              onChange={setLocale}
              options={[
                { value: "en", label: "English" },
                { value: "es", label: "Spanish" },
              ]}
              ariaLabel="Content language"
            />

            {locale === "en" ? (
              <>
                <Input
                  label="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Morning Breath"
                />

                <div>
                  <label
                    className={labelClass}
                    htmlFor={`practice-${practiceId}-description`}
                  >
                    Description
                  </label>
                  <textarea
                    id={`practice-${practiceId}-description`}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="h-24 w-full rounded-lg border border-border bg-card p-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </>
            ) : (
              <>
                <Input
                  label="Title"
                  value={spanishTitle}
                  onChange={(e) => setSpanishTitle(e.target.value)}
                  placeholder="p. ej. Respiración matutina"
                />

                <div>
                  <label
                    className={labelClass}
                    htmlFor={`practice-${practiceId}-spanish-description`}
                  >
                    Description
                  </label>
                  <textarea
                    id={`practice-${practiceId}-spanish-description`}
                    value={spanishDescription}
                    onChange={(e) => setSpanishDescription(e.target.value)}
                    className="h-24 w-full rounded-lg border border-border bg-card p-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="¿De qué trata esta práctica?"
                  />
                </div>
              </>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-stone-600">
                Day
              </label>
              <input
                type="number"
                min={1}
                step={1}
                value={day}
                onChange={(e) =>
                  setDay(Math.max(1, Number(e.target.value) || 1))
                }
                className="h-9 w-full rounded-md border border-stone-200 bg-card px-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-stone-600">
                Feedback
              </label>
              <div className="flex h-9 items-center rounded-md border border-stone-200 bg-stone-50/40 px-3">
                <Switch checked={feedback} onCheckedChange={setFeedback} />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-stone-600">
                Active
              </label>
              <div className="flex h-9 items-center rounded-md border border-stone-200 bg-stone-50/40 px-3">
                <Switch checked={active} onCheckedChange={setActive} />
              </div>
            </div>
          </div>

          {/* Taps persist via their own mutations — independent of the
              practice Save button below. */}
          <div>
            <label className="mb-1 block text-xs font-medium text-stone-600">
              Content
            </label>
            <TapBlocks classId={practiceId} />
          </div>

          {/* The achievement (pin) persists via its own mutations —
              independent of the practice Save button below. */}
          <div>
            <label className="mb-1 block text-xs font-medium text-stone-600">
              Achievement
            </label>
            <AchievementBlock
              classId={practiceId}
              curriculumId={practice.curriculum ?? null}
            />
          </div>

          <div className="flex justify-end">
            <Button
              size="sm"
              onClick={handleSave}
              disabled={submitting}
              className="bg-stone-900 text-white hover:bg-stone-800"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </div>
      ) : null}

      <ReassignPracticeDialog
        open={reassignOpen}
        onClose={() => setReassignOpen(false)}
        practice={{
          _id: practiceId,
          title: practice.title ?? null,
          curriculum: practice.curriculum ?? null,
        }}
        currentSeriesTitle={currentSeriesTitle ?? null}
        onReassigned={onChange}
      />
    </div>
  );
}

export default PracticeRow;
