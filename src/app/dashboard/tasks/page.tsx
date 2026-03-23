"use client";

import { useState } from "react";
import { Plus, Filter, SlidersHorizontal } from "lucide-react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import TaskCard from "@/components/tasks/TaskCard";
import TaskForm from "@/components/tasks/TaskForm";
import EmptyState from "@/components/ui/EmptyState";
import { cn } from "@/lib/utils";

const DEMO_COURSES = [
  { id: "c1", name: "Chemistry", color: "#fa5252", emoji: "🧪" },
  { id: "c2", name: "CS 201", color: "#5c7cfa", emoji: "💻" },
  { id: "c3", name: "Calculus II", color: "#40c057", emoji: "📐" },
  { id: "c4", name: "Business 101", color: "#fd7e14", emoji: "📊" },
];

const INITIAL_TASKS = [
  {
    id: "1", title: "Finish Lab Report — Chemistry", description: "Due: Section 3-5 analysis",
    priority: "HIGH" as const, status: "PENDING" as const,
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 4).toISOString(),
    course: DEMO_COURSES[0],
  },
  {
    id: "2", title: "Read Chapter 7 — Data Structures", description: null,
    priority: "MEDIUM" as const, status: "IN_PROGRESS" as const,
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
    course: DEMO_COURSES[1],
  },
  {
    id: "3", title: "Calculus problem set #4", description: "Problems 1-20, odd only",
    priority: "MEDIUM" as const, status: "PENDING" as const,
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(),
    course: DEMO_COURSES[2],
  },
  {
    id: "4", title: "Group presentation slides", description: "My section: market analysis",
    priority: "LOW" as const, status: "PENDING" as const,
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 120).toISOString(),
    course: DEMO_COURSES[3],
  },
  {
    id: "5", title: "Review midterm flashcards", description: null,
    priority: "HIGH" as const, status: "DONE" as const,
    dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    course: DEMO_COURSES[1],
  },
];

type FilterStatus = "ALL" | "PENDING" | "IN_PROGRESS" | "DONE";

export default function TasksPage() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<(typeof INITIAL_TASKS)[0] | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("ALL");

  const filteredTasks =
    filterStatus === "ALL"
      ? tasks
      : tasks.filter((t) => t.status === filterStatus);

  const handleAdd = (data: any) => {
    const newTask = {
      ...data,
      id: crypto.randomUUID(),
      course: DEMO_COURSES.find((c) => c.id === data.courseId) || null,
    };
    setTasks([newTask, ...tasks]);
    setModalOpen(false);
  };

  const handleEdit = (data: any) => {
    setTasks(
      tasks.map((t) =>
        t.id === editingTask?.id
          ? { ...t, ...data, course: DEMO_COURSES.find((c) => c.id === data.courseId) || null }
          : t
      )
    );
    setEditingTask(null);
  };

  const handleStatusChange = (id: string, status: string) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, status: status as any } : t)));
  };

  const handleDelete = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const statusFilters: { label: string; value: FilterStatus }[] = [
    { label: "All", value: "ALL" },
    { label: "Pending", value: "PENDING" },
    { label: "In Progress", value: "IN_PROGRESS" },
    { label: "Done", value: "DONE" },
  ];

  return (
    <div className="max-w-3xl mx-auto animate-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-xl text-ink-0">Tasks</h1>
          <p className="text-sm text-ink-3 mt-0.5">
            {tasks.filter((t) => t.status !== "DONE").length} active ·{" "}
            {tasks.filter((t) => t.status === "DONE").length} completed
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <span className="flex items-center gap-2">
            <Plus size={16} /> Add Task
          </span>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-1.5 mb-5 overflow-x-auto pb-1">
        {statusFilters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilterStatus(f.value)}
            className={cn(
              "px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
              filterStatus === f.value
                ? "bg-brand-600 text-white shadow-sm"
                : "text-ink-3 hover:bg-surface-2"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Task list */}
      {filteredTasks.length === 0 ? (
        <EmptyState
          icon="✅"
          title="No tasks here"
          description={
            filterStatus === "ALL"
              ? "Add your first task to get started."
              : `No ${filterStatus.toLowerCase().replace("_", " ")} tasks.`
          }
          action={
            filterStatus === "ALL" ? (
              <Button onClick={() => setModalOpen(true)}>
                <span className="flex items-center gap-2">
                  <Plus size={16} /> Add Task
                </span>
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="space-y-2">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
              onEdit={(t) => setEditingTask(t as any)}
            />
          ))}
        </div>
      )}

      {/* Add modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New Task">
        <TaskForm
          courses={DEMO_COURSES}
          onSubmit={handleAdd}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>

      {/* Edit modal */}
      <Modal
        open={!!editingTask}
        onClose={() => setEditingTask(null)}
        title="Edit Task"
      >
        {editingTask && (
          <TaskForm
            initialData={{
              title: editingTask.title,
              description: editingTask.description || "",
              priority: editingTask.priority,
              status: editingTask.status,
              dueDate: editingTask.dueDate
                ? new Date(editingTask.dueDate).toISOString().slice(0, 16)
                : "",
              courseId: editingTask.course?.id || "",
            } as any}
            courses={DEMO_COURSES}
            onSubmit={handleEdit}
            onCancel={() => setEditingTask(null)}
            submitLabel="Save Changes"
          />
        )}
      </Modal>
    </div>
  );
}
