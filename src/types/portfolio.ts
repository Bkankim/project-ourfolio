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
