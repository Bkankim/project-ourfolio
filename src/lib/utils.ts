import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Parse and clamp a "limit" query parameter. */
export function parseLimit(url: string, defaultLimit = 50, max = 100): number {
  const raw = parseInt(new URL(url).searchParams.get("limit") ?? String(defaultLimit), 10);
  return Math.min(Math.max(raw, 1), max);
}

export function getUserDisplayName(
  fullName?: string | null,
  email?: string,
): string {
  return fullName || email?.split("@")[0] || "";
}

export function getInitials(name: string): string {
  return name.slice(0, 2).toUpperCase();
}
