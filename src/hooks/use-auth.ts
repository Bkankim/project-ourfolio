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

/** Build consent payload for API. */
function buildConsentPayload(crossBorder: boolean) {
  return {
    consents: [
      { type: "privacy" as const, policyVersion: CURRENT_POLICY_VERSION },
      { type: "terms" as const, policyVersion: CURRENT_POLICY_VERSION },
      ...(crossBorder
        ? [{ type: "cross_border" as const, policyVersion: CURRENT_POLICY_VERSION }]
        : []),
    ],
  };
}

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
      recordConsents(payload).catch(() => {});
    } catch {
      // Invalid JSON, ignore
    }
  }, [user]);

  const handleSignIn = async (email: string, password: string) =>
    wrapResult(await signIn.email({ email, password }), "Sign in failed");

  const handleSignUp = async (
    email: string,
    password: string,
    name: string,
    consentFlags?: { privacy: boolean; crossBorder: boolean },
  ) => {
    const result = wrapResult(
      await signUp.email({ email, password, name }),
      "Sign up failed",
    );

    // Record consents after successful signup (blocking — legally required)
    if (!result.error && consentFlags) {
      const payload = buildConsentPayload(consentFlags.crossBorder);
      const ok = await recordConsents(payload).catch(() => false);
      if (!ok) {
        toast.warning("동의 기록 저장에 실패했습니다. 다시 시도해주세요.");
      }
    }

    return result;
  };

  const handleSignInWithGoogle = async (
    consentFlags?: { privacy: boolean; crossBorder: boolean },
  ) => {
    // Save consent flags to localStorage before Google redirect.
    // They will be recorded after the redirect callback via useEffect above.
    if (consentFlags) {
      const payload = buildConsentPayload(consentFlags.crossBorder);
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
