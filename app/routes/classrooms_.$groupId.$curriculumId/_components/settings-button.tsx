import { useState } from "react";
import { useRevalidator, useRouteLoaderData } from "react-router";
import { Check, ChevronRight, Globe, GraduationCap, Settings } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { setLanguage } from "~/lib/language";
import type { loader as rootLoader } from "~/root";

// Glass-theme literals ported verbatim from the prototype's `ThemedNavbar`
// settings menu (glass branch only — light/dark theming is out of scope, so we
// drop the prototype's theme-conditional style objects).
const GEAR_BG = "rgba(255, 255, 255, 0.15)";
const GEAR_BORDER = "1px solid rgba(255, 255, 255, 0.25)";
const GEAR_SHADOW =
  "inset 0 1px 0 rgba(255,255,255,0.3), 0 4px 16px rgba(0, 0, 0, 0.1)";
const MENU_BG =
  "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)";
const MENU_BORDER = "1px solid rgba(255, 255, 255, 0.3)";
const MENU_SHADOW =
  "inset 0 1px 1px rgba(255,255,255,0.4), 0 8px 32px rgba(0, 0, 0, 0.2)";

const LANGUAGES = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Español", flag: "🇪🇸" },
] as const;

const MENU_STYLE = {
  background: MENU_BG,
  backdropFilter: "blur(40px) saturate(1.8)",
  WebkitBackdropFilter: "blur(40px) saturate(1.8)",
  border: MENU_BORDER,
  boxShadow: MENU_SHADOW,
} as const;

/**
 * Fixed bottom-left glass settings gear. Opens a Radix `Popover` (top/start)
 * with Change Classroom and a nested Language submenu (opens to the right).
 * The gear rotates 90° on open and the Language submenu check-marks the active
 * language (read from the root loader's cookie-backed `lang`). Selecting a
 * language persists the cookie and revalidates so every loader re-reads it.
 * Change Classroom remains a no-op for now.
 */
export function SettingsButton() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { lang } = useRouteLoaderData<typeof rootLoader>("root") ?? {
    lang: "en" as const,
  };
  const revalidator = useRevalidator();

  return (
    <Popover open={settingsOpen} onOpenChange={setSettingsOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          title="Settings"
          aria-label="Open settings"
          className="fixed bottom-4 left-4 z-[100] rounded-full p-2.5 transition-all duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          style={{
            background: GEAR_BG,
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: GEAR_BORDER,
            boxShadow: GEAR_SHADOW,
          }}
        >
          <Settings
            className={`h-5 w-5 text-white/80 transition-transform duration-300 ${
              settingsOpen ? "rotate-90" : ""
            }`}
          />
        </button>
      </PopoverTrigger>

      <PopoverContent
        side="top"
        align="start"
        sideOffset={12}
        className="z-[101] w-56 rounded-[16px] p-2 text-white"
        style={MENU_STYLE}
      >
        <div className="flex flex-col gap-1">
          {/* Change Classroom */}
          <button
            type="button"
            onClick={() => {
              // TODO(settings): switch the active classroom.
            }}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/90 transition-colors duration-200 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          >
            <GraduationCap className="h-4 w-4 flex-shrink-0 text-white/70" />
            <span className="flex-1 text-left">Change Classroom</span>
            <ChevronRight className="h-4 w-4 flex-shrink-0 text-white/40" />
          </button>

          {/* Language submenu */}
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/90 transition-colors duration-200 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              >
                <Globe className="h-4 w-4 flex-shrink-0 text-white/70" />
                <span className="flex-1 text-left">Language</span>
                <span className="text-xs text-white/70">
                  {LANGUAGES.find((l) => l.code === lang)?.flag}
                </span>
                <ChevronRight className="h-4 w-4 flex-shrink-0 text-white/40" />
              </button>
            </PopoverTrigger>
            <PopoverContent
              side="right"
              align="start"
              sideOffset={8}
              className="z-[102] w-40 rounded-[12px] p-2 text-white"
              style={MENU_STYLE}
            >
              <div className="flex flex-col gap-1">
                {LANGUAGES.map((option) => (
                  <button
                    key={option.code}
                    type="button"
                    onClick={() => {
                      setLanguage(option.code);
                      revalidator.revalidate();
                      setSettingsOpen(false);
                    }}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white/90 transition-colors duration-200 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                  >
                    <span>{option.flag}</span>
                    <span className="flex-1 text-left">{option.name}</span>
                    {option.code === lang ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : null}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </PopoverContent>
    </Popover>
  );
}
