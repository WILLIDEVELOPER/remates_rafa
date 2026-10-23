import type { Metadata } from "next";
import { OrphanImages } from "@/features/admin";
import { listOrphanImagesAction } from "@/server/presentation/actions/image-actions";

export const metadata: Metadata = { title: "Imágenes huérfanas" };

export default async function AdminImagenesPage() {
  const result = await listOrphanImagesAction();

  if (!result.ok) throw new Error(result.error.message);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-medium tracking-tight sm:text-3xl">Imágenes huérfanas</h1>
        <p className="text-sm text-muted">
          Revisa y elimina las imágenes del almacenamiento que ningún remate está usando.
        </p>
      </header>

      <OrphanImages data={result.data} />
    </div>
  );
}
