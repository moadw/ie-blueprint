import { useMemo, useState } from "react";
import {
  useLoaderData,
  useNavigate,
  useNavigation,
  useRevalidator,
} from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { Layers, Loader2, Plus, Search } from "lucide-react";
import {
  ADMIN_LIST_PAGE_SIZE,
  AdminListPagination,
} from "~/components/admin/admin-list-pagination";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { env } from "~/lib/env";
import { gqlClient } from "~/lib/graphql";
import { readPageFromRequest } from "~/lib/pagination";
import { requireSessionToken } from "~/lib/session.server";
import { safe } from "~/lib/safe-loader";
import { CurriculumCollectionFindManyDocument } from "~/queries/curriculum-collections";
import { ExperienceRow } from "./admin.experiences/_components/ExperienceRow";
import { ExperienceDialog } from "./admin.experiences/_components/ExperienceDialog";
import { ManageSeriesDialog } from "./admin.experiences/_components/ManageSeriesDialog";

export type Experience = {
  _id: string;
  name?: string | null;
  slug?: string | null;
  description?: string | null;
  gradeLevel?: string | null;
  color?: string | null;
  active?: boolean | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export async function loader({ request }: LoaderFunctionArgs) {
  const token = await requireSessionToken(request);
  if (!env.PLATFORM) {
    return {
      collections: [] as Experience[],
      error:
        "Platform is not configured. Please contact your administrator.",
      page: 1,
      hasMore: false,
    };
  }
  const page = readPageFromRequest(request);
  const skip = (page - 1) * ADMIN_LIST_PAGE_SIZE;
  const result = await safe(
    gqlClient.request(
      CurriculumCollectionFindManyDocument,
      {
        filter: { platform: env.PLATFORM },
        limit: ADMIN_LIST_PAGE_SIZE,
        skip,
      },
      { "access-token": token },
    ),
  );
  if (!result.ok) {
    return {
      collections: [] as Experience[],
      error: result.error,
      page,
      hasMore: false,
    };
  }
  const rows = result.data.curriculumCollectionFindMany ?? [];
  const collections: Experience[] = rows
    .filter((c): c is NonNullable<typeof c> => c != null)
    .map((c) => ({
      _id: c._id,
      name: c.name ?? null,
      slug: c.slug ?? null,
      description: c.description ?? null,
      gradeLevel: c.gradeLevel ?? null,
      color: c.color ?? null,
      active: c.active ?? null,
      createdAt: (c.createdAt as string | null | undefined) ?? null,
      updatedAt: (c.updatedAt as string | null | undefined) ?? null,
    }));
  return {
    collections,
    error: null as string | null,
    page,
    hasMore: collections.length === ADMIN_LIST_PAGE_SIZE,
  };
}

export default function AdminExperiencesRoute() {
  const {
    collections,
    error: loadError,
    page,
    hasMore,
  } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const navigate = useNavigate();
  const revalidator = useRevalidator();

  const [query, setQuery] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Experience | null>(null);
  const [manageSeriesTarget, setManageSeriesTarget] =
    useState<Experience | null>(null);

  const filteredSorted = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? collections.filter((c) => (c.name ?? "").toLowerCase().includes(q))
      : collections;
    return [...filtered].sort((a, b) =>
      (a.name ?? "")
        .toLocaleLowerCase()
        .localeCompare((b.name ?? "").toLocaleLowerCase()),
    );
  }, [collections, query]);

  const isRevalidating =
    navigation.state === "loading" && collections.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-foreground">
          Experiences ({filteredSorted.length})
        </h3>
        <Button
          variant="primary"
          onClick={() => setCreateOpen(true)}
          className="h-10 px-4 text-sm gap-1.5"
        >
          <Plus className="w-4 h-4" aria-hidden="true" /> Add Experience
        </Button>
      </div>

      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          type="search"
          placeholder="Search experiences…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search experiences"
          className="pl-10"
        />
      </div>

      {loadError ? (
        <div className="rounded-xl border-2 border-dashed border-red-200 bg-red-50 py-10 text-center">
          <p className="mb-1 text-sm font-medium text-red-700">
            Couldn&apos;t load experiences
          </p>
          <p className="text-xs text-red-600">{loadError}</p>
        </div>
      ) : isRevalidating ? (
        <div className="flex justify-center py-12">
          <Loader2
            className="w-6 h-6 animate-spin text-muted-foreground"
            aria-hidden="true"
          />
        </div>
      ) : collections.length === 0 ? (
        <div className="bg-card rounded-lg border border-border p-12 text-center">
          <Layers
            className="w-10 h-10 text-muted-foreground mx-auto mb-3"
            aria-hidden="true"
          />
          <p className="text-muted-foreground mb-4">No experiences yet</p>
          <Button
            variant="outline"
            onClick={() => setCreateOpen(true)}
            className="h-10 px-4 text-sm gap-1.5"
          >
            <Plus className="w-4 h-4" aria-hidden="true" /> Create your first
            experience
          </Button>
        </div>
      ) : filteredSorted.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground">
          No experiences match &quot;{query}&quot;
        </div>
      ) : (
        <div className="space-y-3">
          {filteredSorted.map((c) => (
            <ExperienceRow
              key={c._id}
              experience={c}
              onManageSeries={(target) =>
                setManageSeriesTarget(
                  collections.find((x) => x._id === target._id) ?? null,
                )
              }
              onEdit={(target) =>
                setEditTarget(
                  collections.find((x) => x._id === target._id) ?? null,
                )
              }
              onDeleted={() => {
                revalidator.revalidate();
              }}
            />
          ))}
        </div>
      )}

      <ExperienceDialog
        mode="create"
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={() => {
          revalidator.revalidate();
        }}
      />

      {editTarget !== null ? (
        <ExperienceDialog
          mode="edit"
          open={editTarget !== null}
          onOpenChange={(o) => {
            if (!o) setEditTarget(null);
          }}
          experience={editTarget}
          onUpdated={() => {
            revalidator.revalidate();
          }}
        />
      ) : null}

      {manageSeriesTarget !== null ? (
        <ManageSeriesDialog
          open={manageSeriesTarget !== null}
          onOpenChange={(o) => {
            if (!o) setManageSeriesTarget(null);
          }}
          experience={manageSeriesTarget}
        />
      ) : null}

      {(hasMore || page > 1) && !query ? (
        <AdminListPagination
          page={page}
          hasMore={hasMore}
          loading={navigation.state !== "idle"}
          onPrev={() => navigate(`?page=${page - 1}`)}
          onNext={() => navigate(`?page=${page + 1}`)}
        />
      ) : null}
    </div>
  );
}
