"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

interface Course {
  id: string;
  name: string;
  color: string;
  emoji: string;
}

interface TaskFormData {
  title: string;
  description: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "PENDING" | "IN_PROGRESS" | "DONE";
  dueDate: string;
  courseId: string;
}

interface TaskFormProps {
  initialData?: Partial<TaskFormData>;
  courses: Course[];
  onSubmit: (data: TaskFormData) => void;
  onCancel: () => void;
  loading?: boolean;
  submitLabel?: string;
}

export default function TaskForm({
  initialData,
  courses,
  onSubmit,
  onCancel,
  loading,
  submitLabel = "Add Task",
}: TaskFormProps) {
  const [form, setForm] = useState<TaskFormData>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    priority: initialData?.priority || "MEDIUM",
    status: initialData?.status || "PENDING",
    dueDate: initialData?.dueDate || "",
    courseId: initialData?.courseId || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-ink-1 mb-1.5">
          Task title <span className="text-accent-red">*</span>
        </label>
        <input
          type="text"
          className="input-field"
          placeholder="e.g. Finish chapter 5 notes"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          autoFocus
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-ink-1 mb-1.5">
          Description
        </label>
        <textarea
          className="input-field resize-none h-20"
          placeholder="Optional details..."
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </div>

      {/* Row: Course + Priority */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-ink-1 mb-1.5">Course</label>
          <select
            className="input-field"
            value={form.courseId}
            onChange={(e) => setForm({ ...form, courseId: e.target.value })}
          >
            <option value="">No course</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.emoji} {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-ink-1 mb-1.5">Priority</label>
          <select
            className="input-field"
            value={form.priority}
            onChange={(e) =>
              setForm({ ...form, priority: e.target.value as TaskFormData["priority"] })
            }
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>
      </div>

      {/* Row: Due date + Status */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-ink-1 mb-1.5">Due date</label>
          <input
            type="datetime-local"
            className="input-field"
            value={form.dueDate}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink-1 mb-1.5">Status</label>
          <select
            className="input-field"
            value={form.status}
            onChange={(e) =>
              setForm({ ...form, status: e.target.value as TaskFormData["status"] })
            }
          >
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" loading={loading}>
          {submitLabel}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
