import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth-helpers";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const courseId = searchParams.get("courseId");

  const tasks = await db.task.findMany({
    where: {
      userId,
      ...(status ? { status: status as any } : {}),
      ...(courseId ? { courseId } : {}),
    },
    include: { course: true },
    orderBy: [{ dueDate: "asc" }, { createdAt: "desc" }],
  });

  return NextResponse.json(tasks);
}

export async function POST(req: NextRequest) {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { title, description, priority, status, dueDate, courseId } = body;

  if (!title) return NextResponse.json({ error: "Title is required" }, { status: 400 });

  const task = await db.task.create({
    data: {
      userId,
      title,
      description: description || null,
      priority: priority || "MEDIUM",
      status: status || "PENDING",
      dueDate: dueDate ? new Date(dueDate) : null,
      courseId: courseId || null,
    },
    include: { course: true },
  });

  return NextResponse.json(task, { status: 201 });
}