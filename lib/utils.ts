import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimeAgo(minutes: number): string {
  if (minutes < 1) return "Just now";
  return `${minutes} min`;
}
