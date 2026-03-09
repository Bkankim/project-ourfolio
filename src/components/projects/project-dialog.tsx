"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";
import { uploadFile } from "@/lib/upload-file";
import { X, Upload } from "lucide-react";
import type { ProjectClient as Project } from "@/types/portfolio";

interface ProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project | null;
  onSave: (data: Record<string, unknown>) => void;
}

const CATEGORIES = [
  "catWebDev",
  "catMobileApp",
  "catDesign",
  "catMarketing",
  "catWriting",
  "catPhotography",
  "catConsulting",
  "catOther",
] as const;

export function ProjectDialog({
  open,
  onOpenChange,
  project,
  onSave,
}: ProjectDialogProps) {
  const { t } = useI18n();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [externalLink, setExternalLink] = useState("");
  const [featured, setFeatured] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (project) {
      setTitle(project.title);
      setDescription(project.description ?? "");
      setCategory(project.category ?? "");
      setTags(project.tags ?? []);
      setExternalLink(project.externalLink ?? "");
      setFeatured(project.featured);
      setImageUrl(project.imageUrl ?? "");
    } else {
      setTitle("");
      setDescription("");
      setCategory("");
      setTags([]);
      setExternalLink("");
      setFeatured(false);
      setImageUrl("");
    }
    setTagInput("");
  }, [project, open]);

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim()) && tags.length < 10) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadFile(file, "projects");
    if (url) setImageUrl(url);
    setUploading(false);
  };

  const handleSubmit = () => {
    onSave({
      title,
      description: description || undefined,
      category: category || undefined,
      tags,
      externalLink: externalLink || undefined,
      featured,
      imageUrl: imageUrl || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {project ? t("editProject") : t("addProject")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>{t("projectsTitle")}</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>{t("projectDescription")}</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>{t("projectCategory")}</Label>
            <Select value={category} onValueChange={(v) => setCategory(v ?? "")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {t(cat)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t("projectTags")}</Label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  {tag}
                  <button
                    onClick={() => setTags(tags.filter((t) => t !== tag))}
                    className="hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder={t("tagPlaceholder")}
            />
          </div>

          <div className="space-y-2">
            <Label>{t("projectExternalLink")}</Label>
            <Input
              value={externalLink}
              onChange={(e) => setExternalLink(e.target.value)}
              type="url"
              placeholder="https://"
            />
          </div>

          <div className="space-y-2">
            <Label>{t("projectImage")}</Label>
            {imageUrl && (
              <img
                src={imageUrl}
                alt="Preview"
                className="rounded-lg max-h-32 object-cover"
              />
            )}
            <label className="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors">
              <Upload className="h-4 w-4" />
              {uploading ? "Uploading..." : t("projectImage")}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
          </div>

          <div className="flex items-center gap-3">
            <Switch checked={featured} onCheckedChange={setFeatured} />
            <Label>{t("projectFeatured")}</Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("cancel")}
          </Button>
          <Button onClick={handleSubmit} disabled={!title.trim()}>
            {t("save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
