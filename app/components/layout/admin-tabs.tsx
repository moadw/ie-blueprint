import { NavLink } from "react-router";
import { cn } from "~/lib/utils";

const TABS = [
  { to: "/admin/content", label: "Content" },
  { to: "/admin/classrooms", label: "User Classrooms" },
  { to: "/admin/experiences", label: "Experiences" },
  { to: "/admin/narrators", label: "Narrators" },
  { to: "/admin/districts", label: "Districts" },
  { to: "/admin/image-themes", label: "Image Themes" },
] as const;

export function AdminTabs() {
  return (
    <nav>
      <div className="inline-flex h-10 items-center rounded-md border border-border bg-card p-1 shadow-sm">
        {TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-foreground text-background shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export default AdminTabs;
