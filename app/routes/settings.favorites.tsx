import { useEffect } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { useFetcher, useLoaderData } from "react-router";
import { Heart } from "lucide-react";
import { toast } from "sonner";

import { gqlClient } from "~/lib/graphql";
import { safe } from "~/lib/safe-loader";
import { requireSessionToken } from "~/lib/session.server";
import type { MyLikedClassesQuery } from "~/gql/graphql";
import { MyLikedClassesDocument } from "~/queries/class-likes";
import { ClassLikeDeleteOneDocument } from "~/mutations/class-likes";
import { SectionHeader } from "~/routes/settings/_components/section-header";

// A liked-class record from `MyLikedClasses`, narrowed to the rows that carry a
// resolved `classObj` (the only ones we can render — the list filters the rest
// out in the loader). `class` is the class id used by the unfavorite action.
type LikedClass = NonNullable<
  NonNullable<MyLikedClassesQuery["MyLikedClasses"]>[number]
>;
type FavoriteClass = LikedClass & {
  classObj: NonNullable<LikedClass["classObj"]>;
};

export async function loader({ request }: LoaderFunctionArgs) {
  const token = await requireSessionToken(request);

  const result = await safe(
    gqlClient.request(MyLikedClassesDocument, {}, { "access-token": token }),
  );

  const favorites: FavoriteClass[] = result.ok
    ? (result.data.MyLikedClasses ?? []).filter(
        (l): l is FavoriteClass => Boolean(l?.classObj),
      )
    : [];

  return { favorites, error: result.ok ? null : result.error };
}

// Server-side unfavorite. Uses an EXPLICIT `access-token` header (not the
// in-memory `setToken` client cache the curriculum route relies on) because a
// fresh `/settings/favorites` load has no client token. `safe()` normalizes any
// failure into a user-facing string, which the row toasts on revalidation.
export async function action({ request }: ActionFunctionArgs) {
  const token = await requireSessionToken(request);
  const formData = await request.formData();
  const classId = formData.get("class");

  if (typeof classId !== "string" || !classId) {
    return { error: "Missing class id" };
  }

  const result = await safe(
    gqlClient.request(
      ClassLikeDeleteOneDocument,
      { class: classId },
      { "access-token": token },
    ),
  );

  if (!result.ok) {
    return { error: result.error };
  }

  return { ok: true as const };
}

// One row = one fetcher. Optimistically hides itself while its unfavorite
// mutation is in flight: on success, loader revalidation drops the row for good;
// on failure it reappears (state → idle, no deletion) and the effect toasts.
function FavoriteRow({ favorite }: { favorite: FavoriteClass }) {
  const fetcher = useFetcher<typeof action>();
  const submitting = fetcher.state !== "idle";

  useEffect(() => {
    if (
      fetcher.state === "idle" &&
      fetcher.data &&
      "error" in fetcher.data &&
      fetcher.data.error
    ) {
      toast.error(fetcher.data.error);
    }
  }, [fetcher.state, fetcher.data]);

  if (submitting) return null;

  const { classObj } = favorite;
  const coverUrl = classObj.cover?.url ?? null;
  const title = classObj.title ?? "";

  return (
    <div className="flex items-center gap-4 p-3 rounded-[20px] hover:bg-muted/50 transition-colors">
      {/* Thumbnail (56px). Neutral `bg-muted` tile backs the image / stands in
          when a class has no cover. */}
      <div className="relative w-14 h-14 rounded-[16px] overflow-hidden flex-shrink-0 bg-muted">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : null}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{title}</p>
        {classObj.description ? (
          <p className="text-xs text-muted-foreground line-clamp-1">
            {classObj.description}
          </p>
        ) : null}
      </div>

      {/* Unfavorite */}
      <fetcher.Form method="post">
        <input type="hidden" name="class" value={favorite.class} />
        <button
          type="submit"
          aria-label="Remove from favorites"
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors flex-shrink-0"
        >
          <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
        </button>
      </fetcher.Form>
    </div>
  );
}

export default function SettingsFavoritesRoute() {
  const { favorites, error } = useLoaderData<typeof loader>();

  return (
    <div className="max-w-2xl">
      <SectionHeader
        title="My Favorites"
        subtitle="Practices you've marked as favorites for quick access."
      />

      {error ? (
        <div className="rounded-2xl border-2 border-dashed border-red-200 bg-red-50/70 px-6 py-10 text-center">
          <p className="mb-1 text-sm font-medium text-red-700">
            Couldn't load your favorites
          </p>
          <p className="text-xs text-red-600">{error}</p>
        </div>
      ) : favorites.length > 0 ? (
        <div className="space-y-2">
          {favorites.map((favorite) => (
            <FavoriteRow key={favorite._id ?? favorite.class} favorite={favorite} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-[24px] bg-muted flex items-center justify-center mb-4">
            <Heart className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            No favorites yet
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Tap the heart icon on any practice to add it to your favorites.
          </p>
        </div>
      )}
    </div>
  );
}
