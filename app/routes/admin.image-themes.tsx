import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { requireSessionToken } from "~/lib/session.server";
import { env } from "~/lib/env";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireSessionToken(request);
  if (!env.PLATFORM) {
    return {
      error: "Platform is not configured. Please contact your administrator.",
    };
  }
  return { error: null as string | null };
}

export default function AdminImageThemesRoute() {
  const { error } = useLoaderData<typeof loader>();
  if (error) {
    return (
      <div className="rounded-xl border-2 border-dashed border-red-200 bg-red-50 py-10 text-center">
        <p className="mb-1 text-sm font-medium text-red-700">
          Couldn't load image themes
        </p>
        <p className="text-xs text-red-600">{error}</p>
      </div>
    );
  }
  return (
    <div className="py-12 text-center text-muted-foreground">
      Image Themes — coming soon
    </div>
  );
}
