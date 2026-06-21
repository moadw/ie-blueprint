import { useFetcher } from "react-router";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

function GoogleIcon({ active }: { active?: boolean }) {
  return (
    <svg
      className={`w-5 h-5 ${active ? "" : "opacity-50"}`}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

const ssoBase =
  "w-full h-[52px] backdrop-blur-sm rounded-full text-[15px] font-medium flex items-center justify-center gap-3 transition-all shadow-sm cursor-not-allowed disabled:opacity-100";

// Enabled variant: clickable, full-opacity white card, focus ring (mirrors the
// anchor variant in sso-buttons.tsx, adapted for a <button>).
const ssoEnabledBase =
  "w-full h-[52px] backdrop-blur-sm rounded-full text-[15px] font-medium flex items-center justify-center gap-3 transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:opacity-90 disabled:opacity-70 disabled:cursor-not-allowed";

/**
 * Google SSO button. When `enabled`, clicking opens the Firebase Google popup
 * (client-only — the popup module is imported lazily inside the click handler so
 * Firebase never loads on the server), extracts the Google ID token, and submits
 * it to the login action via a fetcher (`intent=google`). Errors surface through
 * the action's `Response.json` payload (the fetcher's data → toast path), while
 * popup failures (user-closed/blocked) toast directly here.
 *
 * When `enabled` is false, renders the disabled "Coming Soon" button with no
 * popup wiring.
 */
export function GoogleSSOButton({ enabled }: { enabled: boolean }) {
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state !== "idle";

  if (!enabled) {
    return (
      <button
        type="button"
        disabled
        className={`${ssoBase} bg-card/60 border border-border/50 text-foreground/50`}
      >
        <GoogleIcon />
        Google Coming Soon
      </button>
    );
  }

  const onClick = async () => {
    try {
      // Lazy client-only import: keeps Firebase out of the server bundle and
      // ensures it only initializes on the browser click path.
      const { signInWithGooglePopup } = await import("~/lib/firebase.client");
      const token = await signInWithGooglePopup();
      if (!token) {
        toast.error("We couldn't sign you in with Google. Please try again.");
        return;
      }
      fetcher.submit(
        { intent: "google", token },
        { method: "post", action: "/login" },
      );
    } catch {
      // User closed/blocked the popup, or it failed to open.
      toast.error("Google sign-in was cancelled. Please try again.");
    }
  };

  return (
    <button
      type="button"
      onClick={() => void onClick()}
      disabled={isSubmitting}
      className={`${ssoEnabledBase} bg-card border border-border text-foreground`}
    >
      {isSubmitting ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <GoogleIcon active />
      )}
      Continue with Google
    </button>
  );
}
