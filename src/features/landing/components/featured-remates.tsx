import { LinkButton } from "@/components/ui/link-button";
import { RemateCard } from "@/components/ui/remate-card";
import { RemateGridSkeleton } from "@/components/ui/remate-card-skeleton";
import { getFeaturedRematesAction } from "@/server/presentation/actions/remate-actions";

const FEATURED_COUNT = 6;

export async function FeaturedRemates() {
  const result = await getFeaturedRematesAction(FEATURED_COUNT);
  const remates = result.ok ? result.data : [];

  if (remates.length === 0) return null;

  return (
    <FeaturedSection>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {remates.map((remate) => (
          <RemateCard key={remate.id} remate={remate} />
        ))}
      </div>
    </FeaturedSection>
  );
}

export function FeaturedRematesSkeleton() {
  return (
    <FeaturedSection>
      <RemateGridSkeleton count={FEATURED_COUNT} />
    </FeaturedSection>
  );
}

function FeaturedSection({ children }: { children: React.ReactNode }) {
  return (
    <section id="destacados" className="scroll-mt-20 py-20 lg:py-28">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 lg:px-8 xl:px-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex max-w-xl flex-col gap-3">
            <p className="text-sm font-medium text-muted">Selección del mes</p>
            <h2 className="text-3xl font-medium tracking-tight sm:text-4xl">
              Remates destacados
            </h2>
            <p className="text-muted">
              Las oportunidades con mayor descuento frente al valor comercial,
              revisadas por nuestro equipo.
            </p>
          </div>
          <LinkButton href="/remates" variant="outline" withArrow className="h-10 w-fit px-5 font-medium">
            Ver todos los remates
          </LinkButton>
        </div>
        {children}
      </div>
    </section>
  );
}
