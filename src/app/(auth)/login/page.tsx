"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await signIn("credentials", { email, password, redirect: false });
    if (result?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      window.location.href = "/dashboard";
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8f9fa", padding: 16 }}>
      <div style={{ width: "100%", maxWidth: 380 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, margin: "0 auto 16px",
            background: "linear-gradient(135deg, #3b82f6, #2563eb)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: 22, fontWeight: 800,
            boxShadow: "0 4px 20px rgba(59,130,246,0.3)",
          }}>R</div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "#212529" }}>Welcome back</h1>
          <p style={{ fontSize: 14, color: "#868e96", marginTop: 4 }}>Sign in to Revisee</p>
        </div>

        <div style={{ background: "#fff", borderRadius: 16, padding: 24, border: "1px solid #e9ecef", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          {/* Google Sign In */}
          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            style={{
              width: "100%", padding: "12px 16px", borderRadius: 12,
              border: "1px solid #dee2e6", background: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              fontSize: 14, fontWeight: 600, color: "#212529", cursor: "pointer",
              marginBottom: 20, transition: "background 0.15s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#f8f9fa"}
            onMouseLeave={(e) => e.currentTarget.style.background = "#fff"}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: "#e9ecef" }} />
            <span style={{ fontSize: 12, color: "#adb5bd" }}>or</span>
            <div style={{ flex: 1, height: 1, background: "#e9ecef" }} />
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{ padding: "10px 14px", borderRadius: 10, background: "rgba(250,82,82,0.08)", color: "#fa5252", fontSize: 13, marginBottom: 16 }}>
                {error}
              </div>
            )}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#495057", marginBottom: 6 }}>Email</label>
              <input type="email" placeholder="you@university.edu" value={email} onChange={(e) => setEmail(e.target.value)} required
                style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #dee2e6", fontSize: 14, outline: "none", fontFamily: "inherit" }} />
            </div>
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#495057", marginBottom: 6 }}>Password</label>
              <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required
                style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #dee2e6", fontSize: 14, outline: "none", fontFamily: "inherit" }} />
            </div>
            <button type="submit" disabled={loading}
              style={{
                width: "100%", padding: "12px 16px", borderRadius: 12, border: "none",
                background: "linear-gradient(135deg, #3b82f6, #2563eb)", color: "#fff",
                fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
              }}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", fontSize: 13, color: "#868e96", marginTop: 16 }}>
          Don&apos;t have an account?{" "}
          <Link href="/signup" style={{ color: "#3b82f6", fontWeight: 600, textDecoration: "none" }}>Sign up</Link>
        </p>
      </div>
    </div>
  );
}