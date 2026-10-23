import { RemateCard } from "@/components/ui/remate-card";
import { getRelatedRematesAction } from "@/server/presentation/actions/remate-actions";

export async function RelatedRemates({
  departamento,
  excludeId,
}: {
  departamento: string;
  excludeId: string;
}) {
  const result = await getRelatedRematesAction({ departamento, excludeId, limit: 3 });
  const remates = result.ok ? result.data : [];

  if (remates.length === 0) return null;

  return (
    <section aria-labelledby="relacionados" className="flex flex-col gap-6">
      <h2 id="relacionados" className="text-2xl font-medium tracking-tight">
        Más remates en {departamento}
      </h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {remates.map((remate) => (
          <RemateCard key={remate.id} remate={remate} />
        ))}
      </div>
    </section>
  );
}
