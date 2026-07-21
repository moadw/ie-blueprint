import { useMemo, useState } from "react";
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
import { CurriculumCollectionFindManyDocument } from "~/queries/curriculum-collections";
import { ClassesAdminCountFindManyDocument } from "~/queries/classes";
import { PRACTICE_COUNT_CAP } from "~/lib/curriculum";
import { curriculumsSortEnum } from "~/gql/graphql";
import { Button } from "~/components/ui/button";
import { SeriesCard } from "~/components/admin/series-card";
import { SeriesDialog } from "~/components/admin/series-dialog";
import { Divider } from "~/components/ui/divider";

// No real series should exceed PRACTICE_COUNT_CAP (200) practices, so we only
// need to count up to the cap + 1: fetch that many rows and let a single
// over-cap practice surface as "200+" (the card's display cap). Fetching more
// has no product value — a series that legitimately hits this is a data/
// migration error we warn about rather than count precisely.
const PRACTICE_COUNT_FETCH_LIMIT = PRACTICE_COUNT_CAP + 1;

export async function loader({ request }: LoaderFunctionArgs) {
  const token = await requireSessionToken(request);
  if (!env.PLATFORM) {
    return {
      curriculums: [],
      collections: [],
      practiceCounts: {} as Record<string, number>,
      error: "Platform is not configured. Please contact your administrator.",
      collectionsError: null as string | null,
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

  // Experiences (a.k.a. curriculum collections) let us group the flat series
  // list under headings. Membership is stored on the curriculum side
  // (`curriculum.curriculumCollection: curriculumcollection[]`, an array — a
  // series can belong to several), so we only need the collections' names/colors
  // here and invert client-side. safe()-wrapped: a failed fetch degrades to the
  // ungrouped flat grid rather than white-screening the list.
  const collectionsResult = await safe(
    gqlClient.request(
      CurriculumCollectionFindManyDocument,
      { filter: { platform: env.PLATFORM }, limit: 500 },
      { "access-token": token },
    ),
  );
  const collections = collectionsResult.ok
    ? (collectionsResult.data.curriculumCollectionFindMany ?? []).filter(
        (c): c is NonNullable<typeof c> => Boolean(c),
      )
    : [];

  // The curriculum doc's `totalLesson` aggregate is stale/inaccurate, so derive
  // each series' practice count the same way the detail route does: the number
  // of non-deleted `classes` for that curriculum. One slim request per series
  // (id + curriculum + deleted only) counts the non-deleted classes, fetching
  // just `PRACTICE_COUNT_CAP + 1` rows — enough to show an exact count up to the
  // cap and surface anything beyond as "200+". `deleted` is treated as "not
  // deleted unless literally true" (matches the detail route + migration —
  // non-deleted docs may carry `deleted: null`/absent, so a server-side
  // `deleted: false` filter would undercount). One safe() request per series
  // keeps a flaky downstream from white-screening the list — a failed fetch just
  // omits that series from the map and the card falls back to `totalLesson`.
  const countEntries = await Promise.all(
    curriculums.map(async (c) => {
      const r = await safe(
        gqlClient.request(
          ClassesAdminCountFindManyDocument,
          {
            filter: { curriculum: c._id, platform: env.PLATFORM },
            limit: PRACTICE_COUNT_FETCH_LIMIT,
          },
          { "access-token": token },
        ),
      );
      if (!r.ok) return null;
      const rows = r.data.ClassesAdminFindMany ?? [];
      const count = rows.filter((x) => x && x.deleted !== true).length;
      // Over the cap → almost certainly a data/migration error (no real series
      // should have this many). The card renders it as "200+"; flag it here too.
      if (count > PRACTICE_COUNT_CAP) {
        console.warn(
          `[admin/content] series ${c._id} has more than ${PRACTICE_COUNT_CAP} ` +
            `practices — likely a data/migration error.`,
        );
      }
      return [c._id, count] as const;
    }),
  );
  const practiceCounts: Record<string, number> = Object.fromEntries(
    countEntries.filter((e): e is NonNullable<typeof e> => e !== null),
  );

  return {
    curriculums,
    collections,
    practiceCounts,
    error: result.error,
    collectionsError: collectionsResult.error,
    page,
    hasMore: false,
  };
}

export default function AdminContentIndex() {
  const {
    curriculums,
    collections,
    practiceCounts,
    error,
    collectionsError,
    page,
    hasMore,
  } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const revalidator = useRevalidator();
  const [dialogOpen, setDialogOpen] = useState(false);

  const openDialog = () => setDialogOpen(true);
  const closeDialog = () => {
    setDialogOpen(false);
    revalidator.revalidate();
  };

  // Group the flat series list under experience (curriculum-collection) headings.
  // A series appears under EVERY collection it belongs to (membership is a
  // many-to-many array on the curriculum side), so the same card can show in
  // more than one section. Collections are sorted A–Z by name; only collections
  // with ≥1 assigned series get a section. Series whose collections don't
  // resolve to any fetched collection (none set, or an orphaned/deleted id) fall
  // into a trailing "No Experience" group. Within a group, the loader's
  // ORDER_ASC order is preserved (we filter the already-ordered list).
  const groups = useMemo(() => {
    const collectionIds = new Set(collections.map((c) => c._id));
    const sections = [...collections]
      .sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""))
      .map((collection) => ({
        collection,
        items: curriculums.filter((c) =>
          (c.curriculumCollection ?? []).some((cc) => cc?._id === collection._id),
        ),
      }))
      .filter((section) => section.items.length > 0);
    const noExperience = curriculums.filter(
      (c) =>
        !(c.curriculumCollection ?? []).some(
          (cc) => cc?._id != null && collectionIds.has(cc._id),
        ),
    );
    return { sections, noExperience };
  }, [curriculums, collections]);

  const renderGrid = (items: typeof curriculums) => (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((c) => (
        <SeriesCard
          key={c._id}
          curriculum={c}
          practiceCount={practiceCounts[c._id]}
        />
      ))}
    </div>
  );

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
      ) : groups.sections.length === 0 ? (
        // No experiences resolved (none exist, or the collections fetch failed)
        // — fall back to the original ungrouped grid.
        <div className="space-y-3">
          {collectionsError ? (
            <p className="text-xs text-muted-foreground">
              Couldn't load experiences — showing series ungrouped.
            </p>
          ) : null}
          {renderGrid(curriculums)}
        </div>
      ) : (
        <div className="space-y-8">
          {groups.sections.map((section) => (
            <section key={section.collection._id} className="space-y-3">
              <div className="flex items-center gap-2">
                {section.collection.color ? (
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: section.collection.color }}
                    aria-hidden="true"
                  />
                ) : null}
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  {section.collection.name ?? "Untitled experience"}
                </h3>
                <span className="text-xs text-muted-foreground/70">
                  ({section.items.length})
                </span>
              </div>
              <Divider />
              {renderGrid(section.items)}
            </section>
          ))}

          {groups.noExperience.length > 0 ? (
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  No Experience
                </h3>
                <span className="text-xs text-muted-foreground/70">
                  ({groups.noExperience.length})
                </span>
              </div>
              <Divider />
              {renderGrid(groups.noExperience)}
            </section>
          ) : null}
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
