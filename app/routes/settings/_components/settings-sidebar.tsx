import { NavLink } from "react-router";
import type { LucideIcon } from "lucide-react";
import { User, BookOpen, Heart, BarChart3, Wrench, HelpCircle } from "lucide-react";
import { Logo } from "~/components/ui/logo";
import { cn } from "~/lib/utils";

const NAV_ITEMS: { to: string; label: string; icon: LucideIcon }[] = [
  { to: "/settings/profile", label: "Manage Profile", icon: User },
  { to: "/settings/journals", label: "My Journals", icon: BookOpen },
  { to: "/settings/favorites", label: "My Favorites", icon: Heart },
  { to: "/settings/stats", label: "My Stats", icon: BarChart3 },
  { to: "/settings/toolkit", label: "Toolkit", icon: Wrench },
  { to: "/settings/get-help", label: "Get Help", icon: HelpCircle },
];

export function SettingsSidebar() {
  return (
    <div
      className="w-72 flex flex-col rounded-l-[24px] overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.15) 100%)",
        backdropFilter: "blur(40px) saturate(1.8)",
        WebkitBackdropFilter: "blur(40px) saturate(1.8)",
        borderRight: "1px solid rgba(255, 255, 255, 0.2)",
      }}
    >
      {/* Logo Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center gap-3">
          <Logo variant="white" className="h-8 w-auto opacity-90" />
        </div>
      </div>

      {/* Divider */}
      <div className="mx-4 h-px bg-white/10" />

      {/* Menu Items */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  cn(
                    "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors",
                    isActive
                      ? "text-white bg-white/15"
                      : "text-white/70 hover:text-white hover:bg-white/10",
                  )
                }
              >
                <Icon className="h-[18px] w-[18px] flex-shrink-0" />
                <span className="font-sans">{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
