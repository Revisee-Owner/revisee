"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import TaskCard from "@/components/tasks/TaskCard";
import TaskForm from "@/components/tasks/TaskForm";
import EmptyState from "@/components/ui/EmptyState";
import { cn } from "@/lib/utils";

type FilterStatus = "ALL" | "PENDING" | "IN_PROGRESS" | "DONE";

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("ALL");

  // Fetch tasks and courses from API
  useEffect(() => {
    async function load() {
      try {
        const [tasksRes, coursesRes] = await Promise.all([
          fetch("/api/tasks"),
          fetch("/api/courses"),
        ]);
        if (tasksRes.ok) setTasks(await tasksRes.json());
        if (coursesRes.ok) setCourses(await coursesRes.json());
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredTasks =
    filterStatus === "ALL"
      ? tasks
      : tasks.filter((t) => t.status === filterStatus);

  const handleAdd = async (data: any) => {
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const newTask = await res.json();
        setTasks([newTask, ...tasks]);
        setModalOpen(false);
      }
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  const handleEdit = async (data: any) => {
    if (!editingTask) return;
    try {
      const res = await fetch(`/api/tasks/${editingTask.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const updated = await res.json();
        setTasks(tasks.map((t) => (t.id === editingTask.id ? updated : t)));
        setEditingTask(null);
      }
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    // Update UI immediately
    setTasks(tasks.map((t) => (t.id === id ? { ...t, status } : t)));
    try {
      await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleDelete = async (id: string) => {
    // Update UI immediately
    setTasks(tasks.filter((t) => t.id !== id));
    try {
      await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const statusFilters: { label: string; value: FilterStatus }[] = [
    { label: "All", value: "ALL" },
    { label: "Pending", value: "PENDING" },
    { label: "In Progress", value: "IN_PROGRESS" },
    { label: "Done", value: "DONE" },
  ];

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto animate-in">
        <div className="flex items-center justify-center py-20">
          <p className="text-ink-3">Loading tasks...</p>
        </div>
      </div>
    );
  }

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
          courses={courses}
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
              courseId: editingTask.course?.id || editingTask.courseId || "",
            } as any}
            courses={courses}
            onSubmit={handleEdit}
            onCancel={() => setEditingTask(null)}
            submitLabel="Save Changes"
          />
        )}
      </Modal>
    </div>
  );
}