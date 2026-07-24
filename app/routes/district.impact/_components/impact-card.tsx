import { BookOpen, MessageSquare, Quote, Trophy } from "lucide-react";
import { StarRating } from "./star-rating";
import type { ImpactStory } from "~/lib/district-impact.server";

interface ImpactCardProps {
  story: ImpactStory;
  index: number;
}

function Avatar({ name, className }: { name: string; className?: string }) {
  const initial = name.trim().charAt(0).toUpperCase() || "?";
  return (
    <div
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-xs text-muted-foreground ${className ?? ""}`}
    >
      {initial}
    </div>
  );
}

function TestimonialContent({ story }: { story: ImpactStory }) {
  return (
    <div className="p-7 relative">
      <Quote
        className="absolute top-5 right-5 h-14 w-14 text-muted-foreground/[0.05]"
        strokeWidth={1}
      />
      {story.body ? (
        <p className="font-display text-[15px] leading-[1.7] text-foreground/85 mb-6 relative z-[1]">
          &ldquo;{story.body}&rdquo;
        </p>
      ) : null}
      {story.authorName ? (
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">
              {story.authorName}
            </p>
            {story.authorRole ? (
              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                {story.authorRole}
              </p>
            ) : null}
          </div>
          <Avatar name={story.authorName} className="ml-4" />
        </div>
      ) : null}
      {story.schoolName ? (
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground/50 mt-4">
          {story.schoolName}
        </p>
      ) : null}
    </div>
  );
}

function JournalContent({ story }: { story: ImpactStory }) {
  return (
    <div className="p-7">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="h-3.5 w-3.5 text-muted-foreground/50" />
        <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground/60">
          Journal Reflection
        </span>
      </div>
      {story.title ? (
        <h4 className="font-display text-base font-semibold text-foreground mb-2.5">
          {story.title}
        </h4>
      ) : null}
      {story.body ? (
        <p className="text-sm leading-relaxed text-foreground/75">{story.body}</p>
      ) : null}
      {story.authorName ? (
        <p className="text-xs text-muted-foreground mt-4">— {story.authorName}</p>
      ) : null}
      {story.schoolName ? (
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground/50 mt-2">
          {story.schoolName}
        </p>
      ) : null}
    </div>
  );
}

function PhotoContent({ story }: { story: ImpactStory }) {
  if (!story.imageUrl) return null;
  return (
    <img
      src={story.imageUrl}
      alt="Impact photo"
      loading="lazy"
      className="block w-full object-cover"
    />
  );
}

function MilestoneContent({ story }: { story: ImpactStory }) {
  return (
    <div className="p-7">
      <div className="flex items-center gap-2.5 mb-4">
        <Trophy
          className="h-4 w-4 text-muted-foreground/40"
          strokeWidth={1.5}
        />
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
          Milestone
        </span>
      </div>
      {story.title ? (
        <h4 className="font-display text-lg font-bold text-foreground mb-1.5">
          {story.title}
        </h4>
      ) : null}
      {story.body ? (
        <p className="text-sm text-foreground/70 leading-relaxed">{story.body}</p>
      ) : null}
      {story.schoolName ? (
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground/50 mt-4">
          {story.schoolName}
        </p>
      ) : null}
    </div>
  );
}

function FeedbackContent({ story }: { story: ImpactStory }) {
  return (
    <div className="p-7">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="h-3.5 w-3.5 text-muted-foreground/50" />
        <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground/60">
          Practice Feedback
        </span>
      </div>
      {story.body ? (
        <p className="text-sm leading-relaxed text-foreground/80 mb-4">
          &ldquo;{story.body}&rdquo;
        </p>
      ) : null}
      <StarRating rating={story.rating ?? 5} />
      {story.authorName ? (
        <p className="text-xs text-muted-foreground mt-3">— {story.authorName}</p>
      ) : null}
      {story.schoolName ? (
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground/50 mt-1.5">
          {story.schoolName}
        </p>
      ) : null}
    </div>
  );
}

function StoryContent({ story }: { story: ImpactStory }) {
  switch (story.type) {
    case "testimonial":
      return <TestimonialContent story={story} />;
    case "photo":
      return <PhotoContent story={story} />;
    case "milestone":
      return <MilestoneContent story={story} />;
    case "feedback":
      return <FeedbackContent story={story} />;
    case "journal":
    default:
      return <JournalContent story={story} />;
  }
}

export function ImpactCard({ story, index }: ImpactCardProps) {
  // Delay del fade-up acotado para que columnas largas no tarden de más.
  const delayMs = Math.min(index, 12) * 60;

  return (
    <article
      className="impact-card-enter relative mb-4 break-inside-avoid overflow-hidden rounded-2xl border border-border bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
      style={{ animationDelay: `${delayMs}ms` }}
    >
      <StoryContent story={story} />
    </article>
  );
}

export default ImpactCard;
