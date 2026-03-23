"use client";

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <span className="text-5xl mb-4">{icon}</span>
      <h3 className="font-display font-semibold text-lg text-ink-1 mb-2">{title}</h3>
      <p className="text-ink-3 text-sm max-w-sm mb-6">{description}</p>
      {action}
    </div>
  );
}
