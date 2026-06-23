"use client";

import { useState, useEffect, useCallback } from "react";

interface Profile {
  id: string;
  userId: string;
  fullName: string | null;
  avatarUrl: string | null;
  username: string | null;
  bio: string | null;
  tagline: string | null;
  profession: string | null;
  template: string;
  primaryColor: string;
  accentColor: string;
  socialLinks: Record<string, string>;
  skills: string[] | null;
  resumeUrl: string | null;
}

export function useProfile(userId: string | undefined) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchProfile = useCallback(async () => {
    if (!userId) {
      setProfile(null);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/profile");
      if (res.ok) {
        const data = await res.json();
        setProfile(data.profile);
      }
    } catch {
      // silently fail — profile is optional
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { profile, loading, refreshProfile: fetchProfile };
}
