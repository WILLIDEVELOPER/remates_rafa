import { Chip } from "@heroui/react";
import type { RemateDto } from "@/server/application/dtos/remate-dto";
import { discountPercent, formatCOP } from "@/lib/format";

type Prices = Pick<RemateDto, "precioBase" | "precioComercial" | "precioDerecho">;

/** Qué significa cada precio; se repite en la ficha del remate para que no quede duda. */
export const PRICE_HELP = {
  base: "El 70 % del valor comercial: el remate parte desde este valor.",
  derecho: "El 40 % del valor comercial: lo que debes consignar para tener derecho a participar.",
  comercial: "Avalúo o valor comercial del inmueble.",
} as const;

/** Versión compacta para las tarjetas del listado. */
export function RemateCardPrices({ remate }: { remate: Prices }) {
  const discount = discountPercent(remate.precioBase, remate.precioComercial);

  return (
    <dl className="flex flex-col gap-1.5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3">
        <dt className="text-xs text-muted">Precio base (70 %)</dt>
        <dd className="flex items-baseline gap-2">
          <span className="text-xl font-semibold tracking-tight">{formatCOP(remate.precioBase)}</span>
          {discount ? (
            <Chip size="sm" variant="secondary" className="rounded-full">
              -{discount}%
            </Chip>
          ) : null}
        </dd>
      </div>
      {remate.precioDerecho ? (
        <div className="flex items-baseline justify-between gap-x-3 text-sm">
          <dt className="text-xs text-muted">Derecho a participar (40 %)</dt>
          <dd className="font-medium">{formatCOP(remate.precioDerecho)}</dd>
        </div>
      ) : null}
      {remate.precioComercial ? (
        <div className="flex items-baseline justify-between gap-x-3 text-sm">
          <dt className="text-xs text-muted">Valor comercial</dt>
          <dd className="text-muted line-through">{formatCOP(remate.precioComercial)}</dd>
        </div>
      ) : null}
    </dl>
  );
}

function PriceRow({
  label,
  help,
  value,
  emphasis,
  strike,
}: {
  label: string;
  help: string;
  value: string;
  emphasis?: boolean;
  strike?: boolean;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-sm text-muted">{label}</dt>
      <dd
        className={
          emphasis
            ? "text-3xl font-semibold tracking-tight"
            : strike
              ? "text-lg font-medium text-muted line-through"
              : "text-xl font-semibold tracking-tight"
        }
      >
        {value}
      </dd>
      <dd className="text-xs text-muted">{help}</dd>
    </div>
  );
}

/** Los tres precios del remate con su explicación, para el panel del detalle. */
export function RemateDetailPrices({ remate }: { remate: Prices }) {
  const discount = discountPercent(remate.precioBase, remate.precioComercial);

  return (
    <dl className="flex flex-col gap-4">
      <PriceRow label="Precio base (70 %)" help={PRICE_HELP.base} value={formatCOP(remate.precioBase)} emphasis />
      {remate.precioDerecho ? (
        <PriceRow
          label="Derecho a participar (40 %)"
          help={PRICE_HELP.derecho}
          value={formatCOP(remate.precioDerecho)}
        />
      ) : null}
      {remate.precioComercial ? (
        <PriceRow
          label={`Valor comercial${discount ? ` · ${discount} % por debajo` : ""}`}
          help={PRICE_HELP.comercial}
          value={formatCOP(remate.precioComercial)}
          strike
        />
      ) : null}
    </dl>
  );
}
