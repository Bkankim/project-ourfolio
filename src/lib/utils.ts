import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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
