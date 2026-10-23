import { Card, Chip } from "@heroui/react";
import { Bath, BedDouble, CalendarDays, MapPin, Ruler } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { RemateDto } from "@/server/application/dtos/remate-dto";
import { discountPercent, formatArea, formatCOP, formatDate } from "@/lib/format";
import { TIPO_LABELS } from "@/lib/remate-labels";
import { EstadoChip } from "./estado-chip";

export function RemateCard({
  remate,
  priority = false,
  headingLevel: Heading = "h3",
}: {
  remate: RemateDto;
  priority?: boolean;
  /** Nivel del título según el contexto de la página (h2 bajo un h1, h3 bajo un h2). */
  headingLevel?: "h2" | "h3";
}) {
  const discount = discountPercent(remate.precioBase, remate.precioComercial);

  return (
    <Link
      href={`/remates/${remate.slug}`}
      className="group block h-full rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2"
    >
      <Card className="h-full gap-0 overflow-hidden rounded-2xl border border-border p-0 shadow-none transition-colors duration-300 group-hover:border-foreground/40">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-secondary">
          {remate.imagenPrincipalUrl ? (
            <Image
              src={remate.imagenPrincipalUrl}
              alt={remate.nombre}
              fill
              priority={priority}
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : null}
          <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
            <EstadoChip estado={remate.estado} className="bg-white/90 backdrop-blur-sm" />
            {remate.destacado ? (
              <Chip size="sm" variant="primary" className="rounded-full">
                Destacado
              </Chip>
            ) : null}
          </div>
        </div>

        <Card.Content className="flex flex-1 flex-col gap-3 p-5">
          <div className="flex flex-col gap-1">
            <p className="text-xs font-medium tracking-wide text-muted uppercase">
              {TIPO_LABELS[remate.tipoInmueble]}
            </p>
            <Heading className="line-clamp-1 text-lg font-medium tracking-tight">
              {remate.nombre}
            </Heading>
            <p className="flex items-center gap-1.5 text-sm text-muted">
              <MapPin className="size-3.5 shrink-0" />
              <span className="line-clamp-1">
                {remate.municipio}, {remate.departamento}
              </span>
            </p>
          </div>

          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="text-xl font-semibold tracking-tight">
              {formatCOP(remate.precioBase)}
            </span>
            {remate.precioComercial ? (
              <span className="text-sm text-muted line-through">
                {formatCOP(remate.precioComercial)}
              </span>
            ) : null}
            {discount ? (
              <Chip size="sm" variant="secondary" className="rounded-full">
                -{discount}%
              </Chip>
            ) : null}
          </div>

          <ul className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-border pt-3 text-sm text-muted">
            <li className="flex items-center gap-1.5">
              <Ruler className="size-4" />
              {formatArea(remate.area)}
            </li>
            {remate.habitaciones !== null ? (
              <li className="flex items-center gap-1.5">
                <BedDouble className="size-4" />
                {remate.habitaciones}
              </li>
            ) : null}
            {remate.banos !== null ? (
              <li className="flex items-center gap-1.5">
                <Bath className="size-4" />
                {remate.banos}
              </li>
            ) : null}
            {remate.fechaRemate ? (
              <li className="flex items-center gap-1.5">
                <CalendarDays className="size-4" />
                {formatDate(remate.fechaRemate)}
              </li>
            ) : null}
          </ul>
        </Card.Content>
      </Card>
    </Link>
  );
}
