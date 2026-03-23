"use client";

import { useState } from "react";
import { CheckSquare, FileText, Clock, AlertTriangle, Sparkles, Plus, ChevronRight } from "lucide-react";
import Link from "next/link";
import StatsCard from "@/components/dashboard/StatsCard";
import Button from "@/components/ui/Button";
import { cn, formatRelativeDate, getDueDateColor, getPriorityColor } from "@/lib/utils";

// Demo data — replace with real API calls
const DEMO_STATS = {
  totalTasks: 12,
  completedThisWeek: 5,
  totalNotes: 8,
  upcomingDeadlines: 3,
};

const DEMO_TASKS = [
  {
    id: "1",
    title: "Finish Lab Report — Chemistry",
    priority: "HIGH" as const,
    status: "PENDING" as const,
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 4).toISOString(),
    course: { name: "Chemistry", color: "#fa5252", emoji: "🧪" },
  },
  {
    id: "2",
    title: "Read Chapter 7 — Data Structures",
    priority: "MEDIUM" as const,
    status: "IN_PROGRESS" as const,
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
    course: { name: "CS 201", color: "#5c7cfa", emoji: "💻" },
  },
  {
    id: "3",
    title: "Calculus problem set #4",
    priority: "MEDIUM" as const,
    status: "PENDING" as const,
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(),
    course: { name: "Calculus II", color: "#40c057", emoji: "📐" },
  },
  {
    id: "4",
    title: "Group presentation slides",
    priority: "LOW" as const,
    status: "PENDING" as const,
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 120).toISOString(),
    course: { name: "Business 101", color: "#fd7e14", emoji: "📊" },
  },
];

export default function DashboardPage() {
  const greeting = getGreeting();

  return (
    <div className="max-w-5xl mx-auto animate-in space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-2xl text-ink-0">
          {greeting}, Student 👋
        </h1>
        <p className="text-ink-3 text-sm mt-1">
          Here&apos;s what&apos;s on your plate today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          label="Tasks"
          value={DEMO_STATS.totalTasks}
          icon={CheckSquare}
          color="text-brand-600"
          subtitle={`${DEMO_STATS.completedThisWeek} done this week`}
        />
        <StatsCard
          label="Notes"
          value={DEMO_STATS.totalNotes}
          icon={FileText}
          color="text-accent-green"
        />
        <StatsCard
          label="Due Soon"
          value={DEMO_STATS.upcomingDeadlines}
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
            <Link href="/tasks" className="text-xs text-brand-600 font-medium hover:text-brand-700 flex items-center gap-1">
              View all <ChevronRight size={14} />
            </Link>
          </div>

          <div className="space-y-2">
            {DEMO_TASKS.map((task) => (
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
                    <span
                      className="text-[11px] font-medium"
                      style={{ color: task.course.color }}
                    >
                      {task.course.emoji} {task.course.name}
                    </span>
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
        </div>

        {/* Quick actions */}
        <div>
          <h2 className="font-display font-semibold text-base text-ink-0 mb-4">
            Quick Actions
          </h2>
          <div className="space-y-2">
            <Link href="/tasks">
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
            <Link href="/notes">
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
            <Link href="/ai-tools">
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
}
