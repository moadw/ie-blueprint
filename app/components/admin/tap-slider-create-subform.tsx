import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, DragEvent } from "react";
import { Film, GripVertical, ImageIcon, Plus, Trash2 } from "lucide-react";
import {
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export type SliderFileKind = "image" | "video";

export type SliderFileItem = {
  /**
   * Stable client-side id for dnd + list keys (dropped `File`s have no natural
   * id). The row order of these items defines the final tap order in Phase 3.
   */
  id: string;
  file: File;
  kind: SliderFileKind;
  /**
   * Object URL for the inline `<img>`/`<video>` preview. Revoked when the item
   * is removed or when the subform unmounts (dialog close / type change) so the
   * blob references never leak.
   */
  previewUrl: string;
};

// Pass-1 media types (mirrors the plan): images + mp4 video. Kept in sync with
// the create-Save pipeline that follows in Phase 3.
const ACCEPT = "image/jpeg,image/webp,image/png,video/mp4";
// Allowed MIME set derived from ACCEPT (single source of truth). `accept` only
// constrains the native picker, so drops are filtered against this to reject
// unsupported files (e.g. a dropped .pdf would otherwise become a slide).
const ACCEPTED_TYPES = new Set(ACCEPT.split(","));

// Kind is derived purely from the MIME prefix — anything non-video is treated
// as an image (matches the prototype's `startsWith('video/') ? 'video' : 'image'`).
function kindOf(file: File): SliderFileKind {
  return file.type.startsWith("video/") ? "video" : "image";
}

// Build items for freshly-selected files. Allocates one object URL per file;
// callers own revocation (see removeItem / the unmount effect). Kept out of any
// state updater so React StrictMode's double-invocation can't leak URLs.
function makeItems(files: FileList | File[]): SliderFileItem[] {
  return Array.from(files).map((file) => ({
    id: crypto.randomUUID(),
    file,
    kind: kindOf(file),
    previewUrl: URL.createObjectURL(file),
  }));
}

interface SortableSliderRowProps {
  item: SliderFileItem;
  index: number;
  onRemove: (id: string) => void;
}

// Route-private sortable row. Drag is initiated by the GripVertical handle (it
// owns the dnd listeners) so a click on the remove button isn't hijacked —
// same pattern as `SortableTapRow` in tap-blocks.tsx.
function SortableSliderRow({ item, index, onRemove }: SortableSliderRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 10 : undefined,
  };

  const label = item.file.name || `Slide ${index + 1}`;
  const isVideo = item.kind === "video";

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 rounded-lg border border-border bg-card p-2"
    >
      <button
        type="button"
        aria-label={`Drag to reorder ${label}`}
        className="cursor-grab touch-none p-1 text-muted-foreground transition-colors hover:text-foreground active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <div className="h-10 w-16 flex-shrink-0 overflow-hidden rounded-md border border-border bg-muted">
        {isVideo ? (
          <video
            src={item.previewUrl}
            muted
            playsInline
            className="h-full w-full object-cover"
          />
        ) : (
          <img
            src={item.previewUrl}
            alt=""
            className="h-full w-full object-cover"
          />
        )}
      </div>
      <div className="flex min-w-0 flex-1 items-center gap-1.5">
        {isVideo ? (
          <Film
            className="h-3 w-3 flex-shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
        ) : (
          <ImageIcon
            className="h-3 w-3 flex-shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
        )}
        <span className="truncate text-xs text-muted-foreground">{label}</span>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => onRemove(item.id)}
        aria-label={`Remove ${label}`}
        className="h-8 w-8 flex-shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}

export interface TapSliderCreateSubformProps {
  value: SliderFileItem[];
  /**
   * Accepts a plain array or a functional updater (a `useState` setter can be
   * passed directly), mirroring `TapVideosSubform.onChange`. The selected-files
   * state itself is owned by `TapDialog`.
   */
  onChange: (
    update: SliderFileItem[] | ((prev: SliderFileItem[]) => SliderFileItem[]),
  ) => void;
}

/**
 * Multi-file upload subform for the "slider" tap type in create mode: a dashed
 * dropzone (click-to-browse + native drag-and-drop) plus a reorderable list of
 * the selected files. UI only — persistence (one tap per file) is wired in
 * Phase 3. Visual family follows `TapVideosSubform`'s token-driven upload
 * control (dashed border, `bg-card`, `text-muted-foreground`), NOT the
 * prototype's raw v3 classes.
 */
export function TapSliderCreateSubform({
  value,
  onChange,
}: TapSliderCreateSubformProps) {
  const [dragActive, setDragActive] = useState(false);

  // Small activation distance so a click on the remove button isn't mistaken
  // for a drag; KeyboardSensor for accessible reordering (same as tap-blocks).
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Revoke any outstanding object URLs when the subform unmounts (dialog close
  // or a type change away from slider). A ref keeps the cleanup pointed at the
  // latest list without re-registering the effect on every change.
  const valueRef = useRef(value);
  valueRef.current = value;
  useEffect(() => {
    return () => {
      for (const item of valueRef.current) {
        URL.revokeObjectURL(item.previewUrl);
      }
    };
  }, []);

  function addFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    // `accept` only gates the native picker, not drops — filter to the allowed
    // MIME set so a dropped unsupported file (e.g. .pdf, .mov) is silently
    // dropped instead of becoming a slide or a doomed upload.
    const accepted = Array.from(files).filter((file) =>
      ACCEPTED_TYPES.has(file.type),
    );
    if (accepted.length === 0) return;
    const items = makeItems(accepted);
    onChange((prev) => [...prev, ...items]);
  }

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    addFiles(e.target.files);
    // Reset so re-selecting the same file still fires onChange.
    e.target.value = "";
  }

  function handleDrop(e: DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    setDragActive(false);
    addFiles(e.dataTransfer.files);
  }

  function removeItem(id: string) {
    const item = value.find((it) => it.id === id);
    if (item) URL.revokeObjectURL(item.previewUrl);
    onChange((prev) => prev.filter((it) => it.id !== id));
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    onChange((prev) => {
      const oldIndex = prev.findIndex((it) => it.id === active.id);
      const newIndex = prev.findIndex((it) => it.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return prev;
      return arrayMove(prev, oldIndex, newIndex);
    });
  }

  return (
    <div className="space-y-3">
      <label
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-border bg-card px-4 py-6 text-center transition-colors hover:border-foreground/30 focus-within:ring-2 focus-within:ring-primary/30",
          dragActive && "border-primary/60 bg-primary/5",
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragActive(false);
        }}
        onDrop={handleDrop}
      >
        <Plus className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
        <span className="text-xs text-muted-foreground">
          Drop images or videos here, or click to browse.
        </span>
        <input
          type="file"
          multiple
          accept={ACCEPT}
          className="sr-only"
          onChange={handleInputChange}
        />
      </label>

      {value.length > 0 ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={value.map((it) => it.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-1.5">
              {value.map((item, index) => (
                <SortableSliderRow
                  key={item.id}
                  item={item}
                  index={index}
                  onRemove={removeItem}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : null}
    </div>
  );
}

export default TapSliderCreateSubform;
