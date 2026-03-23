import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const userId = (session.user as any).id;

  const note = await db.note.findFirst({
    where: { id, userId },
    include: { course: true, aiGenerations: { orderBy: { createdAt: "desc" }, take: 10 } },
  });

  if (!note) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(note);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const userId = (session.user as any).id;
  const body = await req.json();

  const note = await db.note.findFirst({ where: { id, userId } });
  if (!note) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await db.note.update({
    where: { id },
    data: {
      ...(body.title !== undefined && { title: body.title }),
      ...(body.content !== undefined && { content: body.content }),
      ...(body.courseId !== undefined && { courseId: body.courseId || null }),
    },
    include: { course: true },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const userId = (session.user as any).id;

  const note = await db.note.findFirst({ where: { id, userId } });
  if (!note) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await db.note.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
