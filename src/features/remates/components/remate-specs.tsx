import {
  Bath,
  BedDouble,
  Building2,
  CalendarDays,
  Percent,
  Ruler,
  Tag,
  Wallet,
} from "lucide-react";
import type { ReactNode } from "react";
import type { RemateDto } from "@/server/application/dtos/remate-dto";
import { EstadoChip } from "@/components/ui/estado-chip";
import { discountPercent, formatArea, formatCOP, formatDate } from "@/lib/format";
import { TIPO_LABELS } from "@/lib/remate-labels";

function Spec({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5 rounded-xl border border-border p-4">
      <dt className="flex items-center gap-2 text-xs text-muted">
        <span aria-hidden>{icon}</span>
        {label}
      </dt>
      <dd className="text-sm font-medium">{children}</dd>
    </div>
  );
}

export function RemateSpecs({ remate }: { remate: RemateDto }) {
  const discount = discountPercent(remate.precioBase, remate.precioComercial);
  const iconClass = "size-4";

  return (
    <section aria-labelledby="ficha-tecnica" className="flex flex-col gap-4">
      <h2 id="ficha-tecnica" className="text-xl font-medium tracking-tight">
        Ficha técnica
      </h2>
      <dl className="grid gap-3 sm:grid-cols-2">
        <Spec icon={<Wallet className={iconClass} />} label="Precio base">
          {formatCOP(remate.precioBase)}
        </Spec>
        {remate.precioComercial ? (
          <Spec icon={<Tag className={iconClass} />} label="Precio comercial">
            {formatCOP(remate.precioComercial)}
          </Spec>
        ) : null}
        {discount ? (
          <Spec icon={<Percent className={iconClass} />} label="Descuento frente al comercial">
            {discount} %
          </Spec>
        ) : null}
        <Spec icon={<Building2 className={iconClass} />} label="Tipo de inmueble">
          {TIPO_LABELS[remate.tipoInmueble]}
        </Spec>
        <Spec icon={<Ruler className={iconClass} />} label="Área">
          {formatArea(remate.area)}
        </Spec>
        {remate.habitaciones !== null ? (
          <Spec icon={<BedDouble className={iconClass} />} label="Habitaciones">
            {remate.habitaciones}
          </Spec>
        ) : null}
        {remate.banos !== null ? (
          <Spec icon={<Bath className={iconClass} />} label="Baños">
            {remate.banos}
          </Spec>
        ) : null}
        <Spec icon={<CalendarDays className={iconClass} />} label="Fecha del remate">
          {remate.fechaRemate ? formatDate(remate.fechaRemate) : "Por definir"}
        </Spec>
        <Spec icon={<Tag className={iconClass} />} label="Estado">
          <EstadoChip estado={remate.estado} size="md" />
        </Spec>
      </dl>
    </section>
  );
}
