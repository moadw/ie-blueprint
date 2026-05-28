import { ChevronLeft } from "lucide-react";
import { Link, useLoaderData } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { gqlClient } from "~/lib/graphql";
import { safe } from "~/lib/safe-loader";
import { requireSessionToken } from "~/lib/session.server";
import { UsersFindOneDocument } from "~/queries/users";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const token = await requireSessionToken(request);
  const id = params.id;
  if (!id) {
    return { user: null, error: "Missing user id" } as const;
  }
  const result = await safe(
    gqlClient.request(
      UsersFindOneDocument,
      { _id: id },
      { "access-token": token },
    ),
  );
  if (!result.ok) {
    return { user: null, error: result.error } as const;
  }
  return { user: result.data.UsersFindOne ?? null, error: null } as const;
}

export default function AdminUserDetail() {
  const { user, error } = useLoaderData<typeof loader>();
  const firstInitial = user?.firstName?.[0] ?? "";
  const lastInitial = user?.lastName?.[0] ?? "";
  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/admin/users"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" aria-hidden="true" />
          Back to users
        </Link>
      </div>

      {error ? (
        <div className="rounded-xl border-2 border-dashed border-red-200 bg-red-50 py-10 text-center">
          <p className="mb-1 text-sm font-medium text-red-700">
            Couldn't load user
          </p>
          <p className="text-xs text-red-600">{error}</p>
        </div>
      ) : !user ? (
        <div className="rounded-xl border border-border bg-card py-10 text-center">
          <p className="text-sm text-muted-foreground">User not found.</p>
        </div>
      ) : (
        <div className="bg-card rounded-[14px] border border-border p-6 space-y-4">
          <header className="flex items-center gap-4">
            {user.profilePicture?.url ? (
              <img
                src={user.profilePicture.url}
                alt=""
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                {firstInitial}
                {lastInitial}
              </div>
            )}
            <div>
              <h2 className="font-serif text-2xl text-foreground">
                {user.firstName ?? ""} {user.lastName ?? ""}
              </h2>
              <p className="text-sm text-muted-foreground">
                {user.email ?? "—"}
              </p>
            </div>
          </header>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-muted-foreground">Username</dt>
              <dd>{user.userName ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">User type id</dt>
              <dd>{user.type ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Type identifier</dt>
              <dd>{user.typeObj?.identifier ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Organization</dt>
              <dd>{user.organization ?? "—"}</dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  );
}
