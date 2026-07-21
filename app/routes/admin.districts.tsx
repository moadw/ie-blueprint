import { useEffect, useState } from "react";
import {
  useLoaderData,
  useNavigation,
  useRevalidator,
  useSearchParams,
} from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { Building2, Loader2, Plus, Search } from "lucide-react";
import { AdminListPagination } from "~/components/admin/admin-list-pagination";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { env } from "~/lib/env";
import { toErrorMessage } from "~/lib/errors";
import { gqlClient } from "~/lib/graphql";
import { readPageFromRequest } from "~/lib/pagination";
import { requireSessionToken } from "~/lib/session.server";
import { safe } from "~/lib/safe-loader";
import {
  DistrictProfileFindManyDocument,
  DistrictSearchDocument,
  DistrictUpdateOneDocument,
} from "~/queries/districts";
import { LicensePresetFindManyDocument } from "~/queries/license-presets";
import { CurriculumsFindManyDocument } from "~/queries/curriculums";
import { toast } from "~/components/ui/toast";
import { DistrictRow } from "./admin.districts/_components/DistrictRow";
import { DistrictDialog } from "./admin.districts/_components/DistrictDialog";
import { SchoolsDialog } from "./admin.districts/_components/SchoolsDialog";
import { DistrictLicenseDialog } from "./admin.districts/_components/DistrictLicenseDialog";
import type { LicenseDialogDistrict } from "./admin.districts/_components/DistrictLicenseDialog";

type DistrictProfile = {
  _id: string;
  district?: string | null;
  city?: string | null;
  address?: string | null;
  website?: string | null;
  cover?: { type?: string | null; url?: string | null } | null;
  logo?: { type?: string | null; url?: string | null } | null;
};

type District = {
  _id: string;
  name?: string | null;
  state?: string | null;
  courses?: Array<string | null> | null;
  coursesCollections?: Array<string | null> | null;
  licenseLabel?: string | null;
  licenseExpDate?: string | number | null;
  userTotal?: number | null;
  schoolLicense?: boolean | null;
  coverPhoto?: { type?: string | null; url?: string | null } | null;
  logo?: { type?: string | null; url?: string | null } | null;
  country?: string | null;
  platform?: string | null;
  organization?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  profile?: DistrictProfile | null;
};

type LicensePreset = {
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

type Curriculum = {
  _id: string;
  title?: string | null;
  description?: string | null;
  slug?: string | null;
  active?: boolean | null;
  hidden?: boolean | null;
  grade?: string | null;
  category?: string | null;
  order?: number | null;
  totalLesson?: number | null;
  curriculumCollection?: Array<{ _id: string } | null> | null;
  cover?: { type?: string | null; url?: string | null } | null;
  bgImage?: { type?: string | null; url?: string | null } | null;
};

// Districts fan out one lazy per-row `district-admin` lookup each (see
// `<DistrictAdminLine />`), so this list uses a smaller page than the shared
// `ADMIN_LIST_PAGE_SIZE` (100) to keep that burst bounded.
const DISTRICTS_PAGE_SIZE = 30;

export async function loader({ request }: LoaderFunctionArgs) {
  const token = await requireSessionToken(request);
  const query = (new URL(request.url).searchParams.get("q") ?? "").trim();
  if (!env.PLATFORM) {
    return {
      districts: [] as District[],
      total: 0,
      loadError:
        "Platform is not configured. Please contact your administrator.",
      page: 1,
      query,
      hasMore: false,
      presets: [] as LicensePreset[],
      curriculums: [] as Curriculum[],
    };
  }
  const page = readPageFromRequest(request);
  const skip = (page - 1) * DISTRICTS_PAGE_SIZE;
  // `DistrictSearch` is scoped to the session user's platform automatically
  // (no `platform` arg). With `query` empty it returns every district ordered
  // by `sortBy`; with `query` present it fuzzy-matches name/city/state and
  // `sortBy` is the tiebreaker. `total` is the fuzzy match count that drives
  // pagination — see [[reference_blueprint_sort_operators_index_driven]].
  const result = await safe(
    gqlClient.request(
      DistrictSearchDocument,
      {
        ...(query ? { query } : {}),
        sortBy: "name",
        sortOrder: 1,
        limit: DISTRICTS_PAGE_SIZE,
        skip,
      },
      { "access-token": token },
    ),
  );
  const total = result.ok ? (result.data.DistrictSearch?.total ?? 0) : 0;
  const baseDistricts = result.ok
    ? (result.data.DistrictSearch?.data ?? []).filter(
        (d): d is NonNullable<typeof d> => d != null,
      )
    : [];

  let profiles: DistrictProfile[] = [];
  if (baseDistricts.length > 0) {
    const districtIds = baseDistricts
      .map((d) => d._id)
      .filter((id): id is string => Boolean(id));
    if (districtIds.length > 0) {
      const profileResult = await safe(
        gqlClient.request(
          DistrictProfileFindManyDocument,
          {
            filter: {
              _operators: { district: { in: districtIds } },
            },
            limit: districtIds.length,
            skip: 0,
          },
          { "access-token": token },
        ),
      );
      profiles = profileResult.ok
        ? (profileResult.data.DistrictProfileFindMany ?? []).filter(
            (p): p is NonNullable<typeof p> => p != null,
          )
        : [];
    }
  }

  const profileByDistrict = new Map<string, DistrictProfile>();
  for (const p of profiles) {
    if (p.district) profileByDistrict.set(p.district, p);
  }
  const districts: District[] = baseDistricts.map((d) => ({
    ...d,
    profile: profileByDistrict.get(d._id) ?? null,
  }));

  const [presetsResult, curriculumsResult] = await Promise.all([
    safe(
      gqlClient.request(
        LicensePresetFindManyDocument,
        { filter: { platform: env.PLATFORM }, limit: 500 },
        { "access-token": token },
      ),
    ),
    safe(
      gqlClient.request(
        CurriculumsFindManyDocument,
        { filter: { platform: env.PLATFORM }, limit: 500 },
        { "access-token": token },
      ),
    ),
  ]);
  const presets: LicensePreset[] = presetsResult.ok
    ? ((presetsResult.data.LicensePresetFindMany ?? []).filter(
        (p): p is NonNullable<typeof p> => p != null,
      ) as LicensePreset[])
    : [];
  const curriculums: Curriculum[] = curriculumsResult.ok
    ? ((curriculumsResult.data.CurriculumsFindMany ?? []).filter(
        (c): c is NonNullable<typeof c> => c != null,
      ) as Curriculum[])
    : [];

  return {
    districts,
    total,
    loadError: result.error,
    page,
    query,
    hasMore: page * DISTRICTS_PAGE_SIZE < total,
    presets,
    curriculums,
  };
}

export default function AdminDistrictsRoute() {
  const { districts, total, loadError, page, query, hasMore, presets, curriculums } =
    useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const [searchParams, setSearchParams] = useSearchParams();
  const revalidator = useRevalidator();

  const [queryInput, setQueryInput] = useState(query);
  const [createOpen, setCreateOpen] = useState(false);
  const [schoolsTarget, setSchoolsTarget] = useState<District | null>(null);
  const [editTarget, setEditTarget] = useState<District | null>(null);
  const [licenseDialogOpen, setLicenseDialogOpen] = useState(false);
  const [licenseTarget, setLicenseTarget] =
    useState<LicenseDialogDistrict | null>(null);

  // Debounce the input into the `?q=` search param (server-side search via
  // `DistrictSearch`). No-op when the typed value already matches the URL, so
  // this never fires on mount nor loops after the loader re-runs. Resetting
  // `page` keeps a new query on page 1; `replace` avoids polluting history.
  useEffect(() => {
    const trimmed = queryInput.trim();
    if (trimmed === (searchParams.get("q") ?? "")) return;
    const handle = setTimeout(() => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (trimmed) next.set("q", trimmed);
          else next.delete("q");
          next.delete("page");
          return next;
        },
        { replace: true },
      );
    }, 300);
    return () => clearTimeout(handle);
  }, [queryInput, searchParams, setSearchParams]);

  function goToPage(next: number) {
    setSearchParams((prev) => {
      const merged = new URLSearchParams(prev);
      merged.set("page", String(next));
      return merged;
    });
  }

  const isBusy = navigation.state !== "idle";
  const isInitialLoading = isBusy && districts.length === 0;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-foreground">
          Districts ({total})
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
          value={queryInput}
          onChange={(e) => setQueryInput(e.target.value)}
          aria-label="Search districts"
          className="pl-10 pr-10"
        />
        {isBusy ? (
          <Loader2
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground"
            aria-hidden="true"
          />
        ) : null}
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
      ) : total === 0 && query ? (
        <div className="py-12 text-center text-muted-foreground">
          No districts match &quot;{query}&quot;
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
      ) : (
        <div className="space-y-3">
          {districts.map((d) => (
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
              onLicense={(target) => {
                setLicenseTarget({
                  _id: target._id,
                  name: target.name ?? null,
                  courses: target.courses ?? null,
                  coursesCollections: target.coursesCollections ?? null,
                  licenseLabel: target.licenseLabel ?? null,
                  licenseExpDate: target.licenseExpDate ?? null,
                  userTotal: target.userTotal ?? null,
                  schoolLicense: target.schoolLicense ?? null,
                });
                setLicenseDialogOpen(true);
              }}
            />
          ))}
        </div>
      )}

      <DistrictDialog
        mode="create"
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={() => {
          revalidator.revalidate();
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
          onUpdated={() => {
            revalidator.revalidate();
          }}
        />
      ) : null}

      <DistrictLicenseDialog
        open={licenseDialogOpen}
        onOpenChange={(o) => {
          setLicenseDialogOpen(o);
          if (!o) setLicenseTarget(null);
        }}
        district={licenseTarget}
        presets={presets}
        curriculums={curriculums}
        onSubmit={async ({
          coursesCollections,
          courses,
          licenseLabel,
          licenseExpDate,
          userTotal,
          schoolLicense,
        }) => {
          if (!licenseTarget) return;
          try {
            const data = await gqlClient.request(DistrictUpdateOneDocument, {
              _id: licenseTarget._id,
              record: {
                courses,
                coursesCollections,
                licenseLabel,
                licenseExpDate,
                userTotal,
                schoolLicense,
                platform: env.PLATFORM,
              },
            });
            const payload = data.DistrictUpdateOne;
            const errorMessage = (
              payload?.error as
                | { message?: string | null }
                | null
                | undefined
            )?.message;
            if (errorMessage) {
              toast.error(errorMessage);
              return;
            }
            toast.success("License updated");
            setLicenseDialogOpen(false);
            setLicenseTarget(null);
            revalidator.revalidate();
          } catch (err) {
            const message = toErrorMessage(err, "Failed to update license");
            toast.error(message);
          }
        }}
        onUnassign={async () => {
          if (!licenseTarget) return;
          try {
            const data = await gqlClient.request(DistrictUpdateOneDocument, {
              _id: licenseTarget._id,
              record: {
                courses: [],
                coursesCollections: [],
                licenseLabel: null,
                platform: env.PLATFORM,
              },
            });
            const payload = data.DistrictUpdateOne;
            const errorMessage = (
              payload?.error as
                | { message?: string | null }
                | null
                | undefined
            )?.message;
            if (errorMessage) {
              toast.error(errorMessage);
              return;
            }
            toast.success("License unassigned");
            setLicenseDialogOpen(false);
            setLicenseTarget(null);
            revalidator.revalidate();
          } catch (err) {
            const message = toErrorMessage(err, "Failed to unassign license");
            toast.error(message);
          }
        }}
      />

      {hasMore || page > 1 ? (
        <AdminListPagination
          page={page}
          hasMore={hasMore}
          loading={isBusy}
          onPrev={() => goToPage(page - 1)}
          onNext={() => goToPage(page + 1)}
        />
      ) : null}
    </div>
  );
}
