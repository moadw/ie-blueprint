import type { ComponentType } from "react";
import {
  Baby,
  GraduationCap,
  BookOpen,
  Trophy,
  Sparkles,
} from "lucide-react";

export interface Experience {
  id: string;
  title: string;
  subtitle: string;
  icon: ComponentType<{ className?: string }>;
}

export const experiences = [
  {
    id: "early-learning",
    title: "Early Learning",
    subtitle: "Pre-K and Kindergarten",
    icon: Baby,
  },
  {
    id: "elementary",
    title: "Elementary",
    subtitle: "Grades 1–5",
    icon: Sparkles,
  },
  {
    id: "middle",
    title: "Middle School",
    subtitle: "Grades 6–8",
    icon: BookOpen,
  },
  {
    id: "high",
    title: "High School",
    subtitle: "Grades 9–12",
    icon: GraduationCap,
  },
  {
    id: "sports",
    title: "Sports",
    subtitle: "Athletics and team programs",
    icon: Trophy,
  },
] as const satisfies readonly Experience[];

export type ExperienceId = (typeof experiences)[number]["id"];

export const experienceIds = experiences.map((e) => e.id) as [
  ExperienceId,
  ...ExperienceId[],
];
