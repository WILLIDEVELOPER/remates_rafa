import { Card } from "@heroui/react";
import { Building2, CircleCheck, Inbox, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ContactRequestDto } from "@/server/application/dtos/contact-request-dto";
import type { DashboardStatsDto, RemateDto } from "@/server/application/dtos/remate-dto";
import { EstadoChip } from "@/components/ui/estado-chip";
import { formatCOP, formatDate } from "@/lib/format";
import { ESTADO_LABELS, ESTADO_VALUES, type EstadoRemateKey } from "@/lib/remate-labels";

const BAR_COLOR: Record<EstadoRemateKey, string> = {
  disponible: "bg-success",
  adjudicado: "bg-foreground/40",
  suspendido: "bg-danger",
};

export function StatCards({ stats, unread }: { stats: DashboardStatsDto; unread: number }) {
  const items = [
    { label: "Total de remates", value: stats.total, icon: Building2, hint: `${stats.inactivos} eliminados` },
    { label: "Activos", value: stats.activos, icon: CircleCheck, hint: "Visibles en el sitio" },
    { label: "Destacados", value: stats.destacados, icon: Star, hint: "En la landing" },
    { label: "Solicitudes sin leer", value: unread, icon: Inbox, hint: "Pendientes de respuesta" },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map(({ label, value, icon: Icon, hint }) => (
        <Card key={label} className="gap-3 rounded-2xl border border-border p-5 shadow-none">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted">{label}</span>
            <span className="flex size-9 items-center justify-center rounded-full bg-surface-secondary">
              <Icon className="size-4" />
            </span>
          </div>
          <div>
            <p className="text-3xl font-semibold tracking-tight">{value}</p>
            <p className="text-xs text-muted">{hint}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}

export function EstadoBreakdown({ stats }: { stats: DashboardStatsDto }) {
  const total = stats.activos || 1;

  return (
    <Card className="gap-5 rounded-2xl border border-border p-5 shadow-none">
      <div>
        <h2 className="text-base font-medium tracking-tight">Remates por estado</h2>
        <p className="text-xs text-muted">Solo remates activos</p>
      </div>
      <ul className="flex flex-col gap-4">
        {ESTADO_VALUES.map((estado) => {
          const count = stats.porEstado[estado];
          const percent = Math.round((count / total) * 100);

          return (
            <li key={estado} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-sm">
                <span>{ESTADO_LABELS[estado]}</span>
                <span className="text-muted">
                  {count} · {percent} %
                </span>
              </div>
              <div
                role="img"
                aria-label={`${ESTADO_LABELS[estado]}: ${count} de ${stats.activos}`}
                className="h-2 w-full overflow-hidden rounded-full bg-surface-secondary"
              >
                <div
                  className={`h-full rounded-full transition-all duration-500 ${BAR_COLOR[estado]}`}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

export function RecentRemates({ remates }: { remates: RemateDto[] }) {
  return (
    <Card className="gap-4 rounded-2xl border border-border p-5 shadow-none">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-medium tracking-tight">Últimos remates</h2>
        <Link href="/admin/remates" className="text-sm text-muted underline-offset-4 hover:text-foreground hover:underline">
          Ver todos
        </Link>
      </div>
      {remates.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted">Aún no hay remates.</p>
      ) : (
        <ul className="flex flex-col divide-y divide-border">
          {remates.map((remate) => (
            <li key={remate.id}>
              <Link
                href={`/admin/remates/${remate.id}/editar`}
                className="flex items-center gap-3 py-3 transition-opacity hover:opacity-70"
              >
                <span className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-surface-secondary">
                  {remate.imagenPrincipalUrl ? (
                    <Image src={remate.imagenPrincipalUrl} alt="" fill sizes="48px" className="object-cover" />
                  ) : null}
                </span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-sm font-medium">{remate.nombre}</span>
                  <span className="truncate text-xs text-muted">
                    {remate.municipio}, {remate.departamento} · {formatCOP(remate.precioBase)}
                  </span>
                </span>
                <EstadoChip estado={remate.estado} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

export function RecentRequests({ requests }: { requests: ContactRequestDto[] }) {
  return (
    <Card className="gap-4 rounded-2xl border border-border p-5 shadow-none">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-medium tracking-tight">Solicitudes recientes</h2>
        <Link href="/admin/solicitudes" className="text-sm text-muted underline-offset-4 hover:text-foreground hover:underline">
          Ver todas
        </Link>
      </div>
      {requests.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted">Aún no hay solicitudes.</p>
      ) : (
        <ul className="flex flex-col divide-y divide-border">
          {requests.map((request) => (
            <li key={request.id} className="flex flex-col gap-0.5 py-3">
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2 text-sm font-medium">
                  {!request.leida ? <span aria-label="Sin leer" className="size-2 rounded-full bg-foreground" /> : null}
                  {request.nombre}
                </span>
                <span className="text-xs text-muted">{formatDate(request.createdAt)}</span>
              </div>
              <p className="line-clamp-1 text-xs text-muted">{request.mensaje}</p>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
