import { useMemo, useState } from "react";
import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { Pencil, Plus, Search, Trash2, Video } from "lucide-react";
import { Button } from "~/components/ui/button";
import { requireSessionToken } from "~/lib/session.server";
import { env } from "~/lib/env";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireSessionToken(request);
  if (!env.PLATFORM) {
    return {
      error: "Platform is not configured. Please contact your administrator.",
    };
  }
  return { error: null as string | null };
}

interface DummyAchievement {
  id: string;
  title: string;
  awarded_for: string;
  description: string;
  badge_image_url?: string;
  video_url?: string;
}

const DUMMY_ACHIEVEMENTS: DummyAchievement[] = [
  {
    id: "ach-1",
    title: "First Breath",
    awarded_for: "Completing your first breathing exercise",
    description: "Awarded when a learner completes their very first guided breathing practice from start to finish.",
    video_url: "https://example.com/first-breath.mp4",
  },
  {
    id: "ach-2",
    title: "Steady Streak",
    awarded_for: "Practicing 7 days in a row",
    description: "Recognizes consistent daily practice across a full week without a gap.",
  },
  {
    id: "ach-3",
    title: "Mindful Explorer",
    awarded_for: "Trying 5 different practices",
    description: "Granted after experiencing five distinct practice types from any series in the library.",
    video_url: "https://example.com/mindful-explorer.mp4",
  },
  {
    id: "ach-4",
    title: "Quiet Mind",
    awarded_for: "Completing a 10-minute silent sit",
    description: "Earned by finishing a full ten-minute silent meditation without skipping ahead.",
  },
  {
    id: "ach-5",
    title: "Compassion Champion",
    awarded_for: "Finishing the loving-kindness series",
    description: "Recognizes the completion of every practice in the loving-kindness curriculum.",
    video_url: "https://example.com/compassion.mp4",
  },
  {
    id: "ach-6",
    title: "Curious Beginner",
    awarded_for: "Asking a reflection question",
    description: "Awarded when a learner submits their first written reflection or question after a practice.",
  },
];

export default function AdminContentAchievements() {
  const { error } = useLoaderData<typeof loader>();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return DUMMY_ACHIEVEMENTS;
    return DUMMY_ACHIEVEMENTS.filter((a) => a.title.toLowerCase().includes(q));
  }, [query]);

  if (error) {
    return (
      <div className="rounded-xl border-2 border-dashed border-red-200 bg-red-50 py-10 text-center">
        <p className="mb-1 text-sm font-medium text-red-700">
          Couldn't load achievements
        </p>
        <p className="text-xs text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-xl text-foreground">Achievements Library</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Global achievement templates that can be copied to any series
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            console.log("new achievement (stub)");
          }}
        >
          <Plus className="h-4 w-4" />
          New Template
        </Button>
      </div>

      <div className="relative">
        <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search achievements"
          className="w-full h-[44px] pl-9 pr-4 bg-card border border-border rounded-lg text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((a) => (
          <div
            key={a.id}
            className="bg-card border border-border rounded-xl p-4 space-y-3 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-3">
              {a.badge_image_url ? (
                <img
                  src={a.badge_image_url}
                  alt=""
                  className="h-10 w-10 rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex-shrink-0" />
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-stone-900 truncate">{a.title}</p>
                  {a.video_url ? <Video className="h-4 w-4 text-stone-400 flex-shrink-0" /> : null}
                </div>
                <p className="text-xs text-stone-500 truncate">{a.awarded_for}</p>
              </div>
            </div>

            <p className="text-sm text-stone-500 line-clamp-2">{a.description}</p>

            <div className="flex justify-end gap-1">
              <Button
                variant="ghost"
                className="h-8 w-8 px-0 text-[13px]"
                onClick={() => {
                  console.log("edit achievement (stub)", a.id);
                }}
                aria-label="Edit"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                className="h-8 w-8 px-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => {
                  console.log("delete achievement (stub)", a.id);
                }}
                aria-label="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
