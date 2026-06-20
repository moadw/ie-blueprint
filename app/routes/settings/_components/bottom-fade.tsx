export function BottomFade() {
  return (
    <div
      className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
      style={{
        background:
          "linear-gradient(to top, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.8) 40%, rgba(255, 255, 255, 0) 100%)",
        backdropFilter: "blur(1px)",
        WebkitBackdropFilter: "blur(1px)",
        maskImage:
          "linear-gradient(to top, black 0%, black 50%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to top, black 0%, black 50%, transparent 100%)",
      }}
    />
  );
}
