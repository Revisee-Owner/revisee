import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth-helpers";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get("courseId");

  const notes = await db.note.findMany({
    where: {
      userId,
      ...(courseId ? { courseId } : {}),
    },
    include: { course: true },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(notes);
}

export async function POST(req: NextRequest) {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { title, content, courseId } = body;

  if (!title) return NextResponse.json({ error: "Title is required" }, { status: 400 });

  const note = await db.note.create({
    data: {
      userId,
      title,
      content: content || {},
      courseId: courseId || null,
    },
    include: { course: true },
  });

  return NextResponse.json(note, { status: 201 });
}