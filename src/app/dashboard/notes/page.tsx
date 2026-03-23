"use client";

import { useState, useEffect } from "react";
import { Plus, Search } from "lucide-react";
import Button from "@/components/ui/Button";
import NoteCard from "@/components/notes/NoteCard";
import EmptyState from "@/components/ui/EmptyState";
import Modal from "@/components/ui/Modal";

export default function NotesPage() {
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showNewNote, setShowNewNote] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/notes");
        if (res.ok) setNotes(await res.json());
      } catch (error) {
        console.error("Failed to load notes:", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      (n.course?.name || "").toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateNote = async () => {
    if (!newTitle.trim()) return;
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle }),
      });
      if (res.ok) {
        const newNote = await res.json();
        setNotes([newNote, ...notes]);
        setNewTitle("");
        setShowNewNote(false);
      }
    } catch (error) {
      console.error("Failed to create note:", error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto animate-in">
        <div className="flex items-center justify-center py-20">
          <p className="text-ink-3">Loading notes...</p>
        </div>
      </div>
    );
  }

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