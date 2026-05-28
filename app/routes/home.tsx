import { useEffect, useRef } from "react";
import {
  useFetcher,
  useLoaderData,
  useNavigate,
} from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { setToken } from "~/lib/auth";
import { gqlClient } from "~/lib/graphql";
import { requireSessionToken } from "~/lib/session.server";
import { UsersFindOneDocument } from "~/queries/users";
import { Button } from "~/components/ui/button";

export async function loader({ request }: LoaderFunctionArgs) {
  const token = await requireSessionToken(request);
  const data = await gqlClient.request(
    UsersFindOneDocument,
    {},
    { "access-token": token },
  );
  return { token, user: data.UsersFindOne ?? null };
}

export default function HomeRoute() {
  const { token, user } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const submittedRef = useRef(false);

  useEffect(() => {
    setToken(token);
  }, [token]);

  useEffect(() => {
    if (fetcher.state === "submitting") {
      submittedRef.current = true;
      return;
    }
    if (fetcher.state === "idle" && submittedRef.current) {
      submittedRef.current = false;
      setToken(null);
      navigate("/login");
    }
  }, [fetcher.state, navigate]);

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-semibold text-foreground">Home</h1>
      <p className="mt-4 text-foreground">
        Hi, {user?.firstName ?? "there"}
      </p>
      <fetcher.Form method="delete" action="/api/session" className="mt-8">
        <Button type="submit" variant="ghost">
          Log out
        </Button>
      </fetcher.Form>
    </main>
  );
}
