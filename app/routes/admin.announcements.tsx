import { useMemo, useState } from "react";
import { useLoaderData, useNavigation, useRevalidator } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { Loader2, Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
import { SortFindManyannouncementInput } from "~/gql/graphql";
import { gqlClient } from "~/lib/graphql";
import { requireSessionToken } from "~/lib/session.server";
import { safe } from "~/lib/safe-loader";
import { AnnouncementFindManyDocument } from "~/queries/announcements";
import { AnnouncementTypeTabs } from "./admin.announcements/_components/AnnouncementTypeTabs";
import type { AnnouncementType } from "./admin.announcements/_components/AnnouncementTypeTabs";
import { AnnouncementRow } from "./admin.announcements/_components/AnnouncementRow";
import type { AnnouncementRowAnnouncement } from "./admin.announcements/_components/AnnouncementRow";
import { AnnouncementDialog } from "./admin.announcements/_components/AnnouncementDialog";

// Announcements are GLOBAL — no platform filter. The `/admin/*` tree is already
// gated to `identifier === "admin"` by admin.tsx, so no extra role gate here.
export async function loader({ request }: LoaderFunctionArgs) {
  const token = await requireSessionToken(request);
  const result = await safe(
    gqlClient.request(
      AnnouncementFindManyDocument,
      { sort: SortFindManyannouncementInput.CREATEDAT_DESC, limit: 200 },
      { "access-token": token },
    ),
  );
  const items: AnnouncementRowAnnouncement[] = result.ok
    ? (result.data.AnnouncementFindMany ?? []).filter(
        (a): a is NonNullable<typeof a> => a != null,
      )
    : [];
  return { items, error: result.error };
}

export default function AdminAnnouncementsRoute() {
  const { items, error: loadError } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const revalidator = useRevalidator();

  const [activeType, setActiveType] = useState<AnnouncementType>("district");
  const [createOpen, setCreateOpen] = useState(false);

  const visible = useMemo(
    () => items.filter((a) => a.type === activeType),
    [items, activeType],
  );

  const isInitialLoading =
    navigation.state === "loading" && items.length === 0;

  return (
    <div className="space-y-5 rounded-2xl border border-border bg-card p-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Announcements</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Set a banner message for each audience. The most recent active
          announcement is shown to that audience.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <AnnouncementTypeTabs value={activeType} onChange={setActiveType} />
        <Button
          variant="primary"
          onClick={() => setCreateOpen(true)}
          className="h-10 gap-1.5 px-4 text-sm"
        >
          <Plus className="h-4 w-4" aria-hidden="true" /> Add announcement
        </Button>
      </div>

      {isInitialLoading ? (
        <div className="flex justify-center py-12">
          <Loader2
            className="h-6 w-6 animate-spin text-muted-foreground"
            aria-hidden="true"
          />
        </div>
      ) : loadError ? (
        <div className="rounded-xl border-2 border-dashed border-red-200 bg-red-50 py-10 text-center">
          <p className="mb-1 text-sm font-medium text-red-700">
            Couldn't load announcements
          </p>
          <p className="text-xs text-red-600">{loadError}</p>
        </div>
      ) : visible.length === 0 ? (
        <p className="py-8 text-center text-muted-foreground">
          No announcements yet
        </p>
      ) : (
        <div className="space-y-3">
          {visible.map((a) => (
            <AnnouncementRow
              key={a._id}
              announcement={a}
              onChanged={() => revalidator.revalidate()}
            />
          ))}
        </div>
      )}

      <AnnouncementDialog
        mode="create"
        type={activeType}
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSaved={() => revalidator.revalidate()}
      />
    </div>
  );
}
