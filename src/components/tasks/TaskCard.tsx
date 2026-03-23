"use client";

import { Clock, Flag, MoreHorizontal, Check, Trash2, Pencil } from "lucide-react";
import { cn, formatRelativeDate, getDueDateColor, getPriorityColor } from "@/lib/utils";
import { useState } from "react";

interface Task {
  id: string;
  title: string;
  description?: string | null;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "PENDING" | "IN_PROGRESS" | "DONE";
  dueDate?: string | null;
  course?: { name: string; color: string; emoji: string } | null;
}

interface TaskCardProps {
  task: Task;
  onStatusChange: (id: string, status: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

export default function TaskCard({ task, onStatusChange, onDelete, onEdit }: TaskCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isDone = task.status === "DONE";

  return (
    <div
      className={cn(
        "group card px-4 py-3.5 flex items-start gap-3 transition-all",
        isDone && "opacity-60"
      )}
    >
      {/* Checkbox */}
      <button
        onClick={() =>
          onStatusChange(task.id, isDone ? "PENDING" : "DONE")
        }
        className={cn(
          "mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all",
          isDone
            ? "bg-accent-green border-accent-green text-white"
            : "border-surface-4 hover:border-brand-400"
        )}
      >
        {isDone && <Check size={12} strokeWidth={3} />}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-sm font-medium leading-snug",
            isDone && "line-through text-ink-3"
          )}
        >
          {task.title}
        </p>

        {task.description && (
          <p className="text-xs text-ink-3 mt-1 line-clamp-1">
            {task.description}
          </p>
        )}

        <div className="flex items-center gap-2 mt-2 flex-wrap">
          {/* Course tag */}
          {task.course && (
            <span
              className="badge text-[11px]"
              style={{
                backgroundColor: task.course.color + "15",
                color: task.course.color,
                borderColor: task.course.color + "30",
              }}
            >
              {task.course.emoji} {task.course.name}
            </span>
          )}

          {/* Priority */}
          <span className={cn("badge text-[11px]", getPriorityColor(task.priority))}>
            <Flag size={10} />
            {task.priority.charAt(0) + task.priority.slice(1).toLowerCase()}
          </span>

          {/* Due date */}
          {task.dueDate && (
            <span className={cn("flex items-center gap-1 text-[11px] font-medium", getDueDateColor(task.dueDate))}>
              <Clock size={10} />
              {formatRelativeDate(task.dueDate)}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-1 rounded-md opacity-0 group-hover:opacity-100 hover:bg-surface-2 text-ink-4 transition-all"
        >
          <MoreHorizontal size={16} />
        </button>
        {menuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-0 top-8 z-20 bg-surface-0 rounded-xl shadow-lg border border-surface-3 py-1 w-36 animate-in">
              <button
                onClick={() => { onEdit(task); setMenuOpen(false); }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-ink-1 hover:bg-surface-2"
              >
                <Pencil size={14} /> Edit
              </button>
              <button
                onClick={() => { onDelete(task.id); setMenuOpen(false); }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-accent-red hover:bg-accent-red/5"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
