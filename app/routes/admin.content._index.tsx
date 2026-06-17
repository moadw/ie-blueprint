import { useState } from "react";
import type { LoaderFunctionArgs } from "react-router";
import {
  useLoaderData,
  useNavigate,
  useNavigation,
  useRevalidator,
} from "react-router";
import { Plus } from "lucide-react";
import {
  ADMIN_LIST_PAGE_SIZE,
  AdminListPagination,
} from "~/components/admin/admin-list-pagination";
import { env } from "~/lib/env";
import { gqlClient } from "~/lib/graphql";
import { readPageFromRequest } from "~/lib/pagination";
import { requireSessionToken } from "~/lib/session.server";
import { safe } from "~/lib/safe-loader";
import { CurriculumsFindManyDocument } from "~/queries/curriculums";
import { ClassesAdminFindManyDocument } from "~/queries/classes";
import { curriculumsSortEnum } from "~/gql/graphql";
import { Button } from "~/components/ui/button";
import { SeriesCard } from "~/components/admin/series-card";
import { SeriesDialog } from "~/components/admin/series-dialog";

export async function loader({ request }: LoaderFunctionArgs) {
  const token = await requireSessionToken(request);
  if (!env.PLATFORM) {
    return {
      curriculums: [],
      practiceCounts: {} as Record<string, number>,
      error: "Platform is not configured. Please contact your administrator.",
      page: 1,
      hasMore: false,
    };
  }
  const page = readPageFromRequest(request);
  // NOTE(curriculums-skip): the live GraphQL schema does NOT expose `skip` on
  // `CurriculumsFindMany` (verified via codegen 2026-05-20). We compute the
  // `page`/`skip` offset for chrome consistency with sibling admin lists, but
  // can only send `limit` server-side, so multi-page navigation is degraded
  // to page 1. `hasMore` therefore stays false; pagination chrome stays
  // hidden until the backend adds a `skip` argument. This matches the
  // threshold model documented in root.md (sub-100-row tenants see no
  // chrome).
  const result = await safe(
    gqlClient.request(
      CurriculumsFindManyDocument,
      {
        filter: { platform: env.PLATFORM },
        limit: ADMIN_LIST_PAGE_SIZE,
        sort: curriculumsSortEnum.ORDER_ASC,
      },
      { "access-token": token },
    ),
  );
  const curriculums = result.ok
    ? (result.data.CurriculumsFindMany ?? []).filter(
        (c): c is NonNullable<typeof c> => Boolean(c),
      )
    : [];

  // The curriculum doc's `totalLesson` aggregate is stale/inaccurate, so derive
  // each series' practice count the same way the detail route does: the number
  // of non-deleted `classes` for that curriculum (`ClassesAdminFindMany`
  // filtered by `curriculum` + `!deleted`). One safe() request per series keeps
  // a flaky downstream from white-screening the list — a failed fetch just
  // omits that series from the map and the card falls back to `totalLesson`.
  const countEntries = await Promise.all(
    curriculums.map(async (c) => {
      const r = await safe(
        gqlClient.request(
          ClassesAdminFindManyDocument,
          { filter: { curriculum: c._id, platform: env.PLATFORM }, limit: 100 },
          { "access-token": token },
        ),
      );
      if (!r.ok) return null;
      const count = (r.data.ClassesAdminFindMany ?? []).filter(
        (x) => !x.deleted,
      ).length;
      return [c._id, count] as const;
    }),
  );
  const practiceCounts: Record<string, number> = Object.fromEntries(
    countEntries.filter((e): e is NonNullable<typeof e> => e !== null),
  );

  return {
    curriculums,
    practiceCounts,
    error: result.error,
    page,
    hasMore: false,
  };
}

export default function AdminContentIndex() {
  const { curriculums, practiceCounts, error, page, hasMore } =
    useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const revalidator = useRevalidator();
  const [dialogOpen, setDialogOpen] = useState(false);

  const openDialog = () => setDialogOpen(true);
  const closeDialog = () => {
    setDialogOpen(false);
    revalidator.revalidate();
  };

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

      {error ? (
        <div className="rounded-xl border-2 border-dashed border-red-200 bg-red-50 py-10 text-center">
          <p className="mb-1 text-sm font-medium text-red-700">
            Couldn't load series
          </p>
          <p className="text-xs text-red-600">{error}</p>
        </div>
      ) : curriculums.length === 0 ? (
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
            <SeriesCard
              key={c._id}
              curriculum={c}
              practiceCount={practiceCounts[c._id]}
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

      <SeriesDialog open={dialogOpen} onClose={closeDialog} />
    </div>
  );
}
