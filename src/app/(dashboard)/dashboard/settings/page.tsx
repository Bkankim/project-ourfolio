"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useI18n } from "@/lib/i18n";
import { Skeleton } from "@/components/ui/skeleton";
import { ProfileForm } from "@/components/settings/profile-form";
import { TemplatePicker } from "@/components/settings/template-picker";
import { ColorSocialForm } from "@/components/settings/color-social-form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { Template, SocialLinks } from "@/types/portfolio";

export default function SettingsPage() {
  const { t } = useI18n();
  const { profile, refreshProfile, loading } = useAuth();

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [tagline, setTagline] = useState("");
  const [profession, setProfession] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [template, setTemplate] = useState<Template>("darktech");
  const [primaryColor, setPrimaryColor] = useState("#3B82F6");
  const [accentColor, setAccentColor] = useState("#FBBF24");
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName ?? "");
      setUsername(profile.username ?? "");
      setBio(profile.bio ?? "");
      setTagline(profile.tagline ?? "");
      setProfession(profile.profession ?? "");
      setAvatarUrl(profile.avatarUrl ?? "");
      setTemplate((profile.template as Template) ?? "darktech");
      setPrimaryColor(profile.primaryColor);
      setAccentColor(profile.accentColor);
      setSocialLinks((profile.socialLinks as SocialLinks) ?? {});
    }
  }, [profile]);

  const handleSave = async () => {
    setSaving(true);
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: fullName || undefined,
        username: username || undefined,
        bio: bio || undefined,
        tagline: tagline || undefined,
        profession: profession || undefined,
        avatarUrl: avatarUrl || undefined,
        template,
        primaryColor,
        accentColor,
        socialLinks,
      }),
    });

    if (res.ok) {
      toast.success(t("settingsSaved"));
      refreshProfile();
    } else {
      const data = await res.json();
      toast.error(data.error ?? "Failed to save");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-2xl">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">{t("settingsTitle")}</h1>
        <p className="text-muted-foreground">{t("settingsDesc")}</p>
      </div>

      <ProfileForm
        fullName={fullName}
        setFullName={setFullName}
        username={username}
        setUsername={setUsername}
        bio={bio}
        setBio={setBio}
        tagline={tagline}
        setTagline={setTagline}
        profession={profession}
        setProfession={setProfession}
        avatarUrl={avatarUrl}
        setAvatarUrl={setAvatarUrl}
      />

      <TemplatePicker template={template} setTemplate={setTemplate} />

      <ColorSocialForm
        primaryColor={primaryColor}
        setPrimaryColor={setPrimaryColor}
        accentColor={accentColor}
        setAccentColor={setAccentColor}
        socialLinks={socialLinks}
        setSocialLinks={setSocialLinks}
      />

      <Button onClick={handleSave} disabled={saving} className="rounded-xl">
        {saving ? "..." : t("saveSettings")}
      </Button>

      {username && (
        <p className="text-sm text-muted-foreground">
          {t("slugPreview")}:{" "}
          <span className="font-mono text-foreground">
            {typeof window !== "undefined" ? window.location.origin : ""}/{username}
          </span>
        </p>
      )}
    </div>
  );
}
