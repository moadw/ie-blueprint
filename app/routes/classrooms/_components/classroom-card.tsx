import { useState } from "react";
import type { MouseEvent } from "react";
import { Loader2, X } from "lucide-react";
import { cn } from "~/lib/utils";

interface ClassroomCardProps {
  name: string;
  /** selects placeholder gradient (index % 5) */
  index: number;
  /** card click (navigation wired by parent) */
  onSelect: () => void;
  /** confirmed delete */
  onDelete: () => void;
  /** disables overlay + shows loading on "Yes" */
  deleting?: boolean;
}

// Soft pastel gradients for the liquid-glass placeholder, cycled by index % 5.
const placeholderGradients = [
  "linear-gradient(135deg, #87CEEB 0%, #6BB3D9 50%, #5BA3C9 100%)",
  "linear-gradient(135deg, #FFB366 0%, #F5A050 50%, #E8944A 100%)",
  "linear-gradient(135deg, #7DD3C0 0%, #5CC4AC 50%, #4AB89E 100%)",
  "linear-gradient(135deg, #B19CD9 0%, #9F8ACE 50%, #8E79C3 100%)",
  "linear-gradient(135deg, #F5A0B1 0%, #E890A0 50%, #DB8090 100%)",
] as const;

export function ClassroomCard({
  name,
  index,
  onSelect,
  onDelete,
  deleting = false,
}: ClassroomCardProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  const gradient =
    placeholderGradients[index % placeholderGradients.length] ??
    placeholderGradients[0];

  function handleDeleteClick(e: MouseEvent) {
    e.stopPropagation();
    setShowConfirm(true);
  }

  function handleConfirm(e: MouseEvent) {
    e.stopPropagation();
    onDelete();
  }

  function handleCancel(e: MouseEvent) {
    e.stopPropagation();
    setShowConfirm(false);
  }

  return (
    <div className="relative group">
      {/* Delete "x" button — only when not confirming */}
      {!showConfirm && (
        <button
          type="button"
          onClick={handleDeleteClick}
          aria-label={`Delete ${name}`}
          className="absolute -top-2 -right-2 z-20 flex h-7 w-7 items-center justify-center rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          style={{
            background: "rgba(239, 68, 68, 0.9)",
            boxShadow: "0 2px 8px rgba(239, 68, 68, 0.4)",
          }}
        >
          <X className="h-4 w-4 text-white" />
        </button>
      )}

      {/* Inline "Delete?" confirmation overlay — only when confirming */}
      {showConfirm && (
        <div
          className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-3 rounded-[26px]"
          style={{
            background: "rgba(0, 0, 0, 0.7)",
            backdropFilter: "blur(4px)",
          }}
        >
          <span className="px-2 text-center text-xs font-medium text-white">
            Delete?
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleConfirm}
              disabled={deleting}
              className={cn(
                "flex min-w-[44px] items-center justify-center rounded-full bg-red-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-red-600 disabled:opacity-60",
              )}
            >
              {deleting ? <Loader2 className="h-3 w-3 animate-spin" /> : "Yes"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={deleting}
              className="rounded-full bg-white/20 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-white/30 disabled:opacity-60"
            >
              No
            </button>
          </div>
        </div>
      )}

      {/* Card face */}
      <button
        type="button"
        onClick={onSelect}
        className="group flex flex-col items-center gap-4 focus-visible:outline-none"
      >
        <div className="relative">
          {/* Soft glow behind */}
          <div
            className="absolute inset-0 rounded-[28px] opacity-0 blur-xl transition-opacity duration-700 group-hover:opacity-60"
            style={{ background: gradient }}
          />

          {/* Outer liquid-glass frame */}
          <div
            className="relative h-[130px] w-[130px] rounded-[26px] p-[4px] transition-transform duration-300 group-hover:scale-105 focus-visible:ring-2 focus-visible:ring-primary/40"
            style={{
              background:
                "linear-gradient(165deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.4) 25%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.3) 75%, rgba(255,255,255,0.6) 100%)",
              boxShadow:
                "0 20px 40px -10px rgba(0,0,0,0.1), 0 8px 16px -8px rgba(0,0,0,0.08), inset 0 2px 4px rgba(255,255,255,0.9), inset 0 -1px 2px rgba(0,0,0,0.02), 0 1px 0 rgba(255,255,255,0.8)",
              backdropFilter: "blur(8px)",
            }}
          >
            {/* Inner card with gradient-letter placeholder */}
            <div
              className="flex h-full w-full items-center justify-center overflow-hidden rounded-[22px]"
              style={{
                background: gradient,
                boxShadow: "inset 0 2px 8px rgba(0,0,0,0.04)",
              }}
            >
              <span
                className="text-4xl font-medium"
                style={{
                  color: "rgba(255,255,255,0.95)",
                  textShadow: "0 1px 2px rgba(0,0,0,0.1)",
                }}
              >
                {name.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>

          {/* Liquid shine overlay */}
          <div
            className="pointer-events-none absolute inset-0 rounded-[26px]"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.1) 30%, transparent 60%)",
              opacity: 0.8,
            }}
          />
        </div>

        {/* Name label */}
        <span
          className="text-sm font-medium tracking-wide"
          style={{
            color: "rgba(75, 85, 99, 0.9)",
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          {name}
        </span>
      </button>
    </div>
  );
}
