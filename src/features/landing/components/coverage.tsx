import Link from "next/link";
import { cn } from "@/lib/utils";

interface CoverageProps {
  /** Todos los departamentos del país. */
  departamentos: readonly string[];
  /** Remates activos por departamento. */
  counts: { departamento: string; total: number }[];
}

export function Coverage({ departamentos, counts }: CoverageProps) {
  const totals = new Map(counts.map((item) => [item.departamento, item.total]));
  const totalRemates = counts.reduce((sum, item) => sum + item.total, 0);

  const sorted = [...departamentos].sort(
    (a, b) =>
      (totals.get(b) ?? 0) - (totals.get(a) ?? 0) || a.localeCompare(b, "es-CO"),
  );

  return (
    <section id="cobertura" className="scroll-mt-20 py-20 lg:py-28">
      <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 lg:grid-cols-[2fr_3fr] lg:gap-16 lg:px-8 xl:px-16">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium text-muted">Cobertura nacional</p>
            <h2 className="text-3xl font-medium tracking-tight sm:text-4xl">
              Oportunidades en todo el país
            </h2>
            <p className="text-muted">
              Publicamos remates en los 32 departamentos y Bogotá D.C. Explora
              los que hoy tienen inmuebles disponibles.
            </p>
          </div>
          <dl className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-border p-5">
              <dt className="text-sm text-muted">Remates activos</dt>
              <dd className="mt-1 text-3xl font-semibold tracking-tight">{totalRemates}</dd>
            </div>
            <div className="rounded-2xl border border-border p-5">
              <dt className="text-sm text-muted">Departamentos con oferta</dt>
              <dd className="mt-1 text-3xl font-semibold tracking-tight">{counts.length}</dd>
            </div>
          </dl>
        </div>

        <ul className="flex flex-wrap content-start gap-2">
          {sorted.map((departamento) => {
            const total = totals.get(departamento) ?? 0;
            const className = cn(
              "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm transition-colors duration-300",
              total > 0
                ? "border-foreground bg-foreground text-background hover:bg-foreground/80"
                : "border-border text-muted",
            );

            return (
              <li key={departamento}>
                {total > 0 ? (
                  <Link
                    href={`/remates?departamento=${encodeURIComponent(departamento)}`}
                    className={className}
                  >
                    {departamento}
                    <span className="rounded-full bg-background/20 px-1.5 text-xs">{total}</span>
                  </Link>
                ) : (
                  <span className={className}>{departamento}</span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
