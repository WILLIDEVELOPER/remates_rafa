import { Card, Skeleton } from "@heroui/react";

export function RemateCardSkeleton() {
  return (
    <Card className="gap-0 overflow-hidden rounded-2xl border border-border p-0 shadow-none">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <Card.Content className="flex flex-col gap-3 p-5">
        <Skeleton className="h-3 w-20 rounded" />
        <Skeleton className="h-5 w-4/5 rounded" />
        <Skeleton className="h-4 w-3/5 rounded" />
        <Skeleton className="mt-1 h-6 w-2/5 rounded" />
        <div className="mt-2 flex gap-4 border-t border-border pt-3">
          <Skeleton className="h-4 w-16 rounded" />
          <Skeleton className="h-4 w-10 rounded" />
          <Skeleton className="h-4 w-10 rounded" />
        </div>
      </Card.Content>
    </Card>
  );
}

export function RemateGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div
      role="status"
      aria-label="Cargando remates"
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {Array.from({ length: count }, (_, index) => (
        <RemateCardSkeleton key={index} />
      ))}
    </div>
  );
}
