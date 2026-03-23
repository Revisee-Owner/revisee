import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as any).id;
  const courses = await db.course.findMany({
    where: { userId },
    include: {
      _count: { select: { tasks: true, notes: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(courses);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as any).id;
  const body = await req.json();

  const course = await db.course.create({
    data: {
      userId,
      name: body.name,
      color: body.color || "#5c7cfa",
      emoji: body.emoji || "📚",
    },
  });

  return NextResponse.json(course, { status: 201 });
}
