"use client";

import { useState } from "react";
import { Plus, Search } from "lucide-react";
import Button from "@/components/ui/Button";
import NoteCard from "@/components/notes/NoteCard";
import EmptyState from "@/components/ui/EmptyState";
import Modal from "@/components/ui/Modal";

const DEMO_NOTES = [
  {
    id: "n1",
    title: "Data Structures — Binary Trees",
    content: { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "Binary trees are hierarchical data structures where each node has at most two children. Key operations include insertion, deletion, and traversal (in-order, pre-order, post-order)." }] }] },
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    course: { name: "CS 201", color: "#5c7cfa", emoji: "💻" },
  },
  {
    id: "n2",
    title: "Organic Chemistry — Reaction Mechanisms",
    content: { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "SN1 and SN2 reactions differ in their mechanisms. SN1 is a two-step process involving carbocation intermediate, while SN2 is a one-step concerted mechanism with backside attack." }] }] },
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    course: { name: "Chemistry", color: "#fa5252", emoji: "🧪" },
  },
  {
    id: "n3",
    title: "Integration by Parts — Examples",
    content: { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "Formula: ∫u dv = uv - ∫v du. Choose u using LIATE rule: Logarithmic, Inverse trig, Algebraic, Trigonometric, Exponential." }] }] },
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    course: { name: "Calculus II", color: "#40c057", emoji: "📐" },
  },
  {
    id: "n4",
    title: "Marketing Mix — 4Ps Framework",
    content: { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "Product, Price, Place, Promotion. Each element must be carefully considered and balanced to create a successful marketing strategy." }] }] },
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
    course: { name: "Business 101", color: "#fd7e14", emoji: "📊" },
  },
];

export default function NotesPage() {
  const [notes, setNotes] = useState(DEMO_NOTES);
  const [search, setSearch] = useState("");
  const [showNewNote, setShowNewNote] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  const filtered = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      (n.course?.name || "").toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateNote = () => {
    if (!newTitle.trim()) return;
    const newNote = {
      id: crypto.randomUUID(),
      title: newTitle,
      content: { type: "doc", content: [] },
      updatedAt: new Date().toISOString(),
      course: null,
    };
    setNotes([newNote, ...notes]);
    setNewTitle("");
    setShowNewNote(false);
    // In real app, navigate to /notes/[id] to edit
  };

  return (
    <div className="max-w-5xl mx-auto animate-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-xl text-ink-0">Notes</h1>
          <p className="text-sm text-ink-3 mt-0.5">{notes.length} notes</p>
        </div>
        <Button onClick={() => setShowNewNote(true)}>
          <span className="flex items-center gap-2">
            <Plus size={16} /> New Note
          </span>
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-4" />
        <input
          type="text"
          className="input-field pl-10"
          placeholder="Search notes by title or course..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Notes grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon="📝"
          title="No notes yet"
          description="Create your first note to start organizing your study material."
          action={
            <Button onClick={() => setShowNewNote(true)}>
              <span className="flex items-center gap-2">
                <Plus size={16} /> New Note
              </span>
            </Button>
          }
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      )}

      {/* New note modal */}
      <Modal open={showNewNote} onClose={() => setShowNewNote(false)} title="New Note">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink-1 mb-1.5">Note title</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Chapter 5 — Key Concepts"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && handleCreateNote()}
            />
          </div>
          <div className="flex gap-3">
            <Button onClick={handleCreateNote}>Create Note</Button>
            <Button variant="ghost" onClick={() => setShowNewNote(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
