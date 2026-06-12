import { useLoaderData, useNavigation } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { Loader2 } from "lucide-react";
import { env } from "~/lib/env";
import { gqlClient } from "~/lib/graphql";
import { resolveDistrictAdmin } from "~/lib/district-admin.server";
import { safe } from "~/lib/safe-loader";
import { SchoolCodeFindManyDocument } from "~/queries/school-codes";
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
type InviteOption = { _id: string; code: string };

export async function loader({ request }: LoaderFunctionArgs) {
  const result = await resolveDistrictAdmin(request);
  if (result.loadError || !result.district) {
    return {
      district: null,
      schools: [] as SchoolOption[],
      invite: null as InviteOption | null,
      loadError: result.loadError ?? "Could not resolve district.",
    };
  }

  const { token, district } = result;

  const [schoolsResult, schoolCodesResult] = await Promise.all([
    safe(
      gqlClient.request(
        SchoolFindManyDocument,
        { filter: { district: district._id, platform: env.PLATFORM }, limit: 500 },
        { "access-token": token },
      ),
    ),
    safe(
      gqlClient.request(
        SchoolCodeFindManyDocument,
        { filter: { district: district._id }, limit: 1 },
        { "access-token": token },
      ),
    ),
  ]);

  const schools: SchoolOption[] = schoolsResult.ok
    ? (schoolsResult.data.SchoolFindMany ?? []).filter(
        (s): s is NonNullable<typeof s> => s != null,
      )
    : [];
  const schoolCodes = schoolCodesResult.ok
    ? (schoolCodesResult.data.SchoolCodeFindMany ?? []).filter(
        (c): c is NonNullable<typeof c> => c != null,
      )
    : [];
  const firstCode = schoolCodes[0];
  const invite: InviteOption | null =
    firstCode && firstCode._id && firstCode.code
      ? { _id: firstCode._id, code: firstCode.code }
      : null;

  return {
    district,
    schools,
    invite,
    loadError: schoolsResult.error,
  };
}

export default function DistrictAdminSchoolsRoute() {
  const { district, schools, invite, loadError } =
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
              districtId={district._id}
              districtName={district.name}
              invite={invite}
            />
          ) : null}
          <DistrictSchoolsGrid schools={schools} />
        </>
      )}
    </div>
  );
}
