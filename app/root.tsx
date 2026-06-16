import { useEffect } from "react";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

import type { Route } from "./+types/root";
import stylesheet from "~/styles/app.css?url";
import { setToken } from "~/lib/auth";
import { getSessionToken } from "~/lib/session.server";
import { AmplitudeAnalytics } from "~/components/analytics/amplitude-analytics";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, retry: 1 } },
});

export const links: Route.LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Instrument+Serif:ital@0;1&display=swap",
  },
];

export async function loader({ request }: Route.LoaderArgs) {
  // Surface the cookie session token so the client can hydrate the in-memory
  // token (read by gqlClient's middleware for client-side mutations). Returned
  // here rather than fetched once on mount so it stays correct across SPA
  // navigations — notably the post-login redirect, after which the root loader
  // revalidates and the token flips from null to the real value.
  return { accessToken: await getSessionToken(request) };
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const { accessToken } = useLoaderData<typeof loader>();

  // Keep the in-memory client token in sync with the cookie session. Keyed on
  // `accessToken` so it re-runs whenever the root loader revalidates (e.g. the
  // post-login redirect / logout) — not only on the first document mount, which
  // is why client-side mutations previously failed until a hard reload.
  useEffect(() => {
    setToken(accessToken);
  }, [accessToken]);

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster richColors position="top-center" />
      <AmplitudeAnalytics />
    </QueryClientProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
