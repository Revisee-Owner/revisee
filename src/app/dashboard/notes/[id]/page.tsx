"use client";

import { useState } from "react";
import { ArrowLeft, Save, Sparkles, BookOpen } from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/Button";

export default function NoteEditorPage() {
  const [title, setTitle] = useState("Data Structures — Binary Trees");
  const [content, setContent] = useState(
    "Binary trees are hierarchical data structures where each node has at most two children.\n\nKey operations include insertion, deletion, and traversal (in-order, pre-order, post-order).\n\n## Types of Binary Trees\n\n- Full Binary Tree: Every node has 0 or 2 children\n- Complete Binary Tree: All levels filled except possibly the last\n- Perfect Binary Tree: All internal nodes have 2 children, all leaves at same level\n- Balanced Binary Tree: Height difference between subtrees is at most 1"
  );
  const [saved, setSaved] = useState(true);

  const handleContentChange = (val: string) => {
    setContent(val);
    setSaved(false);
  };

  const handleSave = () => {
    // API call to save
    setSaved(true);
  };

  return (
    <div className="max-w-3xl mx-auto animate-in">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/notes"
          className="flex items-center gap-2 text-sm text-ink-3 hover:text-ink-0 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Notes
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xs text-ink-4">
            {saved ? "Saved" : "Unsaved changes"}
          </span>
          <Button size="sm" onClick={handleSave} disabled={saved}>
            <span className="flex items-center gap-1.5">
              <Save size={14} /> Save
            </span>
          </Button>
        </div>
      </div>

      {/* Course badge */}
      <div className="mb-4">
        <span className="badge text-xs" style={{ backgroundColor: "#5c7cfa15", color: "#5c7cfa", borderColor: "#5c7cfa30" }}>
          💻 CS 201
        </span>
      </div>

      {/* Title */}
      <input
        type="text"
        className="w-full text-2xl font-display font-bold text-ink-0 bg-transparent border-none outline-none placeholder:text-ink-4 mb-4"
        value={title}
        onChange={(e) => { setTitle(e.target.value); setSaved(false); }}
        placeholder="Note title..."
      />

      {/* Editor (simplified textarea — swap for TipTap in production) */}
      <div className="card p-6 min-h-[400px]">
        <textarea
          className="w-full min-h-[360px] bg-transparent border-none outline-none resize-none text-sm text-ink-1 leading-relaxed font-sans placeholder:text-ink-4"
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
          placeholder="Start writing your notes..."
        />
      </div>

      {/* AI Actions bar */}
      <div className="mt-4 card px-4 py-3 flex items-center gap-2 flex-wrap">
        <span className="text-xs text-ink-3 font-medium mr-2">AI Tools:</span>
        <Button size="sm" variant="secondary">
          <span className="flex items-center gap-1.5">
            <Sparkles size={13} /> Summarize
          </span>
        </Button>
        <Button size="sm" variant="secondary">
          <span className="flex items-center gap-1.5">
            <BookOpen size={13} /> Generate Quiz
          </span>
        </Button>
        <Button size="sm" variant="secondary">
          <span className="flex items-center gap-1.5">
            <BookOpen size={13} /> Study Guide
          </span>
        </Button>
      </div>
    </div>
  );
}
