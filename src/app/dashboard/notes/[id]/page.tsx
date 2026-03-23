"use client";

import { useState, useEffect, use } from "react";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/Button";

export default function NoteEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/notes/${id}`);
        if (res.ok) {
          const note = await res.json();
          setTitle(note.title);
          // Extract text from JSON content
          if (typeof note.content === "string") {
            setContent(note.content);
          } else if (note.content?.content) {
            const text = note.content.content
              .map((block: any) =>
                block.content?.map((c: any) => c.text).join("") || ""
              )
              .join("\n\n");
            setContent(text);
          }
        }
      } catch (error) {
        console.error("Failed to load note:", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content: {
            type: "doc",
            content: content.split("\n\n").filter(Boolean).map((paragraph) => ({
              type: "paragraph",
              content: [{ type: "text", text: paragraph }],
            })),
          },
        }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch (error) {
      console.error("Failed to save note:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto animate-in">
        <div className="flex items-center justify-center py-20">
          <p className="text-ink-3">Loading note...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto animate-in">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/dashboard/notes"
          className="flex items-center gap-2 text-sm text-ink-3 hover:text-ink-0 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Notes
        </Link>
        <Button onClick={handleSave} disabled={saving}>
          <span className="flex items-center gap-2">
            <Save size={16} />
            {saving ? "Saving..." : saved ? "Saved ✓" : "Save"}
          </span>
        </Button>
      </div>

      {/* Title */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full text-2xl font-display font-bold text-ink-0 bg-transparent border-none outline-none mb-4 placeholder:text-ink-4"
        placeholder="Note title..."
      />

      {/* Editor */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full min-h-[60vh] bg-surface-2 rounded-xl p-5 text-ink-1 text-base leading-relaxed border border-surface-3 outline-none focus:border-brand-600 transition-colors resize-none placeholder:text-ink-4"
        placeholder="Start writing your notes here..."
      />
    </div>
  );
}