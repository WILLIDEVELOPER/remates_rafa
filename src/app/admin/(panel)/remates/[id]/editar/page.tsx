import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RemateForm, RemateResenas } from "@/features/admin";
import { getRemateByIdAction } from "@/server/presentation/actions/remate-actions";
import { adminListResenasAction } from "@/server/presentation/actions/resena-actions";

export const metadata: Metadata = { title: "Editar remate" };

export default async function EditarRematePage({
  params,
}: PageProps<"/admin/remates/[id]/editar">) {
  const { id } = await params;
  const [result, resenas] = await Promise.all([
    getRemateByIdAction(id),
    adminListResenasAction(id),
  ]);

  if (!result.ok) {
    if (result.error.code === "NOT_FOUND" || result.error.code === "VALIDATION") notFound();
    throw new Error(result.error.message);
  }
  if (!resenas.ok) throw new Error(resenas.error.message);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
      <div className="flex flex-col gap-6">
        <header className="flex flex-col gap-1">
          <h1 className="text-2xl font-medium tracking-tight sm:text-3xl">Editar remate</h1>
          <p className="text-sm text-muted">{result.data.nombre}</p>
        </header>
        <RemateForm remate={result.data} />
      </div>
      <RemateResenas resenas={resenas.data.items} />
    </div>
  );
}
