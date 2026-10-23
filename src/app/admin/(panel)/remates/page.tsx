import type { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@heroui/react";
import { ListPagination } from "@/components/ui/list-pagination";
import { RematesTable, RematesToolbar } from "@/features/admin";
import { adminListRematesAction } from "@/server/presentation/actions/remate-actions";

export const metadata: Metadata = { title: "Remates" };

type SearchParams = Record<string, string | string[] | undefined>;

/** Sin parámetro `activo` se listan solo los activos; "all" lista todos. */
function withVisibilityDefault(params: SearchParams): SearchParams {
  const { activo, ...rest } = params;
  if (activo === "all") return rest;
  return { ...rest, activo: activo === "false" ? "false" : "true" };
}

async function RematesList({ params }: { params: SearchParams }) {
  const result = await adminListRematesAction(withVisibilityDefault(params));

  if (!result.ok) {
    return (
      <p className="rounded-2xl border border-border p-8 text-center text-sm text-muted">
        No se pudo cargar la lista: {result.error.message}
      </p>
    );
  }

  const { items, total, page, pageSize, totalPages } = result.data;

  return (
    <div className="flex flex-col gap-6">
      <RematesTable remates={items} />
      <ListPagination
        page={page}
        totalPages={totalPages}
        total={total}
        pageSize={pageSize}
        itemsLabel="remates"
      />
    </div>
  );
}

export default async function AdminRematesPage({ searchParams }: PageProps<"/admin/remates">) {
  const params = await searchParams;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-medium tracking-tight sm:text-3xl">Remates</h1>
        <p className="text-sm text-muted">Crea, edita, destaca y elimina los remates publicados.</p>
      </header>

      <Suspense fallback={<Skeleton className="h-52 w-full rounded-2xl" />}>
        <RematesToolbar />
      </Suspense>

      <Suspense key={JSON.stringify(params)} fallback={<Skeleton className="h-96 w-full rounded-2xl" />}>
        <RematesList params={params} />
      </Suspense>
    </div>
  );
}
