export interface Profile {
  /** Display name shown in the profile header. */
  displayName: string;
  /** Pre-formatted "member since" date string (no date-fns). */
  memberSince: string;
  email: string;
  /** e.g. "(+1) USA". */
  country: string;
  /** e.g. "Not provided". */
  phone: string;
  /** Pre-formatted subscription start date string. */
  subscriptionStart: string;
  /**
   * Pre-formatted subscription end date string. Omit entirely when the
   * subscription has no expiration (rendered as "No expiration").
   */
  subscriptionEnd?: string;
  subscriptionType: "Premium" | "Community";
  adminEmail: string;
  hasPremiumAccess: boolean;
}

export const profileFixture: Profile = {
  displayName: "Jordan Rivers",
  memberSince: "2024-09-01",
  email: "jordan.rivers@example.com",
  country: "(+1) USA",
  phone: "Not provided",
  subscriptionStart: "2024-09-01",
  subscriptionType: "Premium",
  adminEmail: "admin@example.com",
  hasPremiumAccess: true,
};

export interface JournalEntry {
  id: string;
  /** Pre-formatted date string, e.g. "Jun 10, 2026" (no date-fns). */
  date: string;
  /** Optional practice title shown as the card heading. */
  title?: string;
  /** Optional reflection prompt, rendered italic + quoted. */
  prompt?: string;
  /** Plain-text body (NOT html). Long enough to exercise expand/collapse. */
  content: string;
  /** Optional small cover thumbnail for the card's left edge. */
  coverImageUrl?: string;
  /** Optional attached image shown only in the expanded state. */
  imageUrl?: string;
}

export const journalsFixture: JournalEntry[] = [
  {
    id: "1",
    date: "Jun 10, 2026",
    title: "Morning Breath Awareness",
    prompt: "What did you notice as you settled into stillness?",
    content:
      "I noticed how quickly my mind wanted to plan the day before I had even taken a single conscious breath. As I followed the rhythm of inhaling and exhaling, the urgency softened. By the end of the practice my shoulders had dropped and the racing thoughts felt further away, like background noise instead of demands. I want to carry this steadiness into the classroom this morning.",
    coverImageUrl:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&q=80",
  },
  {
    id: "2",
    date: "Jun 8, 2026",
    title: "Body Scan Reflection",
    content:
      "Short entry today. Tension in my jaw that I hadn't noticed until I slowed down. Releasing it felt surprisingly emotional.",
    imageUrl:
      "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&q=80",
  },
  {
    id: "3",
    date: "Jun 5, 2026",
    prompt: "Where did you find a moment of gratitude today?",
    content:
      "No assigned practice this time, just a few minutes of quiet before lunch. I found gratitude in the simplest place: a student who said thank you on the way out the door. It reminded me why the small, consistent practices matter, both for them and for me. I felt lighter afterward and more present for the rest of the afternoon.",
  },
];

// `Stats` / `statsFixture` were removed once `/settings/stats` moved to a real
// Amplitude-backed loader (see `settings.stats.tsx` + `app/lib/stats.server.ts`).
