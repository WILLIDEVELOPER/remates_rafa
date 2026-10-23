import type { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@heroui/react";
import { RemateGridSkeleton } from "@/components/ui/remate-card-skeleton";
import { RematesFilters, RematesResults } from "@/features/remates";

export const metadata: Metadata = {
  title: "Remates disponibles",
  alternates: { canonical: "/remates" },
  description:
    "Explora remates de vivienda en toda Colombia y filtra por ubicación, tipo de inmueble, precio y estado.",
};

export default async function RematesPage({ searchParams }: PageProps<"/remates">) {
  const params = await searchParams;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-12 lg:px-8 lg:py-16 xl:px-16">
      <header className="flex max-w-2xl flex-col gap-3">
        <h1 className="text-3xl font-medium tracking-tight sm:text-4xl">
          Remates disponibles
        </h1>
        <p className="text-muted">
          Filtra por ubicación, tipo de inmueble y precio para encontrar la
          oportunidad que buscas.
        </p>
      </header>

      <Suspense fallback={<Skeleton className="h-40 w-full rounded-2xl" />}>
        <RematesFilters />
      </Suspense>

      <Suspense key={JSON.stringify(params)} fallback={<RemateGridSkeleton />}>
        <RematesResults params={params} />
      </Suspense>
    </div>
  );
}
