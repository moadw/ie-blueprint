import type { Lang } from "~/lib/language";
import { cn } from "~/lib/utils";

export interface LanguageSelectProps {
  value: Lang;
  onChange: (lang: Lang) => void;
}

const LANGUAGES: { code: Lang; name: string }[] = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
];

/**
 * Step-2 language radio group, ported from the prototype's `LanguageSelector`:
 * two options in a horizontal row, each a custom-drawn radio dot (the native
 * input is `sr-only`, kept for keyboard/focus via the `peer` ring). Controlled
 * via `value` / `onChange`. The value is the app's global language code
 * (`en`/`es`), so the create flow persists it as the teacher's global
 * preference on submit.
 */
export function LanguageSelect({ value, onChange }: LanguageSelectProps) {
  return (
    <div className="flex items-center gap-6 sm:gap-8">
      {LANGUAGES.map((lang) => {
        const selected = value === lang.code;
        return (
          <label
            key={lang.code}
            className="flex cursor-pointer items-center gap-2"
          >
            <span className="relative flex">
              <input
                type="radio"
                name="language"
                value={lang.code}
                checked={selected}
                onChange={() => onChange(lang.code)}
                className="peer sr-only"
              />
              <span
                className={cn(
                  "block h-4 w-4 rounded-full border-2 transition-colors duration-200 peer-focus-visible:ring-2 peer-focus-visible:ring-primary/50 peer-focus-visible:ring-offset-1",
                  selected ? "border-primary" : "border-muted-foreground/40",
                )}
              >
                {selected ? (
                  <span className="absolute inset-1 rounded-full bg-primary" />
                ) : null}
              </span>
            </span>
            <span
              className={cn(
                "text-sm transition-colors duration-200 sm:text-base",
                selected ? "font-medium text-primary" : "text-foreground",
              )}
            >
              {lang.name}
            </span>
          </label>
        );
      })}
    </div>
  );
}
