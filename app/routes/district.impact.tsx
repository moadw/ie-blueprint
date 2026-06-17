import { useLoaderData } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { getDistrictImpact } from "~/lib/district-impact.server";
import { ImpactHeader } from "~/routes/district.impact/_components/impact-header";
import { ImpactMasonry } from "~/routes/district.impact/_components/impact-masonry";

export async function loader({ request }: LoaderFunctionArgs) {
  return await getDistrictImpact(request);
}

export default function DistrictImpactRoute() {
  const { data, loadError } = useLoaderData<typeof loader>();

  return (
    <div className="h-full overflow-auto">
      <div className="p-6 max-w-[1440px] mx-auto space-y-6">
        <ImpactHeader districtName={data?.districtName ?? null} />

        {loadError ? (
          <div className="rounded-xl border-2 border-dashed border-red-200 bg-red-50 py-4 px-4">
            <p className="text-xs text-red-600">{loadError}</p>
          </div>
        ) : null}

        {!data || data.stories.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-border bg-muted/30 py-12 text-center">
            <p className="text-sm text-muted-foreground">No impact stories yet.</p>
          </div>
        ) : (
          <ImpactMasonry stories={data.stories} />
        )}
      </div>
    </div>
  );
}
