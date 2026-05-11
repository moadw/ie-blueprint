import { useEffect, useMemo, useState } from "react";
import { useLoaderData, useNavigation } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { Loader2, Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
import { gqlClient } from "~/lib/graphql";
import { requireSessionToken } from "~/lib/session.server";
import { safe } from "~/lib/safe-loader";
import { NarratorsFindManyDocument } from "~/queries/narrators";
import { NarratorRow } from "./admin.narrators/_components/NarratorRow";
import type { NarratorRowNarrator } from "./admin.narrators/_components/NarratorRow";
import { NarratorDialog } from "./admin.narrators/_components/NarratorDialog";

const PAGE_SIZE = 100;

export async function loader({ request }: LoaderFunctionArgs) {
  const token = await requireSessionToken(request);
  const result = await safe(
    gqlClient.request(
      NarratorsFindManyDocument,
      { limit: PAGE_SIZE },
      { "access-token": token },
    ),
  );
  const narrators: NarratorRowNarrator[] = result.ok
    ? (result.data.narratorsFindMany ?? []).filter(
        (n): n is NonNullable<typeof n> => n != null,
      )
    : [];
  return { narrators, error: result.error };
}

export default function AdminNarratorsRoute() {
  const {
    narrators: initialNarrators,
    error: loadError,
  } = useLoaderData<typeof loader>();
  const navigation = useNavigation();

  const [narrators, setNarrators] =
    useState<NarratorRowNarrator[]>(initialNarrators);
  const [createOpen, setCreateOpen] = useState(false);

  // If the loader returns a fresh list (e.g. after revalidation), sync it in.
  useEffect(() => {
    setNarrators(initialNarrators);
  }, [initialNarrators]);

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
              onUpdated={(next) =>
                setNarrators((prev) =>
                  prev.map((p) => (p._id === next._id ? { ...p, ...next } : p)),
                )
              }
              onDeleted={(id) =>
                setNarrators((prev) => prev.filter((p) => p._id !== id))
              }
            />
          ))}
        </div>
      )}

      <NarratorDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={(n) => setNarrators((prev) => [n, ...prev])}
      />
    </div>
  );
}
