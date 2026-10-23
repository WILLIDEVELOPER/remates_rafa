import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
  /** Nivel del título: h1 si la página no tiene otro, h2 (por defecto) si va bajo un h1. */
  headingLevel?: "h1" | "h2";
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  headingLevel: Heading = "h2",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border px-6 py-16 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-surface-secondary">
        <Icon className="size-5" />
      </span>
      <div className="flex max-w-md flex-col gap-1.5">
        <Heading className="text-lg font-medium tracking-tight">{title}</Heading>
        <p className="text-sm text-muted">{description}</p>
      </div>
      {action}
    </div>
  );
}
