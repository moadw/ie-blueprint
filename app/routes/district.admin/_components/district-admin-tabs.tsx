import { NavLink } from "react-router";
import { cn } from "~/lib/utils";

const TABS = [
  { to: "/district/admin/schools", label: "Schools" },
  { to: "/district/admin/users", label: "Users" },
] as const;

export function DistrictAdminTabs() {
  return (
    <nav className="flex items-center gap-1">
      {TABS.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          className={({ isActive }) =>
            cn(
              "px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-muted",
            )
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </nav>
  );
}

export default DistrictAdminTabs;
