import { useEffect, useState } from "react";
import {
  Link,
  redirect,
  useLoaderData,
  useNavigate,
  useRevalidator,
} from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { setToken } from "~/lib/auth";
import { toErrorMessage } from "~/lib/errors";
import { gqlClient } from "~/lib/graphql";
import { safe } from "~/lib/safe-loader";
import { requireSessionToken } from "~/lib/session.server";
import { homePathForIdentifier } from "~/lib/user";
import { UsersFindOneDocument } from "~/queries/users";
import { GroupFindManyDocument } from "~/queries/groups";
import type { GroupFindManyQuery } from "~/gql/graphql";
import { ClassesDeleteOneDocument } from "~/mutations/classes";
import { CircleTile } from "~/components/ui/circle-tile";
import { ClassroomCard } from "./classrooms/_components/classroom-card";
import glassBackground from "~/assets/glass-background.webp";

type ClassroomGroup = NonNullable<
  NonNullable<GroupFindManyQuery["GroupFindMany"]>[number]
>;

export async function loader({ request }: LoaderFunctionArgs) {
  const token = await requireSessionToken(request);

  const userResult = await safe(
    gqlClient.request(UsersFindOneDocument, {}, { "access-token": token }),
  );
  if (!userResult.ok) {
    return {
      token,
      groups: [] as ClassroomGroup[],
      error: userResult.error,
    };
  }

  const user = userResult.data.UsersFindOne ?? null;
  if (user?.typeObj?.identifier !== "teacher") {
    throw redirect(homePathForIdentifier(user?.typeObj?.identifier));
  }

  const groupsResult = await safe(
    gqlClient.request(
      GroupFindManyDocument,
      { filter: { manager: user._id } },
      { "access-token": token },
    ),
  );
  const groups = groupsResult.ok
    ? (groupsResult.data.GroupFindMany ?? []).filter(
        (g): g is NonNullable<typeof g> => g != null,
      )
    : [];

  // Zero-groups redirect only on a successful fetch — never when the request
  // errored (show the error card instead).
  if (groupsResult.ok && groups.length === 0) {
    throw redirect("/classrooms/create");
  }

  return {
    token,
    groups,
    error: groupsResult.ok ? null : groupsResult.error,
  };
}

export default function ClassroomsRoute() {
  const { token, groups, error } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const revalidator = useRevalidator();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    setToken(token);
  }, [token]);

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await gqlClient.request(
        ClassesDeleteOneDocument,
        { _id: id },
        { "access-token": token },
      );
      toast.success("Classroom deleted");
      revalidator.revalidate();
    } catch (err) {
      toast.error(toErrorMessage(err, "Failed to delete classroom"));
    } finally {
      setDeletingId(null);
    }
  }

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

        {error ? (
          <div className="rounded-2xl border-2 border-dashed border-red-200 bg-red-50/70 px-8 py-10 text-center backdrop-blur-sm">
            <p className="mb-1 text-sm font-medium text-red-700">
              Couldn't load your classrooms
            </p>
            <p className="text-xs text-red-600">{error}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-8 md:gap-10">
            <div className="flex flex-col items-center gap-8 md:flex-row md:gap-10">
              {groups.map((g, i) => (
                <ClassroomCard
                  key={g._id}
                  name={g.name ?? ""}
                  index={i}
                  onSelect={() => {
                    const firstCurriculumId = g.curriculums?.[0];
                    if (!firstCurriculumId) {
                      toast.error(
                        "This Classroom does not have any series assigned.",
                      );
                      return;
                    }
                    navigate(`/classrooms/${g._id}/${firstCurriculumId}`);
                  }}
                  onDelete={() => handleDelete(g._id)}
                  deleting={deletingId === g._id}
                />
              ))}
            </div>
            <Link
              to="/classrooms/create"
              className="mt-4 flex flex-col items-center gap-3"
            >
              <CircleTile
                variant="dashed"
                icon={<Plus className="h-8 w-8" />}
                aria-label="Create new classroom"
              />
              <span className="text-sm text-muted-foreground">Create New</span>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
