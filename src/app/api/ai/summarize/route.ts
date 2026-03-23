import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateAI, canUseAI } from "@/lib/ai";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as any).id;
  const plan = (session.user as any).plan || "FREE";

  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  if (!canUseAI(plan, user.aiCreditsUsed)) {
    return NextResponse.json(
      { error: "AI credit limit reached. Upgrade to Pro for unlimited access." },
      { status: 429 }
    );
  }

  const body = await req.json();
  const { content, noteId } = body;

  if (!content || typeof content !== "string") {
    return NextResponse.json({ error: "Content is required" }, { status: 400 });
  }

  try {
    const result = await generateAI("summarize", content);

    // Save generation record
    await db.aIGeneration.create({
      data: {
        userId,
        noteId: noteId || null,
        type: "SUMMARY",
        inputSnippet: content.slice(0, 200),
        output: result.content,
      },
    });

    // Increment credit usage
    await db.user.update({
      where: { id: userId },
      data: { aiCreditsUsed: { increment: 1 } },
    });

    return NextResponse.json({ result: result.content });
  } catch (error: any) {
    console.error("AI generation error:", error);
    return NextResponse.json({ error: "AI generation failed" }, { status: 500 });
  }
}
