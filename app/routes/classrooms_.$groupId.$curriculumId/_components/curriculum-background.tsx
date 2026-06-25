import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

interface CurriculumBackgroundProps {
  imageUrl: string | null | undefined;
}

// Blurred-cover layer recipe, copied verbatim from the prototype's
// `CrossfadeBackground`: heavy blur + slight saturate, scaled up to hide the
// blur's transparent edges.
function layerStyle(url: string): CSSProperties {
  return {
    backgroundImage: `url(${url})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    filter: "blur(25px) saturate(1.1)",
    transform: "scale(1.15)",
    willChange: "opacity",
  };
}

// Crossfade duration — matches the prototype's ambient 4.5s ease so the
// background morphs gently as the carousel slides rather than snapping.
const CROSSFADE_MS = 4500;

/**
 * Blurred hero background that crossfades to the centered practice's cover as
 * the carousel slides (the parent drives `imageUrl` off the slider's current
 * card), falling back to the curriculum's static image. Ported from the
 * prototype's `CrossfadeBackground` + the layout's overlay gradients: two
 * stacked layers opacity-toggle on every `imageUrl` change, the incoming image
 * preloaded first so the fade reveals a ready frame, never a blank one.
 */
export function CurriculumBackground({ imageUrl }: CurriculumBackgroundProps) {
  const initial = imageUrl ?? null;
  const [layers, setLayers] = useState<{
    previous: string | null;
    current: string | null;
  }>({ previous: null, current: initial });
  // `true` → the `current` layer is shown; flipping it drives the crossfade.
  const [showCurrent, setShowCurrent] = useState(true);
  const currentUrlRef = useRef(initial);

  useEffect(() => {
    const next = imageUrl ?? null;
    if (next === currentUrlRef.current) return;
    const prev = currentUrlRef.current;
    currentUrlRef.current = next;

    // Stack the new image under the old (still visible), then fade across on
    // the next frames so the browser paints the start state before animating.
    const swap = () => {
      setLayers({ previous: prev, current: next });
      setShowCurrent(false);
      requestAnimationFrame(() =>
        requestAnimationFrame(() => setShowCurrent(true)),
      );
    };

    if (next) {
      const img = new Image();
      img.onload = swap;
      img.onerror = swap;
      img.src = next;
      return;
    }
    swap();
  }, [imageUrl]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-zinc-900">
      {layers.previous ? (
        <div
          className="absolute inset-0 transition-opacity ease-in-out"
          style={{
            ...layerStyle(layers.previous),
            opacity: showCurrent ? 0 : 1,
            transitionDuration: `${CROSSFADE_MS}ms`,
          }}
        />
      ) : null}
      {layers.current ? (
        <div
          className="absolute inset-0 transition-opacity ease-in-out"
          style={{
            ...layerStyle(layers.current),
            opacity: showCurrent ? 1 : 0,
            transitionDuration: `${CROSSFADE_MS}ms`,
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
