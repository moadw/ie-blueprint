import { useState } from "react";
import {
  useLoaderData,
  useNavigate,
  useNavigation,
  useRevalidator,
} from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { Loader2, Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  ADMIN_LIST_PAGE_SIZE,
  AdminListPagination,
} from "~/components/admin/admin-list-pagination";
import { SortFindManylicensepresetInput } from "~/gql/graphql";
import { env } from "~/lib/env";
import { gqlClient } from "~/lib/graphql";
import { readPageFromRequest } from "~/lib/pagination";
import { requireSessionToken } from "~/lib/session.server";
import { safe } from "~/lib/safe-loader";
import { LicensePresetFindManyDocument } from "~/queries/license-presets";
import { LicensePresetDialog } from "./admin.license-presets/_components/LicensePresetDialog";
import { LicensePresetRow } from "./admin.license-presets/_components/LicensePresetRow";

export type LicensePresetListItem = {
  _id: string;
  identifier?: string | null;
  label?: string | null;
  description?: string | null;
  platform?: string | null;
  courses?: Array<string | null> | null;
  coursesCollection?: Array<string | null> | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export async function loader({ request }: LoaderFunctionArgs) {
  const token = await requireSessionToken(request);
  const page = readPageFromRequest(request);
  const skip = (page - 1) * ADMIN_LIST_PAGE_SIZE;

  if (!env.PLATFORM) {
    return {
      items: [] as LicensePresetListItem[],
      error: "Platform is not configured. Please contact your administrator.",
      page: 1,
      hasMore: false,
    };
  }

  const result = await safe(
    gqlClient.request(
      LicensePresetFindManyDocument,
      {
        filter: { platform: env.PLATFORM },
        limit: ADMIN_LIST_PAGE_SIZE,
        skip,
        sort: SortFindManylicensepresetInput.IDENTIFIER_ASC,
      },
      { "access-token": token },
    ),
  );
  const items: LicensePresetListItem[] = result.ok
    ? (result.data.LicensePresetFindMany ?? []).filter(
        (lp): lp is NonNullable<typeof lp> => lp != null,
      )
    : [];
  return {
    items,
    error: result.error,
    page,
    hasMore: items.length === ADMIN_LIST_PAGE_SIZE,
  };
}

export default function AdminLicensePresetsRoute() {
  const {
    items,
    error: loadError,
    page,
    hasMore,
  } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const navigate = useNavigate();
  const revalidator = useRevalidator();

  const [createOpen, setCreateOpen] = useState(false);

  const isInitialLoading =
    navigation.state === "loading" && items.length === 0;

  return (
    <div className="space-y-4">
      <div className="flex justify-end items-center">
        <Button
          variant="primary"
          onClick={() => setCreateOpen(true)}
          className="h-10 px-4 text-sm gap-1.5"
        >
          <Plus className="w-4 h-4" aria-hidden="true" /> Add License Preset
        </Button>
      </div>

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
            Couldn't load license presets
          </p>
          <p className="text-xs text-red-600">{loadError}</p>
        </div>
      ) : items.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">
          No license presets yet
        </p>
      ) : (
        <div className="space-y-3">
          {items.map((preset) => (
            <LicensePresetRow
              key={preset._id}
              preset={preset}
              onUpdated={() => revalidator.revalidate()}
              onDeleted={() => revalidator.revalidate()}
            />
          ))}
        </div>
      )}

      {hasMore || page > 1 ? (
        <AdminListPagination
          page={page}
          hasMore={hasMore}
          loading={navigation.state !== "idle"}
          onPrev={() => navigate(`?page=${page - 1}`)}
          onNext={() => navigate(`?page=${page + 1}`)}
        />
      ) : null}

      <LicensePresetDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={() => revalidator.revalidate()}
      />
    </div>
  );
}
