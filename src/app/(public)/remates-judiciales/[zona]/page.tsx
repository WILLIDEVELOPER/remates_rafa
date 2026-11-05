import { ChevronRight, SearchX } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { breadcrumbJsonLd, JsonLd } from "@/components/seo/json-ld";
import { EmptyState } from "@/components/ui/empty-state";
import { LinkButton } from "@/components/ui/link-button";
import { RemateCard } from "@/components/ui/remate-card";
import { RemateFaq, ZoneLinks } from "@/features/seo";
import { getZona, GUIA_PATH, zonaListadoHref, zonaPath, ZONAS } from "@/lib/seo-zones";
import { listRematesAction } from "@/server/presentation/actions/remate-actions";

// Se regenera cada 5 min y al instante cuando el admin modifica remates (revalidatePath).
export const revalidate = 300;
export const dynamicParams = false;

export function generateStaticParams() {
  return ZONAS.map((zona) => ({ zona: zona.slug }));
}

// El título y la página usan los mismos datos: `cache` evita consultarlos dos veces.
const loadZona = cache(async (slug: string) => {
  const zona = getZona(slug);
  if (!zona) notFound();

  const result = await listRematesAction(zona.filtros);
  return { zona, result };
});

export async function generateMetadata({
  params,
}: PageProps<"/remates-judiciales/[zona]">): Promise<Metadata> {
  const { zona: slug } = await params;
  const { zona, result } = await loadZona(slug);
  const total = result.ok ? result.data.total : 0;

  return {
    title: `Remates judiciales en ${zona.nombre}`,
    description: `Inmuebles en remate judicial en ${zona.nombre}: casas, apartamentos y lotes con precio base y fecha. Asesoría para participar y adjudicarte.`,
    alternates: { canonical: zonaPath(zona) },
    // Una zona sin remates publicados sería una página vacía: no se indexa hasta que tenga contenido.
    robots: total === 0 ? { index: false, follow: true } : undefined,
    openGraph: {
      title: `Remates judiciales en ${zona.nombre}`,
      description: zona.intro,
      type: "website",
      url: zonaPath(zona),
    },
  };
}

export default async function ZonaPage({ params }: PageProps<"/remates-judiciales/[zona]">) {
  const { zona: slug } = await params;
  const { zona, result } = await loadZona(slug);

  const remates = result.ok ? result.data.items : [];
  const total = result.ok ? result.data.total : 0;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 py-12 lg:px-8 lg:py-16 xl:px-16">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Inicio", path: "/" },
          { name: "Remates", path: "/remates" },
          { name: `Remates judiciales en ${zona.nombre}`, path: zonaPath(zona) },
        ])}
      />

      <div className="flex flex-col gap-6">
        <nav aria-label="Migas de pan" className="flex items-center gap-1.5 text-sm text-muted">
          <Link href="/remates" className="transition-colors hover:text-foreground">
            Remates
          </Link>
          <ChevronRight className="size-3.5" />
          <span className="text-foreground">{zona.nombre}</span>
        </nav>

        <header className="flex max-w-3xl flex-col gap-3">
          <h1 className="text-3xl font-medium tracking-tight sm:text-4xl">
            Remates judiciales en {zona.nombre}
          </h1>
          <p className="text-muted">{zona.intro}</p>
        </header>
      </div>

      <section aria-labelledby="remates-zona" className="flex flex-col gap-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="remates-zona" className="text-2xl font-medium tracking-tight">
            Inmuebles en remate en {zona.nombre}
            {total > 0 ? ` (${total})` : ""}
          </h2>
          {total > remates.length ? (
            <LinkButton href={zonaListadoHref(zona)} variant="outline" withArrow className="h-10 px-5 font-medium">
              Ver todos con filtros
            </LinkButton>
          ) : null}
        </div>

        {remates.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title={`Por ahora no hay remates publicados en ${zona.nombre}`}
            description="Publicamos remates nuevos con frecuencia. Escríbenos y te avisamos cuando salga uno que se ajuste a lo que buscas."
            action={
              <LinkButton href="/contacto" className="h-10 px-5 font-medium">
                Hablar con un asesor
              </LinkButton>
            }
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {remates.map((remate, index) => (
              <RemateCard key={remate.id} remate={remate} priority={index < 3} headingLevel="h3" />
            ))}
          </div>
        )}
      </section>

      <section aria-labelledby="asesoria" className="flex flex-col gap-4 rounded-2xl border border-border p-6 sm:p-8">
        <h2 id="asesoria" className="text-2xl font-medium tracking-tight">
          Asesoría en remates judiciales en {zona.nombre}
        </h2>
        <p className="max-w-3xl text-muted">
          Te acompañamos en todo el proceso: revisamos la situación jurídica del inmueble, te
          explicamos el precio base y el valor para participar, y te guiamos hasta la adjudicación y
          el traspaso.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <LinkButton href="/contacto" withArrow className="h-10 px-5 font-medium">
            Hablar con un asesor
          </LinkButton>
          <LinkButton href={GUIA_PATH} variant="outline" withArrow className="h-10 px-5 font-medium">
            Cómo participar en un remate judicial
          </LinkButton>
        </div>
      </section>

      <RemateFaq />

      <section aria-labelledby="otras-zonas" className="flex flex-col gap-4">
        <h2 id="otras-zonas" className="text-xl font-medium tracking-tight">
          Remates en otras zonas
        </h2>
        <ZoneLinks exclude={zona.slug} />
      </section>
    </div>
  );
}
