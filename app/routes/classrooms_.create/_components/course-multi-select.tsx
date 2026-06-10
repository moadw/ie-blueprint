import { BookOpen } from "lucide-react";
import { OptionCard } from "~/components/ui/option-card";

export function CourseMultiSelect({
  courses,
  selected,
  onToggle,
}: {
  courses: Array<{ _id: string; title: string; coverUrl: string | null }>;
  selected: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {courses.map((course) => (
        <OptionCard
          key={course._id}
          tone="success"
          icon={
            course.coverUrl ? (
              <img
                src={course.coverUrl}
                alt=""
                className="w-6 h-6 rounded-[6px] object-cover"
              />
            ) : (
              <BookOpen className="w-6 h-6" />
            )
          }
          title={course.title}
          selected={selected.includes(course._id)}
          onSelect={() => onToggle(course._id)}
        />
      ))}
    </div>
  );
}
