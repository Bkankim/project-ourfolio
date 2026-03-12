"use client";

import { useSession, signIn, signUp, signOut } from "@/lib/auth-client";
import { useProfile } from "@/hooks/use-profile";

function wrapResult(
  result: { error?: { message?: string } | null },
  fallback: string,
): { error: Error | null } {
  if (result.error) return { error: new Error(result.error.message ?? fallback) };
  return { error: null };
}

export function useAuth() {
  const { data: session, isPending } = useSession();
  const user = session?.user ?? null;
  const { profile, loading: profileLoading, refreshProfile } = useProfile(user?.id);

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

    // Record consents after successful signup (non-blocking)
    if (!result.error && consentFlags) {
      const consents = [
        { type: "privacy" as const, policyVersion: "1.0" },
        { type: "terms" as const, policyVersion: "1.0" },
        ...(consentFlags.crossBorder
          ? [{ type: "cross_border" as const, policyVersion: "1.0" }]
          : []),
      ];
      fetch("/api/consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ consents }),
      }).catch(() => {
        // Consent recording failure is non-critical
      });
    }

    return result;
  };

  const handleSignInWithGoogle = async () =>
    wrapResult(await signIn.social({ provider: "google", callbackURL: "/dashboard" }), "Google sign in failed");

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
