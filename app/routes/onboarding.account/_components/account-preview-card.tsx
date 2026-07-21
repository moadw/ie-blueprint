/**
 * Right-column live-preview for the /onboarding/account flow: a simple profile
 * card echoing the entered name plus the (non-editable) "Educator" role badge.
 *
 * The prototype (`UserProfileCard`) wraps this in a framer-motion 3D-tilt +
 * shimmer treatment; per CLAUDE.md ("animations default to none") we ship the
 * static glass card only — the arch header, name, and role badge — without the
 * mouse-driven motion.
 */
export interface AccountPreviewCardProps {
  name: string;
}

export function AccountPreviewCard({ name }: AccountPreviewCardProps) {
  const displayName = name.trim() || "Your Name";
  return (
    <div className="w-[340px] overflow-hidden rounded-[32px] border border-primary/20 bg-white/70 shadow-lg backdrop-blur-sm">
      {/* Arch header — glass gradient, matches the prototype's rounded-top shape. */}
      <div className="relative mx-5 mt-5 h-[200px] overflow-hidden rounded-t-full bg-gradient-to-b from-primary/40 via-primary/35 to-primary/25">
        <div className="pointer-events-none absolute inset-[1px] rounded-t-full border border-white/30" />
      </div>

      <div className="p-6">
        <h2 className="mb-2 truncate font-serif text-[28px] leading-tight text-foreground">
          {displayName}
        </h2>
        <span className="inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-[13px] font-medium text-primary">
          Educator
        </span>
      </div>
    </div>
  );
}
