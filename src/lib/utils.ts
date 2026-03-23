import { type ClassValue, clsx } from "clsx";

// Simple cn utility (no tailwind-merge needed for MVP)
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatRelativeDate(date: Date | string): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = d.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return `${Math.abs(diffDays)}d overdue`;
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays <= 7) return `In ${diffDays} days`;
  return formatDate(date);
}

export function getDueDateColor(date: Date | string): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = d.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "text-accent-red";
  if (diffDays === 0) return "text-accent-orange";
  if (diffDays <= 2) return "text-accent-yellow";
  return "text-ink-3";
}

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case "HIGH":
      return "bg-accent-red/10 text-accent-red border-accent-red/20";
    case "MEDIUM":
      return "bg-accent-orange/10 text-accent-orange border-accent-orange/20";
    case "LOW":
      return "bg-accent-green/10 text-accent-green border-accent-green/20";
    default:
      return "bg-surface-2 text-ink-3";
  }
}

export function getStatusIcon(status: string): string {
  switch (status) {
    case "DONE":
      return "✓";
    case "IN_PROGRESS":
      return "◐";
    default:
      return "○";
  }
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + "…";
}

export function extractTextFromTipTap(json: any): string {
  if (!json || !json.content) return "";
  return json.content
    .map((node: any) => {
      if (node.type === "text") return node.text || "";
      if (node.content) return extractTextFromTipTap(node);
      return "";
    })
    .join(" ")
    .trim();
}
