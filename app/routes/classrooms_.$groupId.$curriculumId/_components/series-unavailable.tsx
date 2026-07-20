type SeriesUnavailableProps = {
  variant: "hero" | "section";
};

// Shown in place of the slider (hero) and the lesson grid (section) when a
// curriculum is `active === false`. The two variants mirror the existing
// "No practices…" empty-state typography so the unavailable copy reads as the
// same treatment rather than a new one.
export function SeriesUnavailable({ variant }: SeriesUnavailableProps) {
  if (variant === "hero") {
    return (
      <div className="flex flex-1 items-center justify-center px-6 text-center">
        <p className="font-serif text-xl text-white/70">
          This series is currently unavailable.
        </p>
      </div>
    );
  }

  return (
    <p className="font-serif text-base text-zinc-400">
      This series is currently unavailable.
    </p>
  );
}
