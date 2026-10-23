import { ExternalLink, MapPin } from "lucide-react";
import { formatLocation } from "@/lib/format";
import type { RemateDto } from "@/server/application/dtos/remate-dto";

export function RemateLocation({ remate }: { remate: RemateDto }) {
  const query = [remate.direccion, remate.municipio, remate.ciudad, remate.departamento, "Colombia"]
    .filter(Boolean)
    .join(", ");

  return (
    <section aria-labelledby="ubicacion" className="flex flex-col gap-4">
      <h2 id="ubicacion" className="text-xl font-medium tracking-tight">
        Ubicación
      </h2>
      <p className="flex items-start gap-2 text-sm text-muted">
        <MapPin className="mt-0.5 size-4 shrink-0" />
        <span>
          {formatLocation([remate.departamento, remate.ciudad, remate.municipio]).replaceAll(", ", " / ")}
          {remate.direccion ? ` · ${remate.direccion}` : ""}
        </span>
      </p>
      <div className="aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border bg-surface-secondary">
        <iframe
          title={`Mapa de ${remate.nombre}`}
          src={`https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=14&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="size-full border-0"
        />
      </div>
      <a
        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex w-fit items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline"
      >
        Abrir en Google Maps
        <ExternalLink className="size-3.5" />
      </a>
    </section>
  );
}
