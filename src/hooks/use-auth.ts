"use client";

import { useSession, signIn, signUp, signOut } from "@/lib/auth-client";
import { useProfile } from "@/hooks/use-profile";

export function useAuth() {
  const { data: session, isPending } = useSession();
  const user = session?.user ?? null;
  const { profile, loading: profileLoading, refreshProfile } = useProfile(user?.id);

  const handleSignIn = async (email: string, password: string) => {
    try {
      await signIn.email({ email, password });
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err : new Error("Sign in failed") };
    }
  };

  const handleSignUp = async (email: string, password: string, name: string) => {
    try {
      await signUp.email({ email, password, name });
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err : new Error("Sign up failed") };
    }
  };

  const handleSignInWithGoogle = async () => {
    try {
      await signIn.social({ provider: "google" });
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err : new Error("Google sign in failed") };
    }
  };

  const handleSignOut = async () => {
    await signOut();
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
