/**
 * Right-column explainer card for the create-classroom onboarding flow.
 * Glass recipe mirrors the prototype: white-translucent gradient + light white
 * border + soft shadow + backdrop blur. Title is Instrument Serif (`font-serif`),
 * body is the default sans. Radius 24px = the prototype's `rounded-2xl`.
 */
export function ClassroomInfoCard() {
  return (
    <div
      className="w-full rounded-[24px] border border-white/50 bg-gradient-to-br from-white/80 to-white/60 px-6 py-5 backdrop-blur-xl"
      style={{
        boxShadow:
          "0 8px 32px -8px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)",
      }}
    >
      <h3 className="mb-2 font-serif text-lg font-medium text-foreground">
        What is a Classroom?
      </h3>
      <p className="text-sm leading-relaxed text-muted-foreground">
        Create a classroom for each group you teach. Each has its own progress
        tracking, analytics, and preferences. Add more anytime and switch
        languages whenever you need.
      </p>
    </div>
  );
}
