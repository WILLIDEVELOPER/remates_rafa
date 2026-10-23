import { SearchX, TriangleAlert } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { LinkButton } from "@/components/ui/link-button";
import { RemateCard } from "@/components/ui/remate-card";
import { listRematesAction } from "@/server/presentation/actions/remate-actions";
import { ListPagination } from "@/components/ui/list-pagination";

type SearchParams = Record<string, string | string[] | undefined>;

export async function RematesResults({ params }: { params: SearchParams }) {
  const result = await listRematesAction(params);

  if (!result.ok) {
    return (
      <EmptyState
        icon={TriangleAlert}
        title="No pudimos cargar los remates"
        description="Ocurrió un problema al consultar la información. Inténtalo de nuevo en unos instantes."
        action={
          <LinkButton href="/remates" variant="outline" className="h-10 px-5 font-medium">
            Reintentar
          </LinkButton>
        }
      />
    );
  }

  const { items, total, page, pageSize, totalPages } = result.data;

  if (total === 0) {
    return (
      <EmptyState
        icon={SearchX}
        title="No encontramos remates con esos filtros"
        description="Prueba ampliando el rango de precio, quitando algún filtro o buscando en otro departamento."
        action={
          <LinkButton href="/remates" className="h-10 px-5 font-medium">
            Ver todos los remates
          </LinkButton>
        }
      />
    );
  }

  if (items.length === 0) {
    const firstPage = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (key !== "pagina" && typeof value === "string") firstPage.set(key, value);
    }
    const query = firstPage.toString();

    return (
      <EmptyState
        icon={SearchX}
        title="Esta página no existe"
        description={`Con estos filtros hay ${total} remates repartidos en ${totalPages} páginas.`}
        action={
          <LinkButton href={query ? `/remates?${query}` : "/remates"} className="h-10 px-5 font-medium">
            Ir a la primera página
          </LinkButton>
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <p className="text-sm text-muted" aria-live="polite">
        {total === 1 ? "1 remate encontrado" : `${total} remates encontrados`}
        {totalPages > 1 ? ` · Página ${page} de ${totalPages}` : ""}
      </p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((remate, index) => (
          <RemateCard key={remate.id} remate={remate} priority={index < 3} headingLevel="h2" />
        ))}
      </div>
      <ListPagination page={page} totalPages={totalPages} total={total} pageSize={pageSize} itemsLabel="remates" />
    </div>
  );
}
