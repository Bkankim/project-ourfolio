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

  const handleSignUp = async (email: string, password: string, name: string) =>
    wrapResult(await signUp.email({ email, password, name }), "Sign up failed");

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
