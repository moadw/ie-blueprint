import { useRef } from "react";
import { Camera, Loader2 } from "lucide-react";
import { cn } from "~/lib/utils";

// Kept in sync with the pick-side validation in `classrooms_.create.tsx`.
const ACCEPTED_TYPES = "image/png,image/jpeg,image/webp";

export interface ClassroomIconUploadProps {
  /** Name initials shown in the empty state; falls back to "?" when blank. */
  initials: string;
  /** Object-URL preview of the picked image, or null for the initials state. */
  previewUrl: string | null;
  /** Show the spinner overlay while an upload is in flight. */
  uploading?: boolean;
  onPick: (file: File) => void;
}

/**
 * Route-private "Classroom icon" uploader. Rebuilt from the prototype's
 * `AvatarUpload` (size="sm", shape="rounded"): a rounded-xl tile with an
 * initials fallback, an image preview, and a Camera/Loader2 hover overlay.
 * Controlled — the parent owns the picked file + preview URL. Single caller,
 * so it lives in the route's `_components/` folder rather than shared `ui/`.
 */
export function ClassroomIconUpload({
  initials,
  previewUrl,
  uploading = false,
  onPick,
}: ClassroomIconUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      disabled={uploading}
      aria-label="Classroom icon — click to upload"
      className={cn(
        "group relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl",
        "border-2 border-border bg-muted/30 transition-colors duration-200",
        "hover:border-primary/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
        "disabled:cursor-wait sm:h-12 sm:w-12",
      )}
    >
      {previewUrl ? (
        <img
          src={previewUrl}
          alt="Classroom icon"
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="select-none text-sm font-semibold text-primary sm:text-base lg:text-lg">
          {initials || "?"}
        </span>
      )}

      {/* Hover overlay: Camera normally, spinner while uploading. */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        {uploading ? (
          <Loader2 className="h-5 w-5 animate-spin text-white" />
        ) : (
          <Camera className="h-5 w-5 text-white" />
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onPick(file);
          e.target.value = "";
        }}
      />
    </button>
  );
}
