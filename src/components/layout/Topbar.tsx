"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Menu,
  X,
  LayoutDashboard,
  CheckSquare,
  FileText,
  BookOpen,
  Sparkles,
  Search,
} from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/tasks", icon: CheckSquare, label: "Tasks" },
  { href: "/dashboard/notes", icon: FileText, label: "Notes" },
  { href: "/dashboard/courses", icon: BookOpen, label: "Courses" },
  { href: "/dashboard/ai-tools", icon: Sparkles, label: "AI Tools" },
];

export default function Topbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  const userName = session?.user?.name || "Student";
  const userImage = session?.user?.image;

  const pageTitle = navItems.find((item) =>
    item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href)
  )?.label || "Dashboard";

  return (
    <>
      <header style={{
        position: "sticky", top: 0, zIndex: 40, height: 56,
        display: "flex", alignItems: "center",
        padding: "0 16px",
        background: "var(--color-surface-0)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--color-surface-3)",
      }}>
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden"
          style={{ padding: 8, marginLeft: -8, borderRadius: 8, background: "none", border: "none", color: "#495057", cursor: "pointer" }}
        >
          <Menu size={20} />
        </button>

        <h2 className="hidden lg:block" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: 17, color: "#212529", paddingLeft: 16 }}>
          {pageTitle}
        </h2>

        <div className="lg:hidden" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: "#3b82f6", fontSize: 17 }}>
          Revisee
        </div>

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          <button style={{ padding: 8, borderRadius: 8, background: "none", border: "none", color: "#868e96", cursor: "pointer" }}>
            <Search size={18} />
          </button>
          <ThemeToggle />
          {userImage ? (
            <img
              src={userImage}
              alt={userName}
              style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }}
              referrerPolicy="no-referrer"
            />
          ) : (
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: "rgba(59,130,246,0.1)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#3b82f6", fontWeight: 600, fontSize: 13,
            }}>
              {userName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      </header>

      {mobileOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50 }} className="lg:hidden">
          <div
            style={{ position: "absolute", inset: 0, background: "rgba(33,37,41,0.4)", backdropFilter: "blur(4px)" }}
            onClick={() => setMobileOpen(false)}
          />
          <div style={{
            position: "absolute", left: 0, top: 0, bottom: 0, width: 280,
            background: "#fff", boxShadow: "4px 0 20px rgba(0,0,0,0.08)",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid #f1f3f5" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 9,
                  background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontWeight: 800, fontSize: 13,
                }}>R</div>
                <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 16 }}>Revisee</span>
              </div>
              <button onClick={() => setMobileOpen(false)} style={{ padding: 6, borderRadius: 8, background: "none", border: "none", color: "#868e96", cursor: "pointer" }}>
                <X size={18} />
              </button>
            </div>
            <nav style={{ padding: "14px 12px", display: "flex", flexDirection: "column", gap: 2 }}>
              {navItems.map((item) => {
                const isActive = item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    style={{
                      display: "flex", alignItems: "center", gap: 11,
                      padding: "10px 12px", borderRadius: 10,
                      fontSize: 14, fontWeight: 500, textDecoration: "none",
                      background: isActive ? "rgba(59,130,246,0.08)" : "transparent",
                      color: isActive ? "#3b82f6" : "#495057",
                    }}
                  >
                    <item.icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}