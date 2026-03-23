"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

function useInView(t = 0.12) {
  const r = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = r.current;
    if (!el) return;
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: t });
    o.observe(el);
    return () => o.disconnect();
  }, [t]);
  return [r, v] as const;
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const [r, v] = useInView();
  return (
    <div ref={r} style={{
      opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(24px)",
      transition: `opacity .6s cubic-bezier(.16,1,.3,1) ${delay}s, transform .6s cubic-bezier(.16,1,.3,1) ${delay}s`,
    }}>{children}</div>
  );
}

const blue = "#3b82f6";
const blueLight = "#60a5fa";

function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  if (done) return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 20px", borderRadius: 14, background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.22)", color: "#34d399", fontSize: 14, fontWeight: 600 }}>
      <svg width="15" height="15" fill="none" viewBox="0 0 16 16"><path d="M13 4.5L6 12 2.5 8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      You&apos;re on the list — we&apos;ll email you!
    </div>
  );
  return (
    <form onSubmit={e => { e.preventDefault(); if (email.includes("@")) { fetch("/api/waitlist", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) }); setDone(true); } }}
      style={{ display: "flex", gap: 8, width: "100%", maxWidth: 450, flexWrap: "wrap" }}>
      <input type="email" required placeholder="you@university.edu" value={email}
        onChange={e => setEmail(e.target.value)}
        style={{
          flex: "1 1 220px", padding: "13px 18px", borderRadius: 12,
          border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)",
          color: "#f0f0f0", fontSize: 14, fontFamily: "inherit", outline: "none",
        }} />
      <button type="submit" style={{
        padding: "13px 26px", borderRadius: 12, border: "none",
        background: `linear-gradient(135deg, ${blue}, #2563eb)`, color: "#fff",
        fontSize: 14, fontWeight: 650, cursor: "pointer", fontFamily: "inherit",
        whiteSpace: "nowrap",
        boxShadow: "0 4px 20px rgba(59,130,246,0.35), inset 0 1px 0 rgba(255,255,255,0.12)",
      }}>Join Waitlist</button>
    </form>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid rgba(255,255,255,0.055)", padding: "18px 0" }}>
      <button onClick={() => setOpen(!open)} style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        width: "100%", background: "none", border: "none", color: "#edf0f7",
        fontSize: 15.5, fontWeight: 580, textAlign: "left", cursor: "pointer",
        fontFamily: "inherit", padding: 0, gap: 14,
      }}>
        <span>{q}</span>
        <span style={{ transform: open ? "rotate(180deg)" : "", transition: "transform .25s", flexShrink: 0, opacity: .4 }}>
          <svg width="17" height="17" fill="none" viewBox="0 0 18 18"><path d="M4.5 6.75 9 11.25l4.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </span>
      </button>
      <div style={{ maxHeight: open ? 300 : 0, overflow: "hidden", transition: "max-height .35s cubic-bezier(.16,1,.3,1)" }}>
        <p style={{ color: "#94a0b8", fontSize: 14, lineHeight: 1.7, paddingTop: 12, margin: 0 }}>{a}</p>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc, delay = 0 }: { icon: React.ReactNode; title: string; desc: string; delay?: number }) {
  const [hov, setHov] = useState(false);
  return (
    <Reveal delay={delay}>
      <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
        style={{
          padding: 26, borderRadius: 18, height: "100%",
          background: hov ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.02)",
          border: `1px solid ${hov ? "rgba(99,179,237,0.18)" : "rgba(255,255,255,0.055)"}`,
          transition: "all .25s",
        }}>
        <div style={{
          width: 42, height: 42, borderRadius: 11,
          background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.16)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: blueLight, marginBottom: 16,
        }}>{icon}</div>
        <h3 style={{ fontSize: 16, fontWeight: 660, color: "#edf0f7", margin: "0 0 7px" }}>{title}</h3>
        <p style={{ fontSize: 13.5, color: "#94a0b8", lineHeight: 1.65, margin: 0 }}>{desc}</p>
      </div>
    </Reveal>
  );
}

function StepCard({ n, title, desc, delay }: { n: string; title: string; desc: string; delay: number }) {
  return (
    <Reveal delay={delay}>
      <div style={{ textAlign: "center" }}>
        <div style={{
          width: 46, height: 46, borderRadius: "50%",
          background: `linear-gradient(135deg, ${blue}, #2563eb)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontSize: 17, fontWeight: 700,
          margin: "0 auto 14px",
          boxShadow: "0 4px 18px rgba(59,130,246,0.3)",
        }}>{n}</div>
        <h3 style={{ fontSize: 16, fontWeight: 650, color: "#edf0f7", margin: "0 0 7px" }}>{title}</h3>
        <p style={{ fontSize: 13.5, color: "#94a0b8", lineHeight: 1.6, margin: 0, maxWidth: 260, marginInline: "auto" }}>{desc}</p>
      </div>
    </Reveal>
  );
}

function MockupCard({ title, sub, accent, items, delay }: { title: string; sub: string; accent: string; items: { text: string; done: boolean; tag?: string; tagColor?: string }[]; delay: number }) {
  return (
    <Reveal delay={delay}>
      <div style={{ padding: 22, borderRadius: 18, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.055)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <div style={{ width: 9, height: 9, borderRadius: "50%", background: accent, opacity: .7 }} />
          <span style={{ fontSize: 13, fontWeight: 620, color: "#edf0f7" }}>{title}</span>
        </div>
        <p style={{ fontSize: 11.5, color: "#636d82", margin: "0 0 12px" }}>{sub}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          {items.map((it, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 9, padding: "9px 11px",
              borderRadius: 10, background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(255,255,255,0.035)",
            }}>
              <div style={{
                width: 20, height: 20, borderRadius: 6, flexShrink: 0,
                background: it.done ? "rgba(52,211,153,0.12)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${it.done ? "rgba(52,211,153,0.25)" : "rgba(255,255,255,0.07)"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#34d399", fontSize: 10,
              }}>{it.done ? "✓" : ""}</div>
              <span style={{
                fontSize: 12.5, flex: 1,
                color: it.done ? "#636d82" : "#cdd3df",
                textDecoration: it.done ? "line-through" : "none",
              }}>{it.text}</span>
              {it.tag && (
                <span style={{
                  fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 6,
                  background: it.tagColor + "14", color: it.tagColor, whiteSpace: "nowrap",
                }}>{it.tag}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const wrap: React.CSSProperties = { width: "100%", maxWidth: 1080, marginInline: "auto", padding: "0 22px" };
  const sectionPad: React.CSSProperties = { paddingBlock: 80 };
  const divider: React.CSSProperties = { borderTop: "1px solid rgba(255,255,255,0.04)" };
  const sLabel: React.CSSProperties = { fontSize: 12.5, fontWeight: 660, color: blueLight, letterSpacing: "0.08em", textTransform: "uppercase", textAlign: "center", marginBottom: 12 };
  const sHeading: React.CSSProperties = { fontSize: 34, fontWeight: 760, color: "#f0f2f7", textAlign: "center", letterSpacing: "-.025em", lineHeight: 1.15, marginBottom: 16 };

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <div style={{
      fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
      background: "#070810", color: "#edf0f7", minHeight: "100vh",
      WebkitFontSmoothing: "antialiased",
    }}>
      <style>{`
        *{margin:0;padding:0;box-sizing:border-box}
        html{scroll-behavior:smooth}
        ::selection{background:rgba(59,130,246,.3)}
        body{overflow-x:hidden;background:#070810}
        input::placeholder{color:#636d82!important}
        @media(max-width:768px){
          .g3{grid-template-columns:1fr!important}
          .g2{grid-template-columns:1fr!important}
          .hero-h{font-size:36px!important}
          .sec-h{font-size:27px!important}
          .nav-desk{display:none!important}
          .nav-mob{display:flex!important}
        }
        @media(min-width:769px){.nav-mob{display:none!important}}
      `}</style>

      {/* NAVBAR */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 62,
        display: "flex", alignItems: "center", justifyContent: "center", padding: "0 22px",
        background: scrolled ? "rgba(7,8,16,0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(18px) saturate(1.4)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.05)" : "1px solid transparent",
        transition: "all .3s",
      }}>
        <div style={{ ...wrap, display: "flex", alignItems: "center", justifyContent: "space-between", padding: 0 }}>
          <a href="#" style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none" }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8,
              background: `linear-gradient(135deg, ${blue}, #2563eb)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontSize: 13.5, fontWeight: 800,
              boxShadow: "0 2px 10px rgba(59,130,246,.3)",
            }}>R</div>
            <span style={{ fontSize: 17.5, fontWeight: 760, color: "#f0f0f0", letterSpacing: "-.02em" }}>Revisee</span>
          </a>
          <div className="nav-desk" style={{ display: "flex", alignItems: "center", gap: 30 }}>
            {navLinks.map(l => (
              <a key={l.label} href={l.href} style={{ color: "#94a0b8", fontSize: 13.5, fontWeight: 500, textDecoration: "none" }}>{l.label}</a>
            ))}
            <Link href="/dashboard" style={{
              padding: "8px 18px", borderRadius: 10,
              background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.18)",
              color: blueLight, fontSize: 13, fontWeight: 600, textDecoration: "none",
            }}>Open App</Link>
          </div>
          <button className="nav-mob" onClick={() => setMobileNav(!mobileNav)}
            style={{ display: "none", alignItems: "center", background: "none", border: "none", color: "#94a0b8", cursor: "pointer", padding: 4 }}>
            {mobileNav
              ? <svg width="21" height="21" fill="none" viewBox="0 0 22 22"><path d="M6 6l10 10M16 6 6 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              : <svg width="21" height="21" fill="none" viewBox="0 0 22 22"><path d="M3 6h16M3 11h16M3 16h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            }
          </button>
        </div>
      </nav>

      {mobileNav && (
        <div style={{
          position: "fixed", top: 62, left: 0, right: 0, bottom: 0,
          background: "rgba(7,8,16,0.97)", backdropFilter: "blur(20px)",
          zIndex: 99, display: "flex", flexDirection: "column", alignItems: "center",
          paddingTop: 48, gap: 28,
        }}>
          {navLinks.map(l => (
            <a key={l.label} href={l.href} onClick={() => setMobileNav(false)}
              style={{ color: "#edf0f7", fontSize: 19, fontWeight: 600, textDecoration: "none" }}>{l.label}</a>
          ))}
          <Link href="/dashboard" onClick={() => setMobileNav(false)} style={{
            padding: "12px 28px", borderRadius: 12, marginTop: 8,
            background: `linear-gradient(135deg, ${blue}, #2563eb)`,
            color: "#fff", fontSize: 15, fontWeight: 600, textDecoration: "none",
          }}>Open App</Link>
        </div>
      )}

      {/* HERO */}
      <section style={{ paddingTop: 135, paddingBottom: 90, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -80, left: "50%", transform: "translateX(-50%)", width: 650, height: 450, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(59,130,246,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ ...wrap, textAlign: "center", position: "relative" }}>
          <Reveal>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "6px 15px 6px 9px", borderRadius: 50,
              background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.15)",
              fontSize: 12.5, fontWeight: 620, color: blueLight, marginBottom: 26,
            }}>
              <span style={{ padding: "2px 8px", borderRadius: 50, background: `linear-gradient(135deg,${blue},#2563eb)`, color: "#fff", fontSize: 10.5, fontWeight: 700 }}>NEW</span>
              Launching soon — Join the waitlist
            </div>
          </Reveal>
          <Reveal delay={0.07}>
            <h1 className="hero-h" style={{
              fontSize: 54, fontWeight: 810, lineHeight: 1.08, letterSpacing: "-.035em",
              color: "#f8fafc", maxWidth: 660, marginInline: "auto", marginBottom: 18,
            }}>
              Your study life,<br />
              <span style={{ background: `linear-gradient(135deg, ${blueLight}, ${blue}, #818cf8)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>finally organized.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.14}>
            <p style={{ fontSize: 17, color: "#94a0b8", lineHeight: 1.65, maxWidth: 500, marginInline: "auto", marginBottom: 34, fontWeight: 450 }}>
              Revisee combines your tasks, notes, and AI study tools in one clean workspace. Stop juggling apps and start actually learning.
            </p>
          </Reveal>
          <Reveal delay={0.21}>
            <div id="waitlist" style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
              <WaitlistForm />
            </div>
            <p style={{ fontSize: 12, color: "#636d82", fontWeight: 450 }}>
              Free early access · No credit card · 200+ students already signed up
            </p>
          </Reveal>
        </div>
      </section>

      {/* PROBLEM */}
      <section style={{ ...sectionPad, ...divider }}>
        <div style={wrap}>
          <Reveal><p style={sLabel}>The Problem</p></Reveal>
          <Reveal delay={.05}><h2 className="sec-h" style={{ ...sHeading, maxWidth: 560, marginInline: "auto" }}>You&apos;re drowning in tabs, not studying.</h2></Reveal>
          <Reveal delay={.1}><p style={{ fontSize: 15.5, color: "#94a0b8", lineHeight: 1.7, textAlign: "center", maxWidth: 530, marginInline: "auto", marginBottom: 44 }}>
            One app for notes. Another for deadlines. A third for flashcards. A random AI chatbot on the side. It&apos;s a mess — and it&apos;s eating your study time.
          </p></Reveal>
          <div className="g3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, maxWidth: 680, marginInline: "auto" }}>
            {[
              { e: "😵‍💫", t: "5+ apps just to stay organized" },
              { e: "⏰", t: "Deadlines slipping through the cracks" },
              { e: "📝", t: "Notes you never look at again" },
            ].map((x, i) => (
              <Reveal key={i} delay={.14 + i * .05}>
                <div style={{ padding: "22px 18px", borderRadius: 16, textAlign: "center", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <span style={{ fontSize: 26, display: "block", marginBottom: 8 }}>{x.e}</span>
                  <p style={{ fontSize: 13.5, color: "#94a0b8", fontWeight: 500, margin: 0 }}>{x.t}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ ...sectionPad, ...divider }}>
        <div style={wrap}>
          <Reveal><p style={sLabel}>Features</p></Reveal>
          <Reveal delay={.05}><h2 className="sec-h" style={{ ...sHeading, maxWidth: 520, marginInline: "auto" }}>Everything you need. Nothing you don&apos;t.</h2></Reveal>
          <Reveal delay={.09}><p style={{ fontSize: 15.5, color: "#94a0b8", lineHeight: 1.7, textAlign: "center", maxWidth: 460, marginInline: "auto", marginBottom: 48 }}>
            One focused workspace built for how students actually study.
          </p></Reveal>
          <div className="g3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
            <FeatureCard delay={.08} icon={<svg width="22" height="22" fill="none" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="3" stroke="currentColor" strokeWidth="1.5"/><path d="M8 10l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>} title="Smart Task Tracking" desc="Add assignments with deadlines, priorities, and course tags. See what's due at a glance." />
            <FeatureCard delay={.13} icon={<svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9l-6-6Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M14 3v6h6M8 13h8M8 17h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>} title="Notes by Course" desc="Write and organize notes under each course. No more scattered Google Docs." />
            <FeatureCard delay={.18} icon={<svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M12 2l2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>} title="AI Note Summaries" desc="Paste messy lecture notes and get clean, concise summaries you can study from." />
            <FeatureCard delay={.23} icon={<svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M12 2C9 2 7 4 7 6.5 5.5 7 4 8.5 4 10.5s1 3.5 2.5 4c-.5 1 0 2.5 1.5 3 0 1.5 1.5 2.5 3 2.5h2c1.5 0 3-1 3-2.5 1.5-.5 2-2 1.5-3C19 14 20 12.5 20 10.5S18.5 7 17 6.5C17 4 15 2 12 2Z" stroke="currentColor" strokeWidth="1.5"/></svg>} title="AI Quiz Generator" desc="Turn any notes into practice questions. Test yourself before the exam tests you." />
            <FeatureCard delay={.28} icon={<svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/><path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>} title="Deadline Alerts" desc="Never miss a due date. Clear countdowns on your dashboard for everything upcoming." />
            <FeatureCard delay={.33} icon={<svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M12 3 4 7v5c0 4.4 3.4 8.5 8 9.5 4.6-1 8-5.1 8-9.5V7l-8-4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>} title="Privacy First" desc="Your data stays yours. We don't sell it, share it, or train on it." />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{ ...sectionPad, ...divider }}>
        <div style={wrap}>
          <Reveal><p style={sLabel}>How It Works</p></Reveal>
          <Reveal delay={.05}><h2 className="sec-h" style={{ ...sHeading, marginBottom: 48 }}>Three steps. Five minutes.</h2></Reveal>
          <div className="g3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 36 }}>
            <StepCard n="1" title="Add your courses" desc="Set up your semester in 60 seconds. Name, color, emoji — done." delay={.08} />
            <StepCard n="2" title="Track everything" desc="Add tasks, write notes, set deadlines. Everything organizes by course." delay={.15} />
            <StepCard n="3" title="Study with AI" desc="Summarize notes, generate quizzes, build study guides from what you wrote." delay={.22} />
          </div>
        </div>
      </section>

      {/* MOCKUPS */}
      <section style={{ ...sectionPad, ...divider }}>
        <div style={wrap}>
          <Reveal><p style={sLabel}>Inside the App</p></Reveal>
          <Reveal delay={.05}><h2 className="sec-h" style={{ ...sHeading, marginBottom: 48 }}>Clean. Focused. Built for students.</h2></Reveal>
          <div className="g2" style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 18 }}>
            <MockupCard title="This Week" sub="Upcoming deadlines" accent={blue} delay={.08}
              items={[
                { text: "Lab Report — Chemistry", done: false, tag: "Tomorrow", tagColor: "#f59e0b" },
                { text: "Read Ch. 7 — Data Structures", done: false, tag: "Wed", tagColor: blueLight },
                { text: "Problem set #4 — Calculus", done: false, tag: "Thu", tagColor: blueLight },
                { text: "Review midterm flashcards", done: true },
              ]} />
            <MockupCard title="AI Summary" sub="From your Binary Trees notes" accent="#a78bfa" delay={.15}
              items={[
                { text: "Binary trees have at most 2 children per node", done: true },
                { text: "In-order traversal gives sorted BST output", done: true },
                { text: "Balanced trees → O(log n) operations", done: true },
                { text: "Applications: heaps, expression trees, Huffman", done: false, tag: "Review", tagColor: "#a78bfa" },
              ]} />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ ...sectionPad, ...divider }}>
        <div style={{ ...wrap, maxWidth: 660 }}>
          <Reveal><p style={sLabel}>FAQ</p></Reveal>
          <Reveal delay={.05}><h2 className="sec-h" style={{ ...sHeading, marginBottom: 40 }}>Questions? Answers.</h2></Reveal>
          <Reveal delay={.1}>
            <div>
              <FAQItem q="Is Revisee free?" a="The core app — tasks, notes, dashboard — will be free forever. AI features have a generous free tier (5/month), with unlimited on Pro for $4–8/month." />
              <FAQItem q="What makes this different from Notion or Todoist?" a="Notion is powerful but complex. Todoist is great for tasks but has no notes or AI. Revisee is purpose-built for students: tasks + notes + AI study tools in one simple interface." />
              <FAQItem q="How does the AI work?" a="You write or paste your notes, and Revisee uses AI to generate summaries, practice quizzes, or study guides from your own content. Personalized to what you're studying." />
              <FAQItem q="Is my data private?" a="Yes. We don't sell your data, share it with third parties, or use it for AI training. You can delete everything with one tap." />
              <FAQItem q="When does it launch?" a="We're targeting the next few weeks. Join the waitlist for early access — the first 500 students get Pro free for 3 months." />
            </div>
          </Reveal>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ ...sectionPad, ...divider }}>
        <div style={{ ...wrap, textAlign: "center" }}>
          <Reveal><h2 className="sec-h" style={{ ...sHeading, maxWidth: 480, marginInline: "auto", marginBottom: 14 }}>Ready to study smarter?</h2></Reveal>
          <Reveal delay={.06}><p style={{ fontSize: 16, color: "#94a0b8", lineHeight: 1.65, maxWidth: 420, marginInline: "auto", marginBottom: 32 }}>
            Join hundreds of students on the waitlist. Free early access — no credit card needed.
          </p></Reveal>
          <Reveal delay={.12}><div style={{ display: "flex", justifyContent: "center" }}><WaitlistForm /></div></Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ ...divider, paddingBlock: 40 }}>
        <div style={{ ...wrap, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 24, height: 24, borderRadius: 6, background: `linear-gradient(135deg,${blue},#2563eb)`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11, fontWeight: 800 }}>R</div>
            <span style={{ fontSize: 14, fontWeight: 660, color: "#94a0b8" }}>Revisee</span>
          </div>
          <p style={{ fontSize: 12.5, color: "#636d82", margin: 0 }}>© 2026 Revisee. Study smarter. Stay ahead.</p>
        </div>
      </footer>
    </div>
  );
}
