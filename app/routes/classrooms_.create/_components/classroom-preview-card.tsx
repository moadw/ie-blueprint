import { useRef, useState } from "react";
import type { MouseEvent } from "react";

export interface ClassroomPreviewCardProps {
  name: string;
  studentCount: number;
}

/**
 * "Your Classroom" live-preview card for the create-classroom flow. Rebuilt
 * from the prototype (visual reference only): a green domed arch, the serif
 * classroom name, and a student-count pill, inside a glass card that tilts in
 * 3D toward the cursor on hover.
 *
 * The prototype used framer-motion springs; we replicate the tilt with plain
 * React state + a CSS `transition-transform` (no new dependency). Mouse
 * position is normalized to [-0.5, 0.5] and mapped to ±8° rotation, matching
 * the prototype's `useTransform([-0.5, 0.5], [8, -8])`.
 */
export function ClassroomPreviewCard({
  name,
  studentCount,
}: ClassroomPreviewCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [shimmer, setShimmer] = useState({ x: 50, y: 50 });
  const [hovering, setHovering] = useState(false);

  const trimmed = name.trim();
  const displayName = trimmed.length > 0 ? trimmed : "Your Classroom";
  const label = studentCount === 1 ? "Student" : "Students";

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const nx = (e.clientX - (rect.left + rect.width / 2)) / rect.width; // -0.5..0.5
    const ny = (e.clientY - (rect.top + rect.height / 2)) / rect.height;
    setTilt({ rx: ny * -8, ry: nx * 8 });
    setShimmer({ x: 50 + nx * 60, y: 50 + ny * 60 }); // ~20..80%
  }

  function handleMouseLeave() {
    setHovering(false);
    setTilt({ rx: 0, ry: 0 });
  }

  return (
    <div className="w-full" style={{ perspective: "1000px" }}>
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={handleMouseLeave}
        className="relative w-full cursor-pointer transition-transform duration-200 ease-out [transform-style:preserve-3d]"
        style={{
          transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(${
            hovering ? 1.02 : 1
          })`,
        }}
      >
        {/* Green glow behind the card */}
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-[32px] blur-3xl"
          style={{
            background:
              "radial-gradient(ellipse at 50% 60%, hsla(150,50%,45%,0.25) 0%, transparent 70%)",
            transform: "scale(1.2) translateY(10px)",
          }}
        />

        {/* Card body */}
        <div
          className="relative overflow-hidden rounded-[32px] backdrop-blur-sm"
          style={{
            background: "rgba(255,255,255,0.7)",
            border: "1px solid hsla(150, 40%, 50%, 0.3)",
            boxShadow: hovering
              ? "0 30px 60px -15px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)"
              : "0 15px 40px -10px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.9)",
          }}
        >
          {/* Cursor-following shimmer */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-20 rounded-[32px] transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle at ${shimmer.x}% ${shimmer.y}%, rgba(255,255,255,0.4) 0%, transparent 50%)`,
              opacity: hovering ? 1 : 0,
            }}
          />

          {/* Green domed arch */}
          <div className="relative mx-5 mt-5 h-[200px] overflow-hidden rounded-t-full rounded-b-none">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(160deg, hsl(145 55% 50%) 0%, hsl(165 50% 40%) 50%, hsl(140 45% 35%) 100%)",
              }}
            />
            {/* Grain texture */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-40 mix-blend-overlay"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
              }}
            />
            {/* Inner top glow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-20"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.15) 0%, transparent 50%)",
              }}
            />
          </div>

          {/* Name + student-count pill */}
          <div className="p-6">
            <h2 className="mb-1 truncate font-serif text-[28px] leading-tight text-foreground">
              {displayName}
            </h2>
            <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-[13px] font-medium text-emerald-700">
              {studentCount} {label}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
