import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { useFetcher, useNavigate } from "react-router";
import { LogOut } from "lucide-react";
import { setToken } from "~/lib/auth";
import { Button } from "~/components/ui/button";
import { AdminTabs } from "~/components/layout/admin-tabs";

export interface AdminShellProps {
  children: ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const submittedRef = useRef(false);

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
    <main className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl text-foreground">
              Developer Admin Panel
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Manage content & districts
            </p>
          </div>
          <fetcher.Form method="delete" action="/api/session">
            <Button type="submit" variant="ghost">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </fetcher.Form>
        </header>
        <AdminTabs />
        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          {children}
        </section>
      </div>
    </main>
  );
}

export default AdminShell;
