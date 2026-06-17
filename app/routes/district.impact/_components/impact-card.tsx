import { BookOpen, MessageSquare, Quote, Trophy } from "lucide-react";
import { StarRating } from "./star-rating";
import type { ImpactStory } from "~/lib/district-impact.server";

interface ImpactCardProps {
  story: ImpactStory;
  index: number;
}

function Avatar({ name }: { name: string }) {
  const initial = name.trim().charAt(0).toUpperCase() || "?";
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
      {initial}
    </div>
  );
}

function SchoolLabel({ school }: { school: string | null }) {
  if (!school) return null;
  return (
    <p className="mt-4 text-[10px] uppercase tracking-widest text-muted-foreground/50">
      {school}
    </p>
  );
}

function TestimonialContent({ story }: { story: ImpactStory }) {
  return (
    <div className="relative p-7">
      <Quote className="pointer-events-none absolute right-6 top-6 h-14 w-14 text-muted-foreground/[0.05]" />
      {story.body ? (
        <p className="relative font-display text-[15px] leading-[1.7] text-foreground/85">
          {story.body}
        </p>
      ) : null}
      {story.authorName ? (
        <div className="mt-6 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">
              {story.authorName}
            </p>
            {story.authorRole ? (
              <p className="text-xs text-muted-foreground">{story.authorRole}</p>
            ) : null}
          </div>
          <Avatar name={story.authorName} />
        </div>
      ) : null}
      <SchoolLabel school={story.schoolName} />
    </div>
  );
}

function JournalContent({ story }: { story: ImpactStory }) {
  return (
    <div className="p-7">
      <div className="mb-2.5 flex items-center gap-1.5 text-muted-foreground/50">
        <BookOpen className="h-3.5 w-3.5" />
        <span className="text-[11px] font-medium uppercase tracking-wider">
          Journal Reflection
        </span>
      </div>
      {story.title ? (
        <h3 className="mb-2.5 font-display text-xl text-foreground">
          {story.title}
        </h3>
      ) : null}
      {story.body ? (
        <p className="text-sm leading-relaxed text-foreground/75">{story.body}</p>
      ) : null}
      {story.authorName ? (
        <p className="mt-4 text-xs text-muted-foreground">— {story.authorName}</p>
      ) : null}
      <SchoolLabel school={story.schoolName} />
    </div>
  );
}

function PhotoContent({ story }: { story: ImpactStory }) {
  if (!story.imageUrl) return null;
  return (
    <img
      src={story.imageUrl}
      alt=""
      loading="lazy"
      className="block w-full object-cover"
    />
  );
}

function MilestoneContent({ story }: { story: ImpactStory }) {
  return (
    <div className="p-7">
      <div className="mb-2 flex items-center gap-1.5 text-muted-foreground/40">
        <Trophy className="h-4 w-4" />
        <span className="text-[11px] font-medium uppercase tracking-wider">
          Milestone
        </span>
      </div>
      {story.title ? (
        <h3 className="mb-1.5 font-display text-2xl text-foreground">
          {story.title}
        </h3>
      ) : null}
      {story.body ? (
        <p className="text-sm leading-relaxed text-foreground/70">{story.body}</p>
      ) : null}
      <SchoolLabel school={story.schoolName} />
    </div>
  );
}

function FeedbackContent({ story }: { story: ImpactStory }) {
  return (
    <div className="p-7">
      <div className="mb-3 flex items-center gap-1.5 text-muted-foreground/50">
        <MessageSquare className="h-3.5 w-3.5" />
        <span className="text-[11px] font-medium uppercase tracking-wider">
          Practice Feedback
        </span>
      </div>
      {story.body ? (
        <p className="mb-4 text-sm leading-relaxed text-foreground/80">
          {story.body}
        </p>
      ) : null}
      {story.rating ? <StarRating rating={story.rating} /> : null}
      {story.authorName ? (
        <p className="mt-4 text-xs text-muted-foreground">— {story.authorName}</p>
      ) : null}
      <SchoolLabel school={story.schoolName} />
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
      {story.isSample ? (
        <span className="absolute right-3 top-3 z-10 rounded-full bg-muted/70 px-2 py-0.5 text-[10px] font-medium text-muted-foreground/70 backdrop-blur-sm">
          Sample
        </span>
      ) : null}
      <StoryContent story={story} />
    </article>
  );
}

export default ImpactCard;
