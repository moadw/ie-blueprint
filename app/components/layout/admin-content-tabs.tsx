import { NavLink } from "react-router";
import { Folder, Award } from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { cn } from "~/lib/utils";

type TabDef = {
  to: string;
  end: boolean;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

const TABS: readonly TabDef[] = [
  { to: "/admin/content", end: true, label: "Series & Practices", icon: Folder },
  { to: "/admin/content/achievements", end: false, label: "Achievements Library", icon: Award },
] as const;

export function AdminContentTabs() {
  return (
    <nav>
      <div className="inline-flex h-10 items-center justify-center rounded-[14px] bg-stone-100 p-1 text-muted-foreground">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className={({ isActive }) =>
                cn(
                  "inline-flex items-center justify-center whitespace-nowrap rounded-[12px] px-3 py-1.5 text-sm font-medium transition-all",
                  isActive
                    ? "bg-white text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground",
                )
              }
            >
              <Icon className="mr-2 h-4 w-4" />
              {tab.label}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}

export default AdminContentTabs;
