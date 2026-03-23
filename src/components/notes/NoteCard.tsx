"use client";

import Link from "next/link";
import { FileText, Clock } from "lucide-react";
import { formatDate, truncate, extractTextFromTipTap } from "@/lib/utils";

interface NoteCardProps {
  note: {
    id: string;
    title: string;
    content: any;
    updatedAt: string;
    course?: { name: string; color: string; emoji: string } | null;
  };
}

export default function NoteCard({ note }: NoteCardProps) {
  const preview = truncate(extractTextFromTipTap(note.content), 120);

  return (
    <Link href={`/dashboard/notes/${note.id}`}>
      <div className="card p-5 h-full flex flex-col gap-3 hover:border-brand-200 transition-colors cursor-pointer">
        {/* Course badge */}
        {note.course && (
          <span
            className="badge text-[11px] self-start"
            style={{
              backgroundColor: note.course.color + "15",
              color: note.course.color,
              borderColor: note.course.color + "30",
            }}
          >
            {note.course.emoji} {note.course.name}
          </span>
        )}

        {/* Title */}
        <div className="flex items-start gap-2">
          <FileText size={16} className="text-ink-4 mt-0.5 flex-shrink-0" />
          <h3 className="font-medium text-sm text-ink-0 leading-snug line-clamp-2">
            {note.title || "Untitled Note"}
          </h3>
        </div>

        {/* Preview */}
        {preview && (
          <p className="text-xs text-ink-3 leading-relaxed line-clamp-3">
            {preview}
          </p>
        )}

        {/* Footer */}
        <div className="mt-auto pt-2 flex items-center gap-1.5 text-[11px] text-ink-4">
          <Clock size={10} />
          {formatDate(note.updatedAt)}
        </div>
      </div>
    </Link>
  );
}
