"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useI18n } from "@/lib/i18n";
import { getInitials } from "@/lib/utils";
import { uploadFile } from "@/lib/upload-file";
import { Upload } from "lucide-react";

interface ProfileFormProps {
  fullName: string;
  setFullName: (v: string) => void;
  username: string;
  setUsername: (v: string) => void;
  bio: string;
  setBio: (v: string) => void;
  tagline: string;
  setTagline: (v: string) => void;
  profession: string;
  setProfession: (v: string) => void;
  avatarUrl: string;
  setAvatarUrl: (v: string) => void;
}

const PROFESSIONS = [
  { value: "developer", key: "profDeveloper" },
  { value: "designer", key: "profDesigner" },
  { value: "writer", key: "profWriter" },
  { value: "consultant", key: "profConsultant" },
  { value: "photographer", key: "profPhotographer" },
  { value: "marketer", key: "profMarketer" },
  { value: "other", key: "profOther" },
] as const;

export function ProfileForm({
  fullName,
  setFullName,
  username,
  setUsername,
  bio,
  setBio,
  tagline,
  setTagline,
  profession,
  setProfession,
  avatarUrl,
  setAvatarUrl,
}: ProfileFormProps) {
  const { t } = useI18n();
  const [uploading, setUploading] = useState(false);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadFile(file, "avatars");
    if (url) setAvatarUrl(url);
    setUploading(false);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">{t("profileSection")}</h2>

      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={avatarUrl || undefined} />
          <AvatarFallback className="bg-primary/10 text-primary">
            {getInitials(fullName || "U")}
          </AvatarFallback>
        </Avatar>
        <label className="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors">
          <Upload className="h-4 w-4" />
          {uploading ? "..." : t("avatarUpload")}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarUpload}
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>{t("fullName")}</Label>
          <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>{t("username")}</Label>
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase())}
            placeholder="john-doe"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>{t("tagline")}</Label>
        <Input value={tagline} onChange={(e) => setTagline(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label>{t("profession")}</Label>
        <Select value={profession} onValueChange={(v) => setProfession(v ?? "")}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PROFESSIONS.map((p) => (
              <SelectItem key={p.value} value={p.value}>
                {t(p.key as Parameters<typeof t>[0])}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>{t("bio")}</Label>
        <Textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={4}
        />
      </div>
    </div>
  );
}
