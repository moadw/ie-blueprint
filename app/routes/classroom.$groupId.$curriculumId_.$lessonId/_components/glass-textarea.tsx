import type { TextareaHTMLAttributes } from "react";

type GlassTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

/**
 * Glass-styled textarea for the feedback overlay. Rebuilt from the prototype's
 * `GlassTextarea` (visual reference only): a translucent gradient body with an
 * inset highlight and a thin top sheen.
 */
export function GlassTextarea(props: GlassTextareaProps) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl"
      style={{
        background:
          "linear-gradient(145deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 100%)",
        border: "1px solid rgba(255,255,255,0.25)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.2), 0 4px 20px rgba(0,0,0,0.1)",
      }}
    >
      <textarea
        {...props}
        className="min-h-[120px] w-full resize-none bg-transparent px-5 py-4 font-sans text-base leading-relaxed text-white placeholder:text-white/50 focus:outline-none focus:ring-0"
      />
      <div
        className="pointer-events-none absolute left-0 right-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
        }}
      />
    </div>
  );
}
