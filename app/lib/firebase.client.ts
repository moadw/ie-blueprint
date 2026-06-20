import { initializeApp, getApps, getApp } from "firebase/app";
import type { FirebaseApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { env } from "~/lib/env";

/**
 * Client-only Firebase module for Google SSO.
 *
 * Env-driven (NOT hard-coded like MTW's `sso.ts`): the config comes from the
 * four `VITE_FIREBASE_*` vars surfaced on `env`. The `.client.ts` suffix keeps
 * this out of the server bundle, and initialization is lazy (only on the click
 * path), so Firebase never runs during SSR.
 */

/** True only when all four Firebase config vars are present. */
export function isFirebaseConfigured(): boolean {
  return Boolean(
    env.FIREBASE_API_KEY &&
      env.FIREBASE_AUTH_DOMAIN &&
      env.FIREBASE_PROJECT_ID &&
      env.FIREBASE_APP_ID,
  );
}

/**
 * Build the Firebase config from env, narrowing each optional var to a string.
 * Throws if any are missing — callers guard via `isFirebaseConfigured()` / the
 * `enabled` prop, so this only fires on a misconfiguration.
 */
function firebaseConfig() {
  const {
    FIREBASE_API_KEY: apiKey,
    FIREBASE_AUTH_DOMAIN: authDomain,
    FIREBASE_PROJECT_ID: projectId,
    FIREBASE_APP_ID: appId,
  } = env;
  if (!apiKey || !authDomain || !projectId || !appId) {
    throw new Error("Firebase is not configured");
  }
  return { apiKey, authDomain, projectId, appId };
}

function getFirebaseApp(): FirebaseApp {
  return getApps().length ? getApp() : initializeApp(firebaseConfig());
}

/**
 * Open the Google account-chooser popup and return the Google **ID token**
 * (a JWT) for exchange at `webapi/signup-google`.
 *
 * Uses the documented `GoogleAuthProvider.credentialFromResult(result).idToken`
 * API. Only if that yields no `idToken` on the installed SDK version do we fall
 * back to the internal `result._tokenResponse.oauthIdToken` (MTW's path) — and
 * we log which path produced the token so bring-up can confirm the contract.
 *
 * Returns `undefined` if neither path yields a token (caller should bail).
 */
export async function signInWithGooglePopup(): Promise<string | undefined> {
  const auth = getAuth(getFirebaseApp());
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });

  const result = await signInWithPopup(auth, provider);

  const cred = GoogleAuthProvider.credentialFromResult(result);
  const idToken = cred?.idToken;
  if (idToken) {
    console.info("[firebase] Google ID token via credentialFromResult");
    return idToken;
  }

  // Fallback: internal token-response field (varies by SDK version).
  const fallback = (
    result as { _tokenResponse?: { oauthIdToken?: string } }
  )._tokenResponse?.oauthIdToken;
  if (fallback) {
    console.info("[firebase] Google ID token via _tokenResponse.oauthIdToken");
    return fallback;
  }

  console.warn("[firebase] no Google ID token in popup result");
  return undefined;
}
