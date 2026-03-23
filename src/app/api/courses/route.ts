import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth-helpers";
import { db } from "@/lib/db";

export async function GET() {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const courses = await db.course.findMany({
    where: { userId },
    include: {
      _count: {
        select: { tasks: true, notes: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(courses);
}

export async function POST(req: NextRequest) {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { name, color, emoji } = body;

  if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

  const course = await db.course.create({
    data: {
      userId,
      name,
      color: color || "#5c7cfa",
      emoji: emoji || "📚",
    },
  });

  return NextResponse.json(course, { status: 201 });
}