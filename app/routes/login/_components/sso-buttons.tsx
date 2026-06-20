import { Divider } from "~/components/ui/divider";
import { GoogleSSOButton } from "./google-sso-button";

type SsoConfig = {
  google: { enabled: boolean };
  clever: { enabled: boolean };
  classlink: { enabled: boolean };
};

const DISABLED_SSO: SsoConfig = {
  google: { enabled: false },
  clever: { enabled: false },
  classlink: { enabled: false },
};

function ClassLinkIcon({ active }: { active?: boolean }) {
  return (
    <svg
      className={`w-5 h-5 ${active ? "" : "opacity-50"}`}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  );
}

function CleverIcon({ active }: { active?: boolean }) {
  return (
    <svg
      className={`w-5 h-5 ${active ? "" : "opacity-50"}`}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
    </svg>
  );
}

const ssoBase =
  "w-full h-[52px] backdrop-blur-sm rounded-full text-[15px] font-medium flex items-center justify-center gap-3 transition-all shadow-sm cursor-not-allowed disabled:opacity-100";

// Enabled (anchor) variant: clickable, full-opacity brand fill, focus ring.
const ssoLinkBase =
  "w-full h-[52px] backdrop-blur-sm rounded-full text-[15px] font-medium flex items-center justify-center gap-3 transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:opacity-90";

export function SSOButtons({ sso = DISABLED_SSO }: { sso?: SsoConfig }) {
  return (
    <>
      <div className="space-y-3 mb-6">
        <GoogleSSOButton enabled={sso.google.enabled} />
        {sso.classlink.enabled ? (
          <a
            href="/auth/classlink/start"
            className={`${ssoLinkBase} bg-[#0066CC] text-white`}
          >
            <ClassLinkIcon active />
            Continue with ClassLink
          </a>
        ) : (
          <button
            type="button"
            disabled
            className={`${ssoBase} bg-[#0066CC]/30 text-white/50`}
          >
            <ClassLinkIcon />
            ClassLink Coming Soon
          </button>
        )}
        {sso.clever.enabled ? (
          <a
            href="/auth/clever/start"
            className={`${ssoLinkBase} bg-[#4274F6] text-white`}
          >
            <CleverIcon active />
            Continue with Clever
          </a>
        ) : (
          <button
            type="button"
            disabled
            className={`${ssoBase} bg-[#4274F6]/30 text-white/50`}
          >
            <CleverIcon />
            Clever Coming Soon
          </button>
        )}
      </div>
      <Divider label="or" />
    </>
  );
}
