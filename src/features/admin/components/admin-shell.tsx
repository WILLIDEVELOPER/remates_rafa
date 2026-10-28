"use client";

import {
  Avatar,
  Button,
  Drawer,
  Dropdown,
  useOverlayState,
} from "@heroui/react";
import { ExternalLink, KeyRound, LogOut, Menu, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { Logo } from "@/components/branding/logo";
import { logout } from "../services/admin-service";
import { AdminNav } from "./admin-nav";

interface AdminShellProps {
  user: { name: string; email: string; role: string };
  unread: number;
  children: ReactNode;
}

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "A";

export function AdminShell({ user, unread, children }: AdminShellProps) {
  const router = useRouter();
  const drawer = useOverlayState();
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col gap-8 border-r border-border bg-background p-5 lg:flex">
        <Logo tone="auto" />
        <AdminNav unread={unread} />
      </aside>

      <div className="flex min-h-dvh flex-col lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-border bg-background/90 px-4 backdrop-blur lg:px-8">
          <div className="flex items-center gap-3">
            <Button
              isIconOnly
              variant="ghost"
              aria-label="Abrir menú"
              onPress={drawer.open}
              className="rounded-full lg:hidden"
            >
              <Menu className="size-5" />
            </Button>
            <Logo tone="auto" className="lg:hidden [&>span:last-child]:hidden sm:[&>span:last-child]:inline" />
          </div>

          <div className="flex items-center gap-2">
            <Button
              isIconOnly
              variant="ghost"
              aria-label="Cambiar tema"
              onPress={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="rounded-full"
            >
              <Sun className="hidden size-5 dark:block" />
              <Moon className="size-5 dark:hidden" />
            </Button>

            <Dropdown>
              <Button
                isIconOnly
                variant="ghost"
                aria-label="Menú de usuario"
                className="rounded-full"
              >
                <Avatar size="sm">
                  <Avatar.Fallback>{initials(user.name)}</Avatar.Fallback>
                </Avatar>
              </Button>
              <Dropdown.Popover className="min-w-56">
                <div className="flex flex-col px-3 py-2">
                  <span className="text-sm font-medium">{user.name}</span>
                  <span className="text-xs text-muted">{user.email}</span>
                  <span className="mt-1 text-xs text-muted capitalize">
                    {user.role.replace("_", " ")}
                  </span>
                </div>
                <Dropdown.Menu
                  onAction={(key) => {
                    if (key === "account") router.push("/admin/cuenta");
                    if (key === "site") router.push("/");
                    if (key === "logout") void logout();
                  }}
                >
                  <Dropdown.Item id="account" textValue="Mi cuenta">
                    <KeyRound className="size-4 shrink-0 text-muted" />
                    Mi cuenta y contraseña
                  </Dropdown.Item>
                  <Dropdown.Item id="site" textValue="Ver sitio público">
                    <ExternalLink className="size-4 shrink-0 text-muted" />
                    Ver sitio público
                  </Dropdown.Item>
                  <Dropdown.Item id="logout" textValue="Cerrar sesión" variant="danger">
                    <LogOut className="size-4 shrink-0 text-danger" />
                    Cerrar sesión
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown.Popover>
            </Dropdown>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>

      <Drawer.Backdrop variant="blur" isOpen={drawer.isOpen} onOpenChange={drawer.setOpen}>
        <Drawer.Content placement="left">
          <Drawer.Dialog className="flex flex-col gap-6">
            <Drawer.CloseTrigger />
            <Drawer.Header>
              <Logo tone="auto" />
            </Drawer.Header>
            <Drawer.Body className="flex flex-col">
              <AdminNav unread={unread} onNavigate={drawer.close} />
            </Drawer.Body>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </div>
  );
}
