import { useMemo, useState } from "react";
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
import { env } from "~/lib/env";
import { gqlClient } from "~/lib/graphql";
import { readPageFromRequest } from "~/lib/pagination";
import { requireSessionToken } from "~/lib/session.server";
import { safe } from "~/lib/safe-loader";
import { NarratorsFindManyDocument } from "~/queries/narrators";
import { NarratorRow } from "./admin.narrators/_components/NarratorRow";
import type { NarratorRowNarrator } from "./admin.narrators/_components/NarratorRow";
import { NarratorDialog } from "./admin.narrators/_components/NarratorDialog";

export async function loader({ request }: LoaderFunctionArgs) {
  const token = await requireSessionToken(request);
  const page = readPageFromRequest(request);
  const skip = (page - 1) * ADMIN_LIST_PAGE_SIZE;

  if (!env.PLATFORM) {
    return {
      narrators: [],
      error: "Platform is not configured. Please contact your administrator.",
      page: 1,
      hasMore: false,
    };
  }

  const result = await safe(
    gqlClient.request(
      NarratorsFindManyDocument,
      {
        filter: { platform: env.PLATFORM },
        limit: ADMIN_LIST_PAGE_SIZE,
        skip,
      },
      { "access-token": token },
    ),
  );
  const narrators: NarratorRowNarrator[] = result.ok
    ? (result.data.narratorsFindMany ?? []).filter(
        (n): n is NonNullable<typeof n> => n != null,
      )
    : [];
  return {
    narrators,
    error: result.error,
    page,
    hasMore: narrators.length === ADMIN_LIST_PAGE_SIZE,
  };
}

export default function AdminNarratorsRoute() {
  const {
    narrators,
    error: loadError,
    page,
    hasMore,
  } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const navigate = useNavigate();
  const revalidator = useRevalidator();

  const [createOpen, setCreateOpen] = useState(false);

  const sorted = useMemo(() => {
    // Client-side sort fallback in case backend NAME_ASC misbehaves.
    return [...narrators].sort((a, b) =>
      (a.name ?? "")
        .toLocaleLowerCase()
        .localeCompare((b.name ?? "").toLocaleLowerCase()),
    );
  }, [narrators]);

  const isInitialLoading =
    navigation.state === "loading" && narrators.length === 0;

  return (
    <div className="space-y-4">
      <div className="flex justify-end items-center">
        <Button
          variant="primary"
          onClick={() => setCreateOpen(true)}
          className="h-10 px-4 text-sm gap-1.5"
        >
          <Plus className="w-4 h-4" aria-hidden="true" /> Add Narrator
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
            Couldn't load narrators
          </p>
          <p className="text-xs text-red-600">{loadError}</p>
        </div>
      ) : sorted.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">
          No narrators yet
        </p>
      ) : (
        <div className="space-y-3">
          {sorted.map((n) => (
            <NarratorRow
              key={n._id}
              narrator={n}
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

      <NarratorDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={() => revalidator.revalidate()}
      />
    </div>
  );
}
