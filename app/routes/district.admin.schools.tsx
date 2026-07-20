import { useLoaderData, useNavigation } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { Loader2 } from "lucide-react";
import { env } from "~/lib/env";
import { gqlClient } from "~/lib/graphql";
import { resolveDistrictAdmin } from "~/lib/district-admin.server";
import { safe } from "~/lib/safe-loader";
import { MyOrganizationFindOneDocument } from "~/queries/organization";
import { SchoolFindManyDocument } from "~/queries/schools";
import { DistrictInviteCard } from "~/routes/district.admin/_components/district-invite-card";
import { DistrictSchoolsGrid } from "~/routes/district.admin/_components/district-schools-grid";

type SchoolOption = {
  _id: string;
  name?: string | null;
  city?: string | null;
  state?: string | null;
  deletedAt?: string | null;
};
type OrganizationInvite = { code: string | null; name: string | null };

export async function loader({ request }: LoaderFunctionArgs) {
  const result = await resolveDistrictAdmin(request);
  if (result.loadError || !result.district) {
    return {
      district: null,
      schools: [] as SchoolOption[],
      organization: null as OrganizationInvite | null,
      organizationError: null as string | null,
      previewHidden: result.preview,
      loadError: result.loadError ?? "Could not resolve district.",
      preview: result.preview,
    };
  }

  const { token, district, preview } = result;

  const schoolsResult = await safe(
    gqlClient.request(
      SchoolFindManyDocument,
      { filter: { district: district._id, platform: env.PLATFORM }, limit: 500 },
      { "access-token": token },
    ),
  );

  const schools: SchoolOption[] = schoolsResult.ok
    ? (schoolsResult.data.SchoolFindMany ?? []).filter(
        (s): s is NonNullable<typeof s> => s != null,
      )
    : [];

  // Master-admin district preview: `MyOrganizationFindOne` takes no arguments and
  // scopes to the *session user's* organization (the master admin), NOT the
  // previewed district. So skip the query and hide the invite section entirely
  // in preview — a foreign/own org code would be misleading here.
  if (preview) {
    return {
      district,
      schools,
      organization: null as OrganizationInvite | null,
      organizationError: null as string | null,
      previewHidden: true,
      loadError: schoolsResult.error,
      preview,
    };
  }

  const orgResult = await safe(
    gqlClient.request(MyOrganizationFindOneDocument, {}, { "access-token": token }),
  );
  const org = orgResult.ok ? orgResult.data.MyOrganizationFindOne : null;
  const organization: OrganizationInvite | null = org
    ? { code: org.code ?? null, name: org.name ?? null }
    : null;

  return {
    district,
    schools,
    organization,
    organizationError: orgResult.ok ? null : orgResult.error,
    previewHidden: false,
    loadError: schoolsResult.error,
    preview,
  };
}

export default function DistrictAdminSchoolsRoute() {
  const { district, schools, organization, organizationError, loadError, preview } =
    useLoaderData<typeof loader>();
  const navigation = useNavigation();

  const isInitialLoading =
    navigation.state === "loading" && schools.length === 0;

  return (
    <div className="space-y-6">
      {isInitialLoading ? (
        <div className="flex justify-center py-12">
          <Loader2
            className="w-6 h-6 animate-spin text-muted-foreground"
            aria-hidden="true"
          />
        </div>
      ) : loadError ? (
        <div className="rounded-xl border-2 border-dashed border-red-200 bg-red-50 py-10 text-center">
          <p className="mb-1 text-sm font-medium text-red-700">
            Couldn't load schools
          </p>
          <p className="text-xs text-red-600">{loadError}</p>
        </div>
      ) : (
        <>
          {district ? (
            <DistrictInviteCard
              organization={organization}
              error={organizationError}
              readOnly={preview}
            />
          ) : null}
          <DistrictSchoolsGrid schools={schools} />
        </>
      )}
    </div>
  );
}
