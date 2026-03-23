"use client";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
  subtitle?: string;
}

export default function StatsCard({ label, value, icon: Icon, color = "text-brand-600", subtitle }: StatsCardProps) {
  return (
    <div className="card px-5 py-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-ink-3 uppercase tracking-wide">{label}</span>
        <Icon size={18} className={cn(color, "opacity-60")} />
      </div>
      <p className="font-display font-bold text-2xl text-ink-0">{value}</p>
      {subtitle && <p className="text-[11px] text-ink-4 mt-1">{subtitle}</p>}
    </div>
  );
}
