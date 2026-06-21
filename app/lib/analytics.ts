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
let context: { organization: string; userType: string; schools: string[] } | null = null;
let initialized = false;

function organizationContextPlugin(): EnrichmentPlugin {
  return {
    name: "ie-org-context",
    type: "enrichment",
    async execute(event: Event): Promise<Event> {
      if (context) {
        event.event_properties = {
          ...event.event_properties,
          organization: context.organization,
          userType: context.userType,
          schools: context.schools,
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
