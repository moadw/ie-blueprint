import { useMemo, useState } from "react";
import { useLoaderData, useNavigation } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { Building2, Loader2, Plus, Search } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { gqlClient } from "~/lib/graphql";
import { requireSessionToken } from "~/lib/session.server";
import { safe } from "~/lib/safe-loader";
import { DistrictFindManyDocument } from "~/queries/districts";
import { SortFindManydistrictInput } from "~/gql/graphql";
import { DistrictRow } from "./admin.districts/_components/DistrictRow";
import { DistrictDialog } from "./admin.districts/_components/DistrictDialog";
import { SchoolsDialog } from "./admin.districts/_components/SchoolsDialog";

const PAGE_SIZE = 100;

type District = {
  _id: string;
  name?: string | null;
  state?: string | null;
  country?: string | null;
  platform?: string | null;
  organization?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export async function loader({ request }: LoaderFunctionArgs) {
  const token = await requireSessionToken(request);
  const result = await safe(
    gqlClient.request(
      DistrictFindManyDocument,
      { limit: PAGE_SIZE, skip: 0, sort: SortFindManydistrictInput._ID_DESC },
      { "access-token": token },
    ),
  );
  const districts: District[] = result.ok
    ? (result.data.DistrictFindMany ?? []).filter(
        (d): d is NonNullable<typeof d> => d != null,
      )
    : [];
  return { districts, loadError: result.error };
}

export default function AdminDistrictsRoute() {
  const { districts: initialDistricts, loadError } = useLoaderData<typeof loader>();
  const navigation = useNavigation();

  const [districts, setDistricts] = useState<District[]>(initialDistricts);
  const [query, setQuery] = useState("");
  const [skip, setSkip] = useState(initialDistricts.length);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(initialDistricts.length === PAGE_SIZE);
  const [createOpen, setCreateOpen] = useState(false);
  const [schoolsTarget, setSchoolsTarget] = useState<District | null>(null);
  const [editTarget, setEditTarget] = useState<District | null>(null);

  const filteredSorted = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? districts.filter((d) => (d.name ?? "").toLowerCase().includes(q))
      : districts;
    return [...filtered].sort((a, b) =>
      (a.name ?? "")
        .toLocaleLowerCase()
        .localeCompare((b.name ?? "").toLocaleLowerCase()),
    );
  }, [districts, query]);

  const isInitialLoading =
    navigation.state === "loading" && districts.length === 0;

  async function handleLoadMore() {
    setLoadingMore(true);
    setError(null);
    try {
      const data = await gqlClient.request(DistrictFindManyDocument, {
        limit: PAGE_SIZE,
        skip,
        sort: SortFindManydistrictInput._ID_DESC,
      });
      const next: District[] = (data.DistrictFindMany ?? []).filter(
        (d): d is NonNullable<typeof d> => d != null,
      );
      setDistricts((prev) => [...prev, ...next]);
      setSkip((prev) => prev + next.length);
      setHasMore(next.length === PAGE_SIZE);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load more districts.",
      );
    } finally {
      setLoadingMore(false);
    }
  }

  function handleRetry() {
    setError(null);
    void handleLoadMore();
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-foreground">
          Districts ({filteredSorted.length})
        </h3>
        <Button
          variant="primary"
          onClick={() => setCreateOpen(true)}
          className="h-10 px-4 text-sm gap-1.5"
        >
          <Plus className="w-4 h-4" aria-hidden="true" /> Create District
        </Button>
      </div>

      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          type="search"
          placeholder="Search districts…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search districts"
          className="pl-10"
        />
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
            Couldn't load districts
          </p>
          <p className="text-xs text-red-600">{loadError}</p>
        </div>
      ) : districts.length === 0 ? (
        <div className="bg-card rounded-lg border border-border p-12 text-center">
          <Building2
            className="w-10 h-10 text-muted-foreground mx-auto mb-3"
            aria-hidden="true"
          />
          <p className="text-muted-foreground mb-4">No districts yet</p>
          <Button
            variant="outline"
            onClick={() => setCreateOpen(true)}
            className="h-10 px-4 text-sm gap-1.5"
          >
            <Plus className="w-4 h-4" aria-hidden="true" /> Create your first district
          </Button>
        </div>
      ) : filteredSorted.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground">
          No districts match &quot;{query}&quot;
        </div>
      ) : (
        <div className="space-y-3">
          {filteredSorted.map((d) => (
            <DistrictRow
              key={d._id}
              district={d}
              onSchools={(target) => {
                const found = districts.find((x) => x._id === target._id);
                setSchoolsTarget(found ?? null);
              }}
              onEdit={(target) => {
                const found = districts.find((x) => x._id === target._id);
                setEditTarget(found ?? null);
              }}
            />
          ))}
        </div>
      )}

      {error ? (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive flex items-center justify-between">
          <span>{error}</span>
          <Button
            variant="outline"
            onClick={handleRetry}
            className="h-9 px-3 text-sm"
          >
            Retry
          </Button>
        </div>
      ) : null}

      <DistrictDialog
        mode="create"
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={(d) => {
          setDistricts((prev) => [d, ...prev]);
          setSkip((prev) => prev + 1);
        }}
      />

      {schoolsTarget !== null ? (
        <SchoolsDialog
          open={schoolsTarget !== null}
          onOpenChange={(o) => {
            if (!o) setSchoolsTarget(null);
          }}
          district={schoolsTarget}
        />
      ) : null}

      {editTarget !== null ? (
        <DistrictDialog
          mode="edit"
          open={editTarget !== null}
          onOpenChange={(o) => {
            if (!o) setEditTarget(null);
          }}
          district={editTarget}
          onUpdated={(d) => {
            setDistricts((prev) =>
              prev.map((p) => (p._id === d._id ? { ...p, ...d } : p)),
            );
          }}
        />
      ) : null}

      {hasMore && !query ? (
        <div className="flex justify-center pt-2">
          <Button
            variant="outline"
            onClick={handleLoadMore}
            disabled={loadingMore}
            loading={loadingMore}
            className="h-10 px-4 text-sm"
          >
            Load More
          </Button>
        </div>
      ) : null}
    </div>
  );
}
