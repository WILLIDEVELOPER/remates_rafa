import { ChevronRight, MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { WhatsappInlineButton } from "@/components/layout/whatsapp-button";
import { EstadoChip } from "@/components/ui/estado-chip";
import { RemateGridSkeleton } from "@/components/ui/remate-card-skeleton";
import { InquiryDialog } from "@/features/contact";
import {
  RelatedRemates,
  RemateGallery,
  RemateLocation,
  RemateSpecs,
} from "@/features/remates";
import { RemateReviews } from "@/features/reviews";
import { discountPercent, formatCOP, formatDate, formatLocation } from "@/lib/format";
import { TIPO_LABELS } from "@/lib/remate-labels";
import { getBaseUrl, SITE } from "@/lib/site";
import { getRemateBySlugAction } from "@/server/presentation/actions/remate-actions";

async function loadRemate(slug: string) {
  const result = await getRemateBySlugAction(slug);

  if (result.ok) return result.data;
  if (result.error.code === "NOT_FOUND" || result.error.code === "VALIDATION") {
    notFound();
  }
  throw new Error(result.error.message);
}

export async function generateMetadata({
  params,
}: PageProps<"/remates/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const result = await getRemateBySlugAction(slug);
  if (!result.ok) return { title: "Remate no encontrado" };

  const remate = result.data;
  const description = `${TIPO_LABELS[remate.tipoInmueble]} en ${remate.municipio}, ${remate.departamento}. Precio base ${formatCOP(remate.precioBase)}. ${remate.descripcion}`.slice(0, 200);

  return {
    title: remate.nombre,
    description,
    alternates: { canonical: `/remates/${remate.slug}` },
    openGraph: {
      title: remate.nombre,
      description,
      type: "website",
      images: remate.imagenPrincipalUrl ? [{ url: remate.imagenPrincipalUrl }] : undefined,
    },
  };
}

const AVAILABILITY = {
  disponible: "https://schema.org/InStock",
  adjudicado: "https://schema.org/SoldOut",
  suspendido: "https://schema.org/Discontinued",
} as const;

export default async function RemateDetailPage({ params }: PageProps<"/remates/[slug]">) {
  const { slug } = await params;
  const remate = await loadRemate(slug);
  const discount = discountPercent(remate.precioBase, remate.precioComercial);

  const baseUrl = getBaseUrl().replace(/\/$/, "");
  const absolute = (url: string) => (url.startsWith("/") ? `${baseUrl}${url}` : url);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: remate.nombre,
    description: remate.descripcion,
    url: `${baseUrl}/remates/${remate.slug}`,
    image: remate.imagenUrls.map(absolute),
    datePosted: remate.createdAt,
    offers: {
      "@type": "Offer",
      price: remate.precioBase,
      priceCurrency: "COP",
      availability: AVAILABILITY[remate.estado],
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: remate.direccion ?? undefined,
      addressLocality: remate.municipio,
      addressRegion: remate.departamento,
      addressCountry: "CO",
    },
  };

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 py-10 lg:px-8 lg:py-14 xl:px-16">
      <script
        type="application/ld+json"
        // Se escapa "<" para que ningún texto del remate pueda cerrar la etiqueta <script>.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <div className="flex flex-col gap-6">
        <nav aria-label="Migas de pan" className="flex items-center gap-1.5 text-sm text-muted">
          <Link href="/remates" className="transition-colors hover:text-foreground">
            Remates
          </Link>
          <ChevronRight className="size-3.5" />
          <span className="line-clamp-1 text-foreground">{remate.nombre}</span>
        </nav>

        <header className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <EstadoChip estado={remate.estado} size="md" />
            <span className="text-xs font-medium tracking-wide text-muted uppercase">
              {TIPO_LABELS[remate.tipoInmueble]}
            </span>
          </div>
          <h1 className="text-3xl font-medium tracking-tight sm:text-4xl">{remate.nombre}</h1>
          <p className="flex items-center gap-1.5 text-muted">
            <MapPin className="size-4 shrink-0" />
            {formatLocation([remate.municipio, remate.ciudad, remate.departamento])}
          </p>
        </header>
      </div>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12">
        <div className="flex min-w-0 flex-col gap-12">
          <RemateGallery images={remate.imagenUrls} nombre={remate.nombre} />
          <RemateSpecs remate={remate} />
          <section aria-labelledby="descripcion" className="flex flex-col gap-4">
            <h2 id="descripcion" className="text-xl font-medium tracking-tight">
              Descripción
            </h2>
            <p className="leading-relaxed whitespace-pre-line text-muted">{remate.descripcion}</p>
          </section>
          <RemateLocation remate={remate} />
          <Suspense fallback={<div className="h-40 animate-pulse rounded-2xl bg-surface-secondary" />}>
            <RemateReviews remateId={remate.id} remateNombre={remate.nombre} />
          </Suspense>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="flex flex-col gap-5 rounded-2xl border border-border p-6">
            <div className="flex flex-col gap-1">
              <span className="text-sm text-muted">Precio base</span>
              <span className="text-3xl font-semibold tracking-tight">
                {formatCOP(remate.precioBase)}
              </span>
              {remate.precioComercial ? (
                <span className="text-sm text-muted">
                  Comercial{" "}
                  <span className="line-through">{formatCOP(remate.precioComercial)}</span>
                  {discount ? ` · ${discount} % menos` : ""}
                </span>
              ) : null}
            </div>

            <div className="flex flex-col gap-1 border-t border-border pt-4 text-sm">
              <span className="text-muted">Fecha del remate</span>
              <span className="font-medium">
                {remate.fechaRemate ? formatDate(remate.fechaRemate) : "Por definir"}
              </span>
            </div>

            <div className="flex flex-col gap-3">
              <InquiryDialog remateId={remate.id} remateNombre={remate.nombre} />
              <WhatsappInlineButton
                message={`Hola, quiero información sobre el remate "${remate.nombre}": ${baseUrl}/remates/${remate.slug}`}
              />
              <a
                href={SITE.phoneHref}
                className="flex h-11 items-center justify-center gap-2 rounded-full border border-border text-sm font-medium transition-colors hover:bg-surface-secondary"
              >
                <Phone className="size-4" />
                Llamar {SITE.phoneDisplay}
              </a>
            </div>
          </div>
        </aside>
      </div>

      <Suspense fallback={<RemateGridSkeleton count={3} />}>
        <RelatedRemates departamento={remate.departamento} excludeId={remate.id} />
      </Suspense>
    </div>
  );
}
