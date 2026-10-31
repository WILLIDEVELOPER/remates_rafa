import { MessageSquareQuote } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDate } from "@/lib/format";
import { listPublicResenasAction } from "@/server/presentation/actions/resena-actions";
import { ReviewDialog } from "./review-dialog";

interface RemateReviewsProps {
  remateId: string;
  remateNombre: string;
}

export async function RemateReviews({ remateId, remateNombre }: RemateReviewsProps) {
  const result = await listPublicResenasAction(remateId);
  // Si no se pueden leer las reseñas, la sección se omite en lugar de romper el detalle.
  if (!result.ok) return null;

  const { items, total } = result.data;

  return (
    <section aria-labelledby="resenas" className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 id="resenas" className="text-xl font-medium tracking-tight">
            Reseñas{total > 0 ? ` (${total})` : ""}
          </h2>
          <p className="text-sm text-muted">Opiniones de personas interesadas en este remate.</p>
        </div>
        <ReviewDialog remateId={remateId} remateNombre={remateNombre} />
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={MessageSquareQuote}
          title="Aún no hay reseñas"
          description="Sé la primera persona en compartir su opinión sobre este remate."
        />
      ) : (
        <ul className="flex flex-col gap-4">
          {items.map((review) => (
            <li key={review.id} className="flex gap-4 rounded-2xl border border-border p-5">
              <span
                aria-hidden
                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-secondary text-sm font-medium uppercase"
              >
                {review.nombre.charAt(0)}
              </span>
              <div className="flex min-w-0 flex-col gap-1.5">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                  <h3 className="text-sm font-medium">{review.nombre}</h3>
                  <time dateTime={review.createdAt} className="text-xs text-muted">
                    {formatDate(review.createdAt)}
                  </time>
                </div>
                <p className="text-sm leading-relaxed break-words whitespace-pre-line text-muted">
                  {review.comentario}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
