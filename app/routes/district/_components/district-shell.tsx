import type { ReactNode } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Bell } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Logo } from "~/components/ui/logo";
import type { UserDistrictFindOneQuery } from "~/gql/graphql";
import { DistrictNav } from "~/routes/district/_components/district-nav";

export interface DistrictShellProps {
  district: UserDistrictFindOneQuery["UserDistrictFindOne"] | null;
  children: ReactNode;
}

export function DistrictShell({ children }: DistrictShellProps) {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white">
      <header className="flex items-center justify-between px-4 md:px-6 h-16 bg-white border-b border-border shrink-0">
        <div className="flex items-center gap-4 md:gap-8 min-w-0">
          <Logo className="h-8 shrink-0" />
          <DistrictNav />
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Button
            size="sm"
            className="h-9 px-3 gap-1.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium"
            onClick={() => navigate("/classrooms")}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Return to Platform</span>
          </Button>
          <button
            type="button"
            className="p-2 rounded-full hover:bg-muted transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-muted-foreground" />
          </button>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
            DA
          </div>
        </div>
      </header>
      <div className="flex-1 min-h-0 overflow-auto">{children}</div>
    </div>
  );
}

export default DistrictShell;
