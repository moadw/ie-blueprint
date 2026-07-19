import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { Logo } from "~/components/ui/logo";
import { AnnouncementBar } from "~/components/ui/announcement-bar";
import type { UserDistrictFindOneQuery } from "~/gql/graphql";
import { DistrictNav } from "~/routes/district/_components/district-nav";
import {
  DistrictAccountMenu,
  type DistrictAccountMenuUser,
} from "~/routes/district/_components/district-account-menu";

export interface DistrictShellProps {
  district: UserDistrictFindOneQuery["UserDistrictFindOne"] | null;
  user?: DistrictAccountMenuUser | null;
  announcement?: { _id: string; message?: string | null } | null;
  /** Master-admin preview: when `active`, show the "Back to CMS" exit control. */
  preview?: { active: boolean; districtName?: string | null };
  children: ReactNode;
}

export function DistrictShell({
  user,
  announcement,
  preview,
  children,
}: DistrictShellProps) {
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white print:h-auto print:overflow-visible">
      {announcement ? (
        <div className="shrink-0 print:hidden">
          <AnnouncementBar
            id={announcement._id}
            message={announcement.message ?? ""}
          />
        </div>
      ) : null}
      <header className="flex items-center justify-between px-4 md:px-6 h-16 bg-white border-b border-border shrink-0 print:hidden">
        <div className="flex items-center gap-4 md:gap-8 min-w-0">
          <Link
            to="/district/home"
            aria-label="Inner Explorer — District home"
            className="shrink-0 rounded-lg hover:opacity-90 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          >
            <Logo className="h-8 shrink-0" />
          </Link>
          <DistrictNav />
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {preview?.active ? (
            <Button
              size="sm"
              className="gap-1.5 rounded-full"
              aria-label="Back to CMS"
              onClick={() => window.location.assign("/preview/exit")}
            >
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="hidden md:inline">Back to CMS</span>
            </Button>
          ) : null}
          <DistrictAccountMenu user={user} />
        </div>
      </header>
      <div className="flex-1 min-h-0 overflow-auto print:overflow-visible">{children}</div>
    </div>
  );
}

export default DistrictShell;
