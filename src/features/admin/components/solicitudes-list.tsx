"use client";

import { Button, Card, Chip, toast } from "@heroui/react";
import { Building2, Mail, MailOpen, Phone } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { ContactRequestDto } from "@/server/application/dtos/contact-request-dto";
import { setContactRequestReadAction } from "../services/admin-service";

function RequestCard({ request }: { request: ContactRequestDto }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [pendingId, setPendingId] = useState<string | null>(null);

  const toggleRead = () => {
    setPendingId(request.id);
    startTransition(async () => {
      const result = await setContactRequestReadAction({ id: request.id, leida: !request.leida });
      setPendingId(null);

      if (result.ok) {
        toast.success(request.leida ? "Marcada como sin leer" : "Marcada como leída");
        router.refresh();
      } else {
        toast.danger("No se pudo actualizar", { description: result.error.message });
      }
    });
  };

  return (
    <Card
      className={cn(
        "gap-4 rounded-2xl border p-5 shadow-none",
        request.leida ? "border-border" : "border-foreground/40",
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-medium tracking-tight">{request.nombre}</h2>
            {!request.leida ? (
              <Chip size="sm" variant="primary" className="rounded-full">
                Nueva
              </Chip>
            ) : null}
          </div>
          <p className="text-xs text-muted">{formatDate(request.createdAt)}</p>
        </div>
        <Button
          size="sm"
          variant="outline"
          isPending={isPending && pendingId === request.id}
          onPress={toggleRead}
          className="rounded-full"
        >
          <MailOpen className="size-3.5" />
          {request.leida ? "Marcar sin leer" : "Marcar como leída"}
        </Button>
      </div>

      <p className="text-sm leading-relaxed whitespace-pre-line">{request.mensaje}</p>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border pt-3 text-sm text-muted">
        <a href={`mailto:${request.email}`} className="flex items-center gap-1.5 hover:text-foreground">
          <Mail className="size-3.5" />
          {request.email}
        </a>
        {request.telefono ? (
          <a href={`tel:${request.telefono.replace(/[^\d+]/g, "")}`} className="flex items-center gap-1.5 hover:text-foreground">
            <Phone className="size-3.5" />
            {request.telefono}
          </a>
        ) : null}
        {request.remateSlug ? (
          <Link
            href={`/admin/remates/${request.remateId}/editar`}
            className="flex items-center gap-1.5 hover:text-foreground"
          >
            <Building2 className="size-3.5" />
            {request.remateNombre}
          </Link>
        ) : null}
      </div>
    </Card>
  );
}

export function SolicitudesList({ requests }: { requests: ContactRequestDto[] }) {
  if (requests.length === 0) {
    return (
      <EmptyState
        icon={MailOpen}
        title="No hay solicitudes"
        description="Cuando alguien escriba desde el sitio, su mensaje aparecerá aquí."
      />
    );
  }

  return (
    <ul className="flex flex-col gap-4">
      {requests.map((request) => (
        <li key={request.id}>
          <RequestCard request={request} />
        </li>
      ))}
    </ul>
  );
}
