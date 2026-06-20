import { useCallback, useEffect, useState } from "react";
import type { DragEvent } from "react";
import { FileText, Film, Image as ImageIcon, Paperclip, X } from "lucide-react";

type MediaType = "image" | "video" | "document";

interface SelectedMedia {
  /** Object URL for local preview (revoked on clear / unmount). */
  previewUrl: string;
  name: string;
  type: MediaType;
}

interface JournalMediaUploadProps {
  value: SelectedMedia | null;
  onChange: (value: SelectedMedia | null) => void;
}

function getMediaType(file: File): MediaType {
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";
  return "document";
}

function getFileIcon(type: MediaType) {
  switch (type) {
    case "image":
      return ImageIcon;
    case "video":
      return Film;
    default:
      return FileText;
  }
}

/**
 * Dashed-border media dropzone for the journal entry. Rebuilt from the
 * prototype's `JournalMediaUpload` (visual reference only). UI ONLY — it
 * creates a local object-URL preview and never uploads anything (the real
 * upload is a data-wiring follow-up). The object URL is revoked when the
 * selection clears or the component unmounts.
 */
export function JournalMediaUpload({ value, onChange }: JournalMediaUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  // Revoke the last object URL on unmount so we don't leak it.
  useEffect(() => {
    return () => {
      if (value) URL.revokeObjectURL(value.previewUrl);
    };
  }, [value]);

  const handleFile = useCallback(
    (file: File) => {
      const previewUrl = URL.createObjectURL(file);
      onChange({ previewUrl, name: file.name, type: getMediaType(file) });
    },
    [onChange],
  );

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const handleClear = useCallback(() => {
    if (value) URL.revokeObjectURL(value.previewUrl);
    onChange(null);
  }, [value, onChange]);

  // Preview state for a selected file.
  if (value) {
    const Icon = getFileIcon(value.type);
    return (
      <div className="relative overflow-hidden rounded-xl bg-white/5 p-3">
        <div className="flex items-center gap-3">
          {value.type === "image" ? (
            <img
              src={value.previewUrl}
              alt="Attachment preview"
              className="h-12 w-12 rounded-lg object-cover"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/10">
              <Icon className="h-5 w-5 text-white/60" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm text-white/80">{value.name}</p>
            <p className="text-xs capitalize text-white/50">{value.type}</p>
          </div>
          <button
            type="button"
            onClick={handleClear}
            aria-label="Remove attachment"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/60 transition-colors hover:bg-white/20 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  // Empty dropzone.
  return (
    <label
      onDrop={handleDrop}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setIsDragging(false);
      }}
      className={`flex cursor-pointer items-center gap-3 rounded-xl border border-dashed p-3 transition-colors ${
        isDragging
          ? "border-white/40 bg-white/10"
          : "border-white/15 bg-white/5 hover:border-white/25 hover:bg-white/10"
      }`}
    >
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white/10">
        <Paperclip className="h-5 w-5 text-white/60" />
      </div>
      <span className="flex-1 text-sm text-white/70">
        Add photo, video, or file
      </span>
      <input
        type="file"
        accept="image/*,video/*,.pdf,.doc,.docx,.txt"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
    </label>
  );
}

export type { SelectedMedia };
