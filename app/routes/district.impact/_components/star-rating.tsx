import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number; // 1-5
}

export function StarRating({ rating }: StarRatingProps) {
  return (
    <div className="flex gap-0.5" aria-label={`Rating: ${rating} out of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={
            i < rating
              ? "h-3.5 w-3.5 text-amber-400 fill-amber-400"
              : "h-3.5 w-3.5 text-muted-foreground/20"
          }
        />
      ))}
    </div>
  );
}

export default StarRating;
