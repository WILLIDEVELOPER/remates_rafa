"use client";

import { Building2, ExternalLink, ImageOff, Inbox, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
  { title: "Remates", href: "/admin/remates", icon: Building2 },
  { title: "Solicitudes", href: "/admin/solicitudes", icon: Inbox, badge: true },
  { title: "Imágenes huérfanas", href: "/admin/imagenes", icon: ImageOff },
] as const;

interface AdminNavProps {
  unread: number;
  onNavigate?: () => void;
}

export function AdminNav({ unread, onNavigate }: AdminNavProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Panel administrativo" className="flex flex-1 flex-col gap-1">
      {NAV_ITEMS.map((item) => {
        const active =
          "exact" in item && item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-foreground text-background"
                : "text-muted hover:bg-surface-secondary hover:text-foreground",
            )}
          >
            <item.icon className="size-4 shrink-0" />
            <span className="flex-1">{item.title}</span>
            {"badge" in item && unread > 0 ? (
              <span
                aria-label={`${unread} sin leer`}
                className={cn(
                  "rounded-full px-2 py-0.5 text-xs font-semibold",
                  active ? "bg-background text-foreground" : "bg-foreground text-background",
                )}
              >
                {unread > 99 ? "99+" : unread}
              </span>
            ) : null}
          </Link>
        );
      })}

      <div className="mt-auto border-t border-border pt-3">
        <Link
          href="/"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-surface-secondary hover:text-foreground"
        >
          <ExternalLink className="size-4 shrink-0" />
          Ver sitio público
        </Link>
      </div>
    </nav>
  );
}
