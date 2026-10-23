import type { Metadata } from "next";
import { LinkButton } from "@/components/ui/link-button";
import {
  EstadoBreakdown,
  RecentRemates,
  RecentRequests,
  StatCards,
} from "@/features/admin";
import { listContactRequestsAction } from "@/server/presentation/actions/contact-actions";
import {
  adminListRematesAction,
  getDashboardStatsAction,
} from "@/server/presentation/actions/remate-actions";
import { getAdminSession } from "@/server/presentation/auth/require-admin";

export const metadata: Metadata = { title: "Dashboard" };

export default async function AdminDashboardPage() {
  const [session, stats, recent, requests] = await Promise.all([
    getAdminSession(),
    getDashboardStatsAction(),
    adminListRematesAction({ activo: "true" }),
    listContactRequestsAction({}),
  ]);

  if (!stats.ok) throw new Error(stats.error.message);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-medium tracking-tight sm:text-3xl">
            Hola, {session?.name.split(" ")[0]}
          </h1>
          <p className="text-sm text-muted">Resumen de la actividad del sitio.</p>
        </div>
        <LinkButton href="/admin/remates/nuevo" className="h-10 w-fit px-5 font-medium">
          Nuevo remate
        </LinkButton>
      </header>

      <StatCards stats={stats.data} unread={requests.ok ? requests.data.unread : 0} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_3fr]">
        <EstadoBreakdown stats={stats.data} />
        <RecentRemates remates={recent.ok ? recent.data.items.slice(0, 5) : []} />
      </div>

      <RecentRequests requests={requests.ok ? requests.data.items.slice(0, 5) : []} />
    </div>
  );
}
