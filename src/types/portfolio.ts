export type Template = "minimal" | "bold" | "darktech";

export type EventType = "page_view" | "cta_click" | "contact_submit";

export type ProfessionTemplate =
  | "dev"
  | "design"
  | "marketing"
  | "consulting"
  | "other";

export interface Metric {
  label: string;
  value: string;
  unit: string;
}

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
  dribbble?: string;
  behance?: string;
}

// ── Client-side types (JSON serialized) ─────────────
export interface ProjectClient {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  category: string | null;
  tags: string[] | null;
  demoUrl: string | null;
  repoUrl: string | null;
  bodyMarkdown: string | null;
  role: string | null;
  stack: string[] | null;
  featured: boolean;
  displayOrder: number;
  createdAt: string;
}

export interface LeadClient {
  id: string;
  senderName: string;
  senderEmail: string;
  message: string | null;
  inquiryType: string | null;
  isRead: boolean;
  createdAt: string;
}

export interface ProfileClient {
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
  socialLinks: SocialLinks;
  skills: string[] | null;
  resumeUrl: string | null;
}

// ── Shared constants ────────────────────────────────
export const PROFESSION_LABEL_MAP: Record<ProfessionTemplate, string> = {
  dev: "templateDev",
  design: "templateDesign",
  marketing: "templateMarketing",
  consulting: "templateConsulting",
  other: "templateOther",
};

export const INQUIRY_TYPES = [
  { value: "hiring", key: "inquiryHiring" },
  { value: "collab", key: "inquiryCollab" },
  { value: "other", key: "inquiryOther" },
] as const;
