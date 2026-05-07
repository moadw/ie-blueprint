import { useState } from "react";
import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { Plus } from "lucide-react";
import { gqlClient } from "~/lib/graphql";
import { requireSessionToken } from "~/lib/session.server";
import { CurriculumsFindManyDocument } from "~/queries/curriculums";
import { curriculumsSortEnum } from "~/gql/graphql";
import { Button } from "~/components/ui/button";
import { SeriesCard } from "~/components/admin/series-card";
import { SeriesDialog } from "~/components/admin/series-dialog";

export async function loader({ request }: LoaderFunctionArgs) {
  const token = await requireSessionToken(request);
  const data = await gqlClient.request(
    CurriculumsFindManyDocument,
    { limit: 50, sort: curriculumsSortEnum.ORDER_ASC },
    { "access-token": token },
  );
  const curriculums = (data.CurriculumsFindMany ?? []).filter(
    (c): c is NonNullable<typeof c> => Boolean(c),
  );
  return { curriculums };
}

export default function AdminContentIndex() {
  const { curriculums } = useLoaderData<typeof loader>();
  const [dialogOpen, setDialogOpen] = useState(false);

  const openDialog = () => setDialogOpen(true);
  const closeDialog = () => setDialogOpen(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-xl text-foreground">
            Series & Practices
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Click a series to view and manage its practices
          </p>
        </div>
        <Button variant="primary" onClick={openDialog}>
          <Plus className="h-4 w-4" />
          New Series
        </Button>
      </div>

      {curriculums.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-stone-200 bg-stone-50 py-16 text-center">
          <p className="text-stone-600">No series yet</p>
          <div className="mt-4 flex justify-center">
            <Button variant="primary" onClick={openDialog}>
              <Plus className="h-4 w-4" />
              New Series
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {curriculums.map((c) => (
            <SeriesCard key={c._id} curriculum={c} />
          ))}
        </div>
      )}

      <SeriesDialog open={dialogOpen} onClose={closeDialog} />
    </div>
  );
}
