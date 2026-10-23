import { LinkButton } from "@/components/ui/link-button";

export function CtaSection() {
  return (
    <section className="px-4 pb-20 lg:px-8 lg:pb-28 xl:px-16">
      <div className="dark mx-auto flex w-full max-w-7xl flex-col gap-8 rounded-3xl bg-background px-6 py-14 text-foreground sm:px-12 lg:flex-row lg:items-center lg:justify-between lg:py-16">
        <div className="flex max-w-xl flex-col gap-3">
          <h2 className="text-3xl font-medium tracking-tight sm:text-4xl">
            ¿Listo para encontrar tu próxima inversión?
          </h2>
          <p className="text-muted">
            Cuéntanos qué buscas y un asesor te ayudará a identificar los
            remates que mejor se ajustan a tu presupuesto.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <LinkButton href="/remates" withArrow className="h-10 px-5 font-medium">
            Ver remates
          </LinkButton>
          <LinkButton
            href="/contacto"
            variant="outline"
            withArrow
            className="h-10 border-foreground/60 px-5 font-medium"
          >
            Hablar con un asesor
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
