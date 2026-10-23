import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RemateForm } from "@/features/admin";
import { getRemateByIdAction } from "@/server/presentation/actions/remate-actions";

export const metadata: Metadata = { title: "Editar remate" };

export default async function EditarRematePage({
  params,
}: PageProps<"/admin/remates/[id]/editar">) {
  const { id } = await params;
  const result = await getRemateByIdAction(id);

  if (!result.ok) {
    if (result.error.code === "NOT_FOUND" || result.error.code === "VALIDATION") notFound();
    throw new Error(result.error.message);
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-medium tracking-tight sm:text-3xl">Editar remate</h1>
        <p className="text-sm text-muted">{result.data.nombre}</p>
      </header>
      <RemateForm remate={result.data} />
    </div>
  );
}
