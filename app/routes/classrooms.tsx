import { useEffect } from "react";
import { Link, redirect, useLoaderData } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { Plus } from "lucide-react";
import { setToken } from "~/lib/auth";
import { gqlClient } from "~/lib/graphql";
import { requireSessionToken } from "~/lib/session.server";
import { homePathForIdentifier } from "~/lib/user";
import { getInitials } from "~/lib/initials";
import { UsersFindOneDocument } from "~/queries/users";
import { GroupFindManyDocument } from "~/queries/groups";
import { CircleTile } from "~/components/ui/circle-tile";
import glassBackground from "~/assets/glass-background.webp";

export async function loader({ request }: LoaderFunctionArgs) {
  const token = await requireSessionToken(request);
  const userData = await gqlClient.request(
    UsersFindOneDocument,
    {},
    { "access-token": token },
  );
  const user = userData.UsersFindOne ?? null;

  if (user?.typeObj?.identifier !== "teacher") {
    throw redirect(homePathForIdentifier(user?.typeObj?.identifier));
  }

  const groupsData = await gqlClient.request(
    GroupFindManyDocument,
    { filter: { manager: user._id } },
    { "access-token": token },
  );
  const groups = (groupsData.GroupFindMany ?? []).filter(
    (g): g is NonNullable<typeof g> => g != null,
  );

  if (groups.length === 0) {
    throw redirect("/classroom/create");
  }

  return { token, user, groups };
}

export default function ClassroomsRoute() {
  const { token, groups } = useLoaderData<typeof loader>();

  useEffect(() => {
    setToken(token);
  }, [token]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50">
      <img
        src={glassBackground}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover opacity-70"
      />
      <div className="absolute inset-0 bg-white/30" />
      <div className="relative flex min-h-screen flex-col items-center justify-center px-6">
        <h1 className="mb-16 text-4xl font-light tracking-tight text-gray-700 md:text-5xl">
          Select a classroom
        </h1>
        <div className="flex flex-col items-center gap-8 md:flex-row md:gap-10">
          {groups.map((g) => (
            <Link
              key={g._id}
              to={`/classrooms/${g._id}`}
              className="flex flex-col items-center gap-3"
            >
              <CircleTile
                variant="filled"
                initials={getInitials(g.name ?? "")}
              />
              <span className="text-sm text-muted-foreground">{g.name}</span>
            </Link>
          ))}
          <Link
            to="/classroom/create"
            className="flex flex-col items-center gap-3"
          >
            <CircleTile
              variant="dashed"
              icon={<Plus className="h-8 w-8" />}
              aria-label="Create new classroom"
            />
            <span className="text-sm text-muted-foreground">Create New</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
