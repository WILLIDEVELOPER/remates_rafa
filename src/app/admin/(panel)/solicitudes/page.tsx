import type { Metadata } from "next";
import { LinkButton } from "@/components/ui/link-button";
import { ListPagination } from "@/components/ui/list-pagination";
import { SolicitudesList } from "@/features/admin";
import { listContactRequestsAction } from "@/server/presentation/actions/contact-actions";

export const metadata: Metadata = { title: "Solicitudes" };

export default async function AdminSolicitudesPage({
  searchParams,
}: PageProps<"/admin/solicitudes">) {
  const params = await searchParams;
  const result = await listContactRequestsAction({
    pagina: typeof params.pagina === "string" ? params.pagina : undefined,
    filtro: typeof params.filtro === "string" ? params.filtro : undefined,
  });

  if (!result.ok) throw new Error(result.error.message);
  const { items, total, unread, page, pageSize, totalPages } = result.data;
  const onlyUnread = params.filtro === "sin_leer";

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-medium tracking-tight sm:text-3xl">Solicitudes</h1>
        <p className="text-sm text-muted">
          Mensajes recibidos desde el formulario de contacto y desde cada remate.
        </p>
      </header>

      <div className="flex gap-2">
        <LinkButton href="/admin/solicitudes" variant={onlyUnread ? "outline" : "primary"} size="sm" className="px-4">
          Todas
        </LinkButton>
        <LinkButton
          href="/admin/solicitudes?filtro=sin_leer"
          variant={onlyUnread ? "primary" : "outline"}
          size="sm"
          className="px-4"
        >
          Sin leer ({unread})
        </LinkButton>
      </div>

      <SolicitudesList requests={items} />
      <ListPagination page={page} totalPages={totalPages} total={total} pageSize={pageSize} itemsLabel="solicitudes" />
    </div>
  );
}
