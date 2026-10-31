"use client";

import { Button, Card } from "@heroui/react";
import { Mail, MessageSquareQuote, Pencil, Phone, Trash2 } from "lucide-react";
import { useState } from "react";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDateTime } from "@/lib/format";
import type { AdminResenaDto } from "@/server/application/dtos/resena-dto";
import { DeleteResenaDialog } from "./delete-resena-dialog";
import { EditResenaDialog } from "./edit-resena-dialog";

/** Reseñas de un remate: el administrador puede corregirlas o eliminarlas. */
export function RemateResenas({ resenas }: { resenas: AdminResenaDto[] }) {
  const [editing, setEditing] = useState<AdminResenaDto | null>(null);
  const [deleting, setDeleting] = useState<AdminResenaDto | null>(null);

  return (
    <section aria-labelledby="resenas-admin" className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 id="resenas-admin" className="text-xl font-medium tracking-tight">
          Reseñas ({resenas.length})
        </h2>
        <p className="text-sm text-muted">
          Se publican al instante en el sitio. El correo y el teléfono solo los ves tú.
        </p>
      </div>

      {resenas.length === 0 ? (
        <EmptyState
          icon={MessageSquareQuote}
          title="Este remate no tiene reseñas"
          description="Cuando alguien opine desde la página pública, su reseña aparecerá aquí."
        />
      ) : (
        <ul className="flex flex-col gap-4">
          {resenas.map((resena) => (
            <li key={resena.id}>
              <Card className="gap-4 rounded-2xl border border-border p-5 shadow-none">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-base font-medium tracking-tight">{resena.nombre}</h3>
                    <p className="text-xs text-muted">{formatDateTime(resena.createdAt)}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onPress={() => setEditing(resena)} className="rounded-full">
                      <Pencil className="size-3.5" />
                      Editar
                    </Button>
                    <Button size="sm" variant="danger-soft" onPress={() => setDeleting(resena)} className="rounded-full">
                      <Trash2 className="size-3.5" />
                      Eliminar
                    </Button>
                  </div>
                </div>

                <p className="text-sm leading-relaxed break-words whitespace-pre-line">{resena.comentario}</p>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border pt-3 text-sm text-muted">
                  <a href={`mailto:${resena.email}`} className="flex items-center gap-1.5 hover:text-foreground">
                    <Mail className="size-3.5" />
                    {resena.email}
                  </a>
                  <a
                    href={`tel:${resena.telefono.replace(/[^\d+]/g, "")}`}
                    className="flex items-center gap-1.5 hover:text-foreground"
                  >
                    <Phone className="size-3.5" />
                    {resena.telefono}
                  </a>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}

      <EditResenaDialog resena={editing} onClose={() => setEditing(null)} />
      <DeleteResenaDialog resena={deleting} onClose={() => setDeleting(null)} />
    </section>
  );
}
