import * as amplitude from "@amplitude/analytics-browser";
// NOTE: `EnrichmentPlugin` / `Event` are re-exported by analytics-browser only
// under its `Types` namespace, not as root named exports — so import the types
// from analytics-core (their canonical origin, a present transitive dep).
import type { EnrichmentPlugin, Event } from "@amplitude/analytics-core";
import { env } from "~/lib/env";

type AnalyticsUser = {
  _id: string;
  organization?: string | null;
  typeObj?: { identifier?: string | null } | null;
  schoolIds?: string[];
};

// Mutable context read by the enrichment plugin so every event is stamped.
let context: {
  organization: string;
  userType: string;
  schools: string[];
  userId: string;
} | null = null;
let initialized = false;

/**
 * Format a Date as `YYYY-MM-DD` in the browser's LOCAL timezone. Deliberately
 * uses the local getters (NOT `toISOString()`, which is UTC) so the calendar
 * day reflects the user's own day — this is what step-2 groups `practice_completed`
 * on to derive per-local-day streaks, and it must stay correct across midnight.
 */
function formatLocalYMD(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function organizationContextPlugin(): EnrichmentPlugin {
  return {
    name: "ie-org-context",
    type: "enrichment",
    async execute(event: Event): Promise<Event> {
      if (context) {
        // Compute localDate per-event (never hoisted/cached) so it reflects the
        // event's own day and stays correct across midnight.
        const eventDate = new Date(event.time ?? Date.now());
        event.event_properties = {
          ...event.event_properties,
          organization: context.organization,
          userType: context.userType,
          schools: context.schools,
          userId: context.userId,
          localDate: formatLocalYMD(eventDate),
          tzOffset: new Date().getTimezoneOffset(),
        };
      }
      return event;
    },
  };
}

/**
 * Initialize Amplitude for a resolved user. No-ops on the server, when no API
 * key is configured, for admins, and after the first successful init.
 */
export function initAnalytics(user: AnalyticsUser): void {
  if (typeof window === "undefined") return; // SSR guard
  if (!env.AMPLITUDE_API_KEY) return; // analytics disabled (no key)
  const role = user.typeObj?.identifier ?? "";
  if (role === "admin") return; // Decision #3: never init for admins
  if (initialized) return; // single init per page load

  const schoolIds = user.schoolIds ?? [];
  context = {
    organization: user.organization ?? "",
    userType: role || "unknown",
    schools: schoolIds,
    userId: user._id,
  };

  // Register enrichment BEFORE init so it applies to all (incl. autocaptured) events.
  amplitude.add(organizationContextPlugin());
  amplitude.init(env.AMPLITUDE_API_KEY, user._id, { autocapture: true });
  amplitude.setGroup("organization", context.organization);
  if (schoolIds.length) amplitude.setGroup("school", schoolIds);
  const id = new amplitude.Identify();
  id.set("organization", context.organization);
  id.set("userType", context.userType);
  id.set("schools", schoolIds);
  amplitude.identify(id);

  initialized = true;
}

/**
 * Emit a `content_played` event carrying the playback duration (integer
 * seconds) of a lesson media segment. No-ops on the server, when no API key is
 * configured, and until `initAnalytics` has run — which (per Decision #3) never
 * happens for admins, so admins never emit this event. `organization`,
 * `userType`, and `schools` are stamped automatically by the enrichment plugin,
 * so they are intentionally NOT duplicated in `props`.
 */
export function trackContentPlayed(props: {
  seconds: number;
  contentId?: string;
  tapType?: string;
}): void {
  if (typeof window === "undefined") return; // SSR guard
  if (!env.AMPLITUDE_API_KEY) return; // analytics disabled (no key)
  if (!initialized) return; // not initialized (covers admins — never init'd)

  const seconds = Math.max(0, Math.round(props.seconds));
  if (seconds <= 0) return; // nothing meaningful to report

  const eventProps: { seconds: number; contentId?: string; tapType?: string } = {
    seconds,
  };
  // Omit (don't set to undefined) per exactOptionalPropertyTypes.
  if (props.contentId) eventProps.contentId = props.contentId;
  if (props.tapType) eventProps.tapType = props.tapType;

  amplitude.track("content_played", eventProps);
}

/**
 * Emit a `practice_completed` event when a learner finishes a practice — i.e.
 * the final media step of the class ends (fired from `recordCompletion` in the
 * lesson route, the same point that records completion in the backend). A
 * "practice" is a class, so `contentId` is the class `_id`.
 *
 * This is the signal behind the district "Active User" metric, defined as a user
 * who logs in AND completes at least one practice. No-ops on the server, when no
 * API key is configured, and until `initAnalytics` has run — which (per Decision
 * #3) never happens for admins, so admins never emit it. `organization`,
 * `userType`, and `schools` are stamped by the enrichment plugin, so they are
 * intentionally NOT duplicated in `props`.
 */
export function trackPracticeCompleted(props: {
  contentId?: string;
  tapType?: string;
}): void {
  if (typeof window === "undefined") return; // SSR guard
  if (!env.AMPLITUDE_API_KEY) return; // analytics disabled (no key)
  if (!initialized) return; // not initialized (covers admins — never init'd)

  const eventProps: { contentId?: string; tapType?: string } = {};
  if (props.contentId) eventProps.contentId = props.contentId;
  if (props.tapType) eventProps.tapType = props.tapType;

  amplitude.track("practice_completed", eventProps);
}
