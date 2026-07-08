import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { Building2, Mail } from "lucide-react";

import { gqlClient } from "~/lib/graphql";
import { safe } from "~/lib/safe-loader";
import { requireSessionToken } from "~/lib/session.server";
import { getUserDisplayName, getUserInitials } from "~/lib/user";
import { UsersFindOneDocument } from "~/queries/users";
import { DistrictFindManyDocument } from "~/queries/districts";
import { SectionHeader } from "~/routes/settings/_components/section-header";

export async function loader({ request }: LoaderFunctionArgs) {
  const token = await requireSessionToken(request);
  // "me" — the token resolves the current user when `_id` is omitted. `safe`
  // keeps a backend 500 from white-screening the settings modal; a miss
  // degrades to an em dash / hidden section in the UI.
  const userResult = await safe(
    gqlClient.request(UsersFindOneDocument, {}, { "access-token": token }),
  );
  const user = userResult.ok ? (userResult.data.UsersFindOne ?? null) : null;

  // Resolve the district by the user's organization — the same path the
  // district portal uses (`district.tsx`). NOTE: `UserDistrictFindOne` is a
  // school-user resolver that throws "School user not found" for district
  // admins, so we go org → DistrictFindMany (which already selects
  // `licenseLabel`) and take the first match.
  const organization = user?.organization ?? null;
  const districtResult = organization
    ? await safe(
        gqlClient.request(
          DistrictFindManyDocument,
          { filter: { organization }, limit: 1 },
          { "access-token": token },
        ),
      )
    : null;
  const district =
    districtResult && districtResult.ok
      ? (districtResult.data.DistrictFindMany?.[0] ?? null)
      : null;

  return { user, district };
}

export default function SettingsProfileRoute() {
  const { user, district } = useLoaderData<typeof loader>();

  const name = getUserDisplayName(user);
  const initials = getUserInitials(user);
  const photo = user?.profilePicture?.url;
  const email = user?.email;

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
            {photo ? (
              <img
                src={photo}
                alt=""
                className="h-full w-full object-cover"
                draggable={false}
              />
            ) : (
              <span className="text-xl font-medium text-muted-foreground">
                {initials}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-foreground text-lg truncate">
              {name}
            </p>
            {email ? (
              <p className="text-sm text-muted-foreground truncate">{email}</p>
            ) : null}
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
          </div>
        </div>

        {/* District — only shown when the current user belongs to a district */}
        {district ? (
          <div className="bg-muted/30 rounded-[24px] p-6">
            <h3 className="text-sm font-semibold text-foreground mb-5 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-muted-foreground" />
              District
            </h3>

            <div className="space-y-5">
              {/* District name */}
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wide">
                  District
                </label>
                <p className="text-foreground mt-1 font-medium">
                  {district.name ?? "—"}
                </p>
              </div>

              {/* License label */}
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wide">
                  License
                </label>
                <p className="text-foreground mt-1 font-medium">
                  {district.licenseLabel ?? "—"}
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
