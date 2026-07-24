import { NavLink, useLocation } from "react-router";
import { cn } from "~/lib/utils";

interface DistrictNavTab {
  to: string;
  label: string;
  /**
   * Extra path prefixes that also count as "active" for this tab, in addition
   * to `to` itself. Used so the "Admin" pill stays highlighted on
   * `/district/school/:id` — a school-admin's "Admin" tab lands there (see
   * `district.admin._index.tsx`), a sibling route outside the
   * `/district/admin` prefix that plain path matching would otherwise miss.
   * A district-admin never navigates to `/district/school/*` from the nav
   * itself, so this is a no-op for that role.
   */
  extraActivePaths?: string[];
}

const TABS: DistrictNavTab[] = [
  { to: "/district/home", label: "Home" },
  {
    to: "/district/admin",
    label: "Admin",
    extraActivePaths: ["/district/school"],
  },
  { to: "/district/analytics", label: "Analytics" },
  // Engagement está oculto temporalmente (la ruta /district/engagement sigue
  // existiendo; solo se quita del nav). Restaurar descomentando esta línea.
  // { to: "/district/engagement", label: "Engagement" },
  { to: "/district/impact", label: "Impact" },
];

/** Same "prefix at a path boundary" match `NavLink`'s own default (`end: false`) uses. */
function matchesPath(pathname: string, base: string): boolean {
  return pathname === base || pathname.startsWith(`${base}/`);
}

export function DistrictNav() {
  const { pathname } = useLocation();
  return (
    <nav className="flex items-center gap-1 overflow-x-auto">
      {TABS.map((tab) => {
        const isActive =
          matchesPath(pathname, tab.to) ||
          (tab.extraActivePaths?.some((p) => matchesPath(pathname, p)) ??
            false);
        return (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={cn(
              "px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-muted",
            )}
          >
            {tab.label}
          </NavLink>
        );
      })}
    </nav>
  );
}

export default DistrictNav;
