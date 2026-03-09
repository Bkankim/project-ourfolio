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
  externalLink: string | null;
  featured: boolean;
  displayOrder: number;
  createdAt: string;
}

export interface CaseStudyClient {
  id: string;
  title: string;
  clientName: string | null;
  professionTemplate: ProfessionTemplate | null;
  projectId: string | null;
  problem: string | null;
  solution: string | null;
  result: string | null;
  metrics: Metric[];
  coverImageUrl: string | null;
  displayOrder: number;
  createdAt: string;
}

export interface LeadClient {
  id: string;
  senderName: string;
  senderEmail: string;
  message: string | null;
  budgetRange: string | null;
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
}

// ── Shared constants ────────────────────────────────
export const PROFESSION_LABEL_MAP: Record<ProfessionTemplate, string> = {
  dev: "templateDev",
  design: "templateDesign",
  marketing: "templateMarketing",
  consulting: "templateConsulting",
  other: "templateOther",
};

export const BUDGET_OPTIONS = [
  { value: "under-1k", key: "budgetUnder1k" },
  { value: "1k-5k", key: "budget1kTo5k" },
  { value: "5k-10k", key: "budget5kTo10k" },
  { value: "10k-plus", key: "budget10kPlus" },
] as const;
