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
};

// Mutable context read by the enrichment plugin so every event is stamped.
let context: { organization: string; userType: string } | null = null;
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

  context = { organization: user.organization ?? "", userType: role || "unknown" };

  // Register enrichment BEFORE init so it applies to all (incl. autocaptured) events.
  amplitude.add(organizationContextPlugin());
  amplitude.init(env.AMPLITUDE_API_KEY, user._id, { autocapture: true });
  amplitude.setGroup("organization", context.organization);
  const id = new amplitude.Identify();
  id.set("organization", context.organization);
  id.set("userType", context.userType);
  amplitude.identify(id);

  initialized = true;
}
