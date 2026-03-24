"use client";

import { useState, useEffect } from "react";
import { CheckSquare, FileText, Clock, AlertTriangle, Sparkles, Plus, ChevronRight } from "lucide-react";
import Link from "next/link";
import StatsCard from "@/components/dashboard/StatsCard";
import { cn, formatRelativeDate, getDueDateColor, getPriorityColor } from "@/lib/utils";

export default function DashboardPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const greeting = getGreeting();

  useEffect(() => {
    async function load() {
      try {
        const [tasksRes, notesRes] = await Promise.all([
          fetch("/api/tasks"),
          fetch("/api/notes"),
        ]);
        if (tasksRes.ok) setTasks(await tasksRes.json());
        if (notesRes.ok) setNotes(await notesRes.json());
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const upcomingTasks = tasks
    .filter((t) => t.status !== "DONE")
    .slice(0, 4);

  const completedThisWeek = tasks.filter((t) => {
    if (t.status !== "DONE") return false;
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return new Date(t.updatedAt) > weekAgo;
  }).length;

  const dueSoon = tasks.filter((t) => {
    if (t.status === "DONE" || !t.dueDate) return false;
    const hours48 = new Date(Date.now() + 48 * 60 * 60 * 1000);
    return new Date(t.dueDate) < hours48;
  }).length;

  return (
    <div className="max-w-5xl mx-auto animate-in space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-2xl text-ink-0">
          {greeting} 👋
        </h1>
        <p className="text-ink-3 text-sm mt-1">
          Here&apos;s what&apos;s on your plate today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          label="Tasks"
          value={tasks.length}
          icon={CheckSquare}
          color="text-brand-600"
          subtitle={`${completedThisWeek} done this week`}
        />
        <StatsCard
          label="Notes"
          value={notes.length}
          icon={FileText}
          color="text-accent-green"
        />
        <StatsCard
          label="Due Soon"
          value={dueSoon}
          icon={AlertTriangle}
          color="text-accent-orange"
          subtitle="Next 48 hours"
        />
        <StatsCard
          label="AI Credits"
          value="5/5"
          icon={Sparkles}
          color="text-brand-500"
          subtitle="Free tier"
        />
      </div>

      {/* Two-column: Today's tasks + Quick actions */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Today's tasks */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-base text-ink-0">
              Upcoming Tasks
            </h2>
            <Link href="/dashboard/tasks" className="text-xs text-brand-600 font-medium hover:text-brand-700 flex items-center gap-1">
              View all <ChevronRight size={14} />
            </Link>
          </div>

          {loading ? (
            <p className="text-ink-3 text-sm py-8 text-center">Loading...</p>
          ) : upcomingTasks.length === 0 ? (
            <div className="card px-4 py-8 text-center">
              <p className="text-ink-3 text-sm">No upcoming tasks. You&apos;re all caught up!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  className="card px-4 py-3 flex items-center gap-3"
                >
                  <button
                    className={cn(
                      "w-5 h-5 rounded-md border-2 flex-shrink-0 transition-all",
                      "border-surface-4 hover:border-brand-400"
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink-0 truncate">
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {task.course && (
                        <span
                          className="text-[11px] font-medium"
                          style={{ color: task.course.color }}
                        >
                          {task.course.emoji} {task.course.name}
                        </span>
                      )}
                      {task.dueDate && (
                        <span
                          className={cn(
                            "flex items-center gap-1 text-[11px] font-medium",
                            getDueDateColor(task.dueDate)
                          )}
                        >
                          <Clock size={10} />
                          {formatRelativeDate(task.dueDate)}
                        </span>
                      )}
                    </div>
                  </div>
                  <span
                    className={cn(
                      "badge text-[10px]",
                      getPriorityColor(task.priority)
                    )}
                  >
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div>
          <h2 className="font-display font-semibold text-base text-ink-0 mb-4">
            Quick Actions
          </h2>
          <div className="space-y-2">
            <Link href="/dashboard/tasks">
              <div className="card px-4 py-3.5 flex items-center gap-3 hover:border-brand-200 transition-colors cursor-pointer">
                <div className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center">
                  <Plus size={18} className="text-brand-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-ink-0">New Task</p>
                  <p className="text-[11px] text-ink-4">Add an assignment</p>
                </div>
              </div>
            </Link>
            <Link href="/dashboard/notes">
              <div className="card px-4 py-3.5 flex items-center gap-3 hover:border-brand-200 transition-colors cursor-pointer">
                <div className="w-9 h-9 rounded-xl bg-accent-green/10 flex items-center justify-center">
                  <FileText size={18} className="text-accent-green" />
                </div>
                <div>
                  <p className="text-sm font-medium text-ink-0">New Note</p>
                  <p className="text-[11px] text-ink-4">Start writing</p>
                </div>
              </div>
            </Link>
            <Link href="/dashboard/ai-tools">
              <div className="card px-4 py-3.5 flex items-center gap-3 hover:border-brand-200 transition-colors cursor-pointer">
                <div className="w-9 h-9 rounded-xl bg-brand-500/10 flex items-center justify-center">
                  <Sparkles size={18} className="text-brand-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-ink-0">AI Study Tools</p>
                  <p className="text-[11px] text-ink-4">Summarize, quiz, review</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}src/app/dashboard/page.tsx