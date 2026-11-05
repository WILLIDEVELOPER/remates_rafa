import Link from "next/link";
import { cn } from "@/lib/utils";
import { ZONAS, zonaPath } from "@/lib/seo-zones";

/** Enlaces internos a las páginas por zona; `exclude` omite la zona en la que ya estás. */
export function ZoneLinks({
  exclude,
  className,
  linkClassName,
}: {
  exclude?: string;
  className?: string;
  linkClassName?: string;
}) {
  return (
    <ul className={cn("flex flex-wrap gap-2", className)}>
      {ZONAS.filter((zona) => zona.slug !== exclude).map((zona) => (
        <li key={zona.slug}>
          <Link
            href={zonaPath(zona)}
            className={cn(
              "inline-flex items-center rounded-full border border-border px-3.5 py-1.5 text-sm transition-colors hover:border-foreground/40 hover:bg-surface-secondary",
              linkClassName,
            )}
          >
            Remates judiciales en {zona.nombre}
          </Link>
        </li>
      ))}
    </ul>
  );
}
