"use client";

import { useSession, signIn, signUp, signOut } from "@/lib/auth-client";
import { useProfile } from "@/hooks/use-profile";

export function useAuth() {
  const { data: session, isPending } = useSession();
  const user = session?.user ?? null;
  const { profile, loading: profileLoading, refreshProfile } = useProfile(user?.id);

  const handleSignIn = async (email: string, password: string) => {
    const { error } = await signIn.email({ email, password });
    if (error) {
      return { error: new Error(error.message ?? "Sign in failed") };
    }
    return { error: null };
  };

  const handleSignUp = async (email: string, password: string, name: string) => {
    const { error } = await signUp.email({ email, password, name });
    if (error) {
      return { error: new Error(error.message ?? "Sign up failed") };
    }
    return { error: null };
  };

  const handleSignInWithGoogle = async () => {
    const { error } = await signIn.social({ provider: "google" });
    if (error) {
      return { error: new Error(error.message ?? "Google sign in failed") };
    }
    return { error: null };
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
