import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { Mail, Phone } from "lucide-react";

import { gqlClient } from "~/lib/graphql";
import { safe } from "~/lib/safe-loader";
import { requireSessionToken } from "~/lib/session.server";
import { UsersFindOneDocument } from "~/queries/users";
import { SectionHeader } from "~/routes/settings/_components/section-header";
import { profileFixture } from "~/routes/settings/_fixtures";

export async function loader({ request }: LoaderFunctionArgs) {
  const token = await requireSessionToken(request);
  // Load the logged-in teacher's email ("me" — the token resolves the current
  // user when `_id` is omitted). `safe` keeps a backend 500 from white-screening
  // the settings modal; a miss degrades to an em dash in the UI.
  const result = await safe(
    gqlClient.request(UsersFindOneDocument, {}, { "access-token": token }),
  );
  const email = result.ok ? (result.data.UsersFindOne?.email ?? null) : null;
  return { email };
}

export default function SettingsProfileRoute() {
  const { email } = useLoaderData<typeof loader>();
  const profile = profileFixture;
  const initial = profile.displayName.charAt(0).toUpperCase();

  return (
    <div className="max-w-2xl">
      <SectionHeader
        title="Manage Profile"
        subtitle="View your account information."
      />

      <div className="space-y-6">
        {/* Profile Header */}
        <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-[24px]">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-border">
            <span className="text-xl font-medium text-muted-foreground">
              {initial}
            </span>
          </div>
          <div>
            <p className="font-medium text-foreground text-lg">
              {profile.displayName}
            </p>
            <p className="text-sm text-muted-foreground">
              Member since {profile.memberSince}
            </p>
          </div>
        </div>

        {/* Basic Information */}
        <div className="bg-muted/30 rounded-[24px] p-6">
          <h3 className="text-sm font-semibold text-foreground mb-5 flex items-center gap-2">
            <Mail className="w-4 h-4 text-muted-foreground" />
            Basic Information
          </h3>

          <div className="space-y-5">
            {/* Email */}
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wide">
                Email
              </label>
              <p className="text-foreground mt-1 font-medium">{email ?? "—"}</p>
            </div>

            {/* Phone Number */}
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                <Phone className="w-3 h-3" />
                Phone Number
              </label>
              <p className="text-muted-foreground mt-1 italic">
                {profile.phone}
              </p>
            </div>
          </div>
        </div>

        {/* Account Status */}
        <div className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/20 rounded-xl">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm text-foreground">
            Account active •{" "}
            {profile.hasPremiumAccess ? "Premium access enabled" : "Trial access"}
          </span>
        </div>
      </div>
    </div>
  );
}
