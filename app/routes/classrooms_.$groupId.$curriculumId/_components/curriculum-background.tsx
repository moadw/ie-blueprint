interface CurriculumBackgroundProps {
  imageUrl: string | null | undefined;
}

/**
 * Blurred curriculum-cover background fading to a dark solid.
 *
 * Ported from the prototype's `CrossfadeBackground` + the parent layout's
 * overlay gradients (research §2). The curriculum changes via a full route
 * navigation here, so there is no in-place crossfade — a single blurred
 * layer is enough. Layer recipe is copied verbatim:
 * `blur(25px) saturate(1.1)` + `scale(1.15)`.
 */
export function CurriculumBackground({ imageUrl }: CurriculumBackgroundProps) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-zinc-900">
      {imageUrl ? (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(25px) saturate(1.1)",
            transform: "scale(1.15)",
          }}
        />
      ) : null}

      {/* Bottom fade to the solid page background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-zinc-900" />

      {/* Top contrast gradient — keeps the header/title legible */}
      <div
        className="pointer-events-none absolute left-0 right-0 top-0"
        style={{
          height: "120px",
          background:
            "linear-gradient(180deg, rgba(10, 15, 30, 0.45) 0%, rgba(10, 15, 30, 0.18) 55%, transparent 100%)",
        }}
      />
    </div>
  );
}
