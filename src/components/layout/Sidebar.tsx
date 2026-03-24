"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CheckSquare,
  FileText,
  BookOpen,
  Sparkles,
  Crown,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/tasks", icon: CheckSquare, label: "Tasks" },
  { href: "/dashboard/notes", icon: FileText, label: "Notes" },
  { href: "/dashboard/courses", icon: BookOpen, label: "Courses" },
  { href: "/dashboard/ai-tools", icon: Sparkles, label: "AI Tools", pro: true },
];

interface SidebarProps {
  plan?: string;
}

export default function Sidebar({ plan = "FREE" }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0" style={{ background: "var(--color-surface-0)", borderRight: "1px solid var(--color-surface-3)" }}>
      {/* Logo */}
      <div style={{ padding: "18px 24px", borderBottom: "1px solid #f1f3f5" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: "linear-gradient(135deg, #3b82f6, #2563eb)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: 800, fontSize: 14,
            boxShadow: "0 2px 8px rgba(59,130,246,0.3)",
          }}>R</div>
          <div>
            <h1 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 16, color: "#212529", lineHeight: 1.2 }}>
              Revisee
            </h1>
            <p style={{ fontSize: 11, color: "#adb5bd", fontWeight: 500 }}>Study smarter</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: "14px 12px", display: "flex", flexDirection: "column", gap: 2 }}>
        {navItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex", alignItems: "center", gap: 11,
                padding: "10px 12px", borderRadius: 10,
                fontSize: 14, fontWeight: 500, textDecoration: "none",
                transition: "all 0.15s",
                background: isActive ? "rgba(59,130,246,0.08)" : "transparent",
                color: isActive ? "#3b82f6" : "#495057",
              }}
            >
              <item.icon size={18} />
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.pro && plan === "FREE" && (
                <Crown size={14} style={{ color: "#fab005" }} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Plan badge */}
      <div style={{ padding: "14px 12px", borderTop: "1px solid #f1f3f5" }}>
        {plan === "FREE" ? (
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "12px 14px", borderRadius: 12,
            background: "linear-gradient(135deg, rgba(59,130,246,0.06), rgba(59,130,246,0.1))",
            border: "1px solid rgba(59,130,246,0.12)",
          }}>
            <Crown size={18} style={{ color: "#3b82f6" }} />
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#3b5bdb", margin: 0 }}>Upgrade to Pro</p>
              <p style={{ fontSize: 11, color: "#748ffc", margin: 0 }}>Unlock AI features</p>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", fontSize: 14, color: "#40c057", fontWeight: 600 }}>
            <Crown size={16} /> Pro Plan
          </div>
        )}
      </div>
    </aside>
  );
}
