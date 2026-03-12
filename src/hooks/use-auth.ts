"use client";

import { useEffect } from "react";
import { useSession, signIn, signUp, signOut } from "@/lib/auth-client";
import { useProfile } from "@/hooks/use-profile";
import { CURRENT_POLICY_VERSION } from "@/lib/validations";
import { toast } from "sonner";

function wrapResult(
  result: { error?: { message?: string } | null },
  fallback: string,
): { error: Error | null } {
  if (result.error) return { error: new Error(result.error.message ?? fallback) };
  return { error: null };
}

/** Build consent payload for API — all 3 types are mandatory (UI enforces both checkboxes). */
function buildConsentPayload() {
  return {
    consents: [
      { type: "privacy" as const, policyVersion: CURRENT_POLICY_VERSION },
      { type: "terms" as const, policyVersion: CURRENT_POLICY_VERSION },
      { type: "cross_border" as const, policyVersion: CURRENT_POLICY_VERSION },
    ],
  };
}

// i18n key: consentRecordFailed (added to i18n.tsx ko+en)
// Hook cannot stably reference t() in useEffect deps, so use constant here.
const CONSENT_RECORD_FAILED = "동의 기록 저장에 실패했습니다. 다시 시도해주세요.";

/** Record consents to server. Returns true on success. */
async function recordConsents(payload: ReturnType<typeof buildConsentPayload>) {
  const res = await fetch("/api/consent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.ok;
}

const PENDING_CONSENTS_KEY = "ourfolio_pending_consents";

export function useAuth() {
  const { data: session, isPending } = useSession();
  const user = session?.user ?? null;
  const { profile, loading: profileLoading, refreshProfile } = useProfile(user?.id);

  // Process pending consents from Google OAuth signup redirect
  useEffect(() => {
    if (!user) return;
    const pending = localStorage.getItem(PENDING_CONSENTS_KEY);
    if (!pending) return;
    localStorage.removeItem(PENDING_CONSENTS_KEY);
    try {
      const payload = JSON.parse(pending);
      recordConsents(payload).then((ok) => {
        if (!ok) toast.warning(CONSENT_RECORD_FAILED);
      }).catch(() => {
        toast.warning(CONSENT_RECORD_FAILED);
      });
    } catch {
      // Invalid JSON, ignore
    }
  }, [user?.id]);

  const handleSignIn = async (email: string, password: string) =>
    wrapResult(await signIn.email({ email, password }), "Sign in failed");

  const handleSignUp = async (
    email: string,
    password: string,
    name: string,
    recordConsent?: boolean,
  ) => {
    const result = wrapResult(
      await signUp.email({ email, password, name }),
      "Sign up failed",
    );

    // Record consents after successful signup (blocking — legally required)
    if (!result.error && recordConsent) {
      const payload = buildConsentPayload();
      const ok = await recordConsents(payload).catch(() => false);
      if (!ok) toast.warning(CONSENT_RECORD_FAILED);
    }

    return result;
  };

  const handleSignInWithGoogle = async (recordConsent?: boolean) => {
    // Save consent payload to localStorage before Google redirect.
    // Recorded after the redirect callback via useEffect above.
    if (recordConsent) {
      const payload = buildConsentPayload();
      localStorage.setItem(PENDING_CONSENTS_KEY, JSON.stringify(payload));
    }
    return wrapResult(
      await signIn.social({ provider: "google", callbackURL: "/dashboard" }),
      "Google sign in failed",
    );
  };

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/auth";
  };

  return {
    user,
    session,
    profile,
    loading: isPending || profileLoading,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signInWithGoogle: handleSignInWithGoogle,
    signOut: handleSignOut,
    refreshProfile,
  };
}
