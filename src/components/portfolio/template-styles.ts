import type { Template } from "@/types/portfolio";

export interface TemplateStyle {
  bg: string;
  card: string;
  text: string;
  muted: string;
  accent: string;
  border: string;
}

const styles: Record<Template, TemplateStyle> = {
  minimal: {
    bg: "bg-white dark:bg-gray-50",
    card: "bg-gray-50 dark:bg-white border border-gray-200",
    text: "text-gray-900",
    muted: "text-gray-500",
    accent: "text-blue-600",
    border: "border-gray-200",
  },
  bold: {
    bg: "bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-purple-950 dark:via-pink-950 dark:to-orange-950",
    card: "bg-white/80 dark:bg-gray-900/80 backdrop-blur border border-purple-200/50 dark:border-purple-800/50",
    text: "text-gray-900 dark:text-gray-100",
    muted: "text-gray-600 dark:text-gray-400",
    accent: "text-purple-600 dark:text-purple-400",
    border: "border-purple-200/50 dark:border-purple-800/50",
  },
  darktech: {
    bg: "bg-gray-950",
    card: "bg-gray-900 border border-gray-800",
    text: "text-gray-100",
    muted: "text-gray-400",
    accent: "text-cyan-400",
    border: "border-gray-800",
  },
};

export function getTemplateStyle(template: Template): TemplateStyle {
  return styles[template];
}
