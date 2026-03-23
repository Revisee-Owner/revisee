"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, BookOpen, CheckSquare, FileText } from "lucide-react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import EmptyState from "@/components/ui/EmptyState";

const PRESET_COLORS = ["#5c7cfa", "#fa5252", "#40c057", "#fd7e14", "#fab005", "#7950f2", "#20c997", "#e64980"];
const PRESET_EMOJIS = ["📚", "💻", "🧪", "📐", "📊", "🎨", "🌍", "🔬", "📖", "🎵", "⚽", "🧠"];

interface Course {
  id: string;
  name: string;
  color: string;
  emoji: string;
  taskCount: number;
  noteCount: number;
}

const INITIAL_COURSES: Course[] = [
  { id: "c1", name: "Chemistry", color: "#fa5252", emoji: "🧪", taskCount: 3, noteCount: 2 },
  { id: "c2", name: "CS 201", color: "#5c7cfa", emoji: "💻", taskCount: 4, noteCount: 3 },
  { id: "c3", name: "Calculus II", color: "#40c057", emoji: "📐", taskCount: 2, noteCount: 1 },
  { id: "c4", name: "Business 101", color: "#fd7e14", emoji: "📊", taskCount: 1, noteCount: 2 },
];

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [form, setForm] = useState({ name: "", color: PRESET_COLORS[0], emoji: PRESET_EMOJIS[0] });

  const openAdd = () => {
    setForm({ name: "", color: PRESET_COLORS[0], emoji: PRESET_EMOJIS[0] });
    setEditingCourse(null);
    setModalOpen(true);
  };

  const openEdit = (c: Course) => {
    setForm({ name: c.name, color: c.color, emoji: c.emoji });
    setEditingCourse(c);
    setModalOpen(true);
  };

  const handleSubmit = () => {
    if (!form.name.trim()) return;
    if (editingCourse) {
      setCourses(courses.map((c) => (c.id === editingCourse.id ? { ...c, ...form } : c)));
    } else {
      setCourses([...courses, { ...form, id: crypto.randomUUID(), taskCount: 0, noteCount: 0 }]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setCourses(courses.filter((c) => c.id !== id));
  };

  return (
    <div className="max-w-3xl mx-auto animate-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-xl text-ink-0">Courses</h1>
          <p className="text-sm text-ink-3 mt-0.5">{courses.length} courses</p>
        </div>
        <Button onClick={openAdd}>
          <span className="flex items-center gap-2"><Plus size={16} /> Add Course</span>
        </Button>
      </div>

      {courses.length === 0 ? (
        <EmptyState
          icon="📚"
          title="No courses yet"
          description="Add your courses to organize tasks and notes."
          action={<Button onClick={openAdd}><span className="flex items-center gap-2"><Plus size={16} /> Add Course</span></Button>}
        />
      ) : (
        <div className="space-y-3">
          {courses.map((course) => (
            <div key={course.id} className="card px-5 py-4 flex items-center gap-4">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
                style={{ backgroundColor: course.color + "15" }}
              >
                {course.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm text-ink-0">{course.name}</h3>
                <div className="flex items-center gap-3 mt-1 text-[11px] text-ink-3">
                  <span className="flex items-center gap-1"><CheckSquare size={10} /> {course.taskCount} tasks</span>
                  <span className="flex items-center gap-1"><FileText size={10} /> {course.noteCount} notes</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => openEdit(course)} className="p-2 rounded-lg hover:bg-surface-2 text-ink-4 transition-colors">
                  <Pencil size={15} />
                </button>
                <button onClick={() => handleDelete(course.id)} className="p-2 rounded-lg hover:bg-accent-red/10 text-ink-4 hover:text-accent-red transition-colors">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingCourse ? "Edit Course" : "New Course"}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink-1 mb-1.5">Course name</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Organic Chemistry"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-1 mb-2">Emoji</label>
            <div className="flex flex-wrap gap-2">
              {PRESET_EMOJIS.map((e) => (
                <button
                  key={e}
                  onClick={() => setForm({ ...form, emoji: e })}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg transition-all ${form.emoji === e ? "bg-brand-100 ring-2 ring-brand-400" : "hover:bg-surface-2"}`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-1 mb-2">Color</label>
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setForm({ ...form, color: c })}
                  className={`w-8 h-8 rounded-full transition-all ${form.color === c ? "ring-2 ring-offset-2 ring-brand-400 scale-110" : "hover:scale-105"}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button onClick={handleSubmit}>{editingCourse ? "Save" : "Add Course"}</Button>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
