import { NavLink } from "react-router";
import { cn } from "~/lib/utils";

const TABS = [
  { to: "/district/home", label: "Home" },
  { to: "/district/admin", label: "Admin" },
  { to: "/district/analytics", label: "Analytics" },
  { to: "/district/engagement", label: "Engagement" },
  { to: "/district/impact", label: "Impact" },
] as const;

export function DistrictNav() {
  return (
    <nav className="flex items-center gap-1 overflow-x-auto">
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

export default DistrictNav;
