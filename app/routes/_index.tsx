import { useEffect, useRef } from "react";
import {
  useFetcher,
  useLoaderData,
  useNavigate,
} from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { setToken } from "~/lib/auth";
import { requireSessionToken } from "~/lib/session.server";
import { Button } from "~/components/ui/button";
import { useCurrentUser } from "~/hooks/use-current-user";

export async function loader({ request }: LoaderFunctionArgs) {
  const token = await requireSessionToken(request);
  return { token };
}

export default function HomeRoute() {
  const { token } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const submittedRef = useRef(false);

  useEffect(() => {
    setToken(token);
  }, [token]);

  const { data: user, isLoading } = useCurrentUser();

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
      <h1 className="text-2xl font-semibold">
        {isLoading ? "Loading…" : `Hi, ${user?.firstName ?? "there"}`}
      </h1>
      <fetcher.Form method="delete" action="/api/session" className="mt-8">
        <Button type="submit" variant="ghost">
          Log out
        </Button>
      </fetcher.Form>
    </main>
  );
}
