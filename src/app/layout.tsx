import "@/styles/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Revisee — Study Smarter. Stay Ahead.",
  description:
    "AI-powered study workspace for students. Track assignments, organize notes, and ace exams with AI study tools.",
  keywords: ["study", "student", "planner", "AI", "notes", "tasks", "assignments", "revisee"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
