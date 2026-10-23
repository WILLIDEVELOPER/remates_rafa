"use client";

import { Button, Drawer, Separator, useOverlayState } from "@heroui/react";
import { ChevronRight, Equal, Phone } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/branding/logo";
import { LinkButton } from "@/components/ui/link-button";
import { NAV_LINKS, SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

export function PublicNavbar() {
  const pathname = usePathname();
  const drawer = useOverlayState();
  const [scrolled, setScrolled] = useState(false);

  // En la landing la barra flota sobre el hero; en el resto es sólida y fija arriba.
  const overlay = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav
      className={cn(
        "dark inset-x-0 top-0 z-50 w-full text-foreground transition-all duration-300",
        overlay ? "fixed" : "sticky",
        overlay && !scrolled
          ? "bg-transparent"
          : "bg-background/95 shadow-lg shadow-black/5 backdrop-blur-lg",
      )}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 lg:px-8 xl:px-16">
        <div className="flex items-center gap-4 lg:gap-6">
          <Link href="/" aria-label={`${SITE.name} - Inicio`} className="shrink-0">
            <Logo tone="light" />
          </Link>
          <Separator orientation="vertical" className="my-auto hidden h-6 bg-foreground/20 lg:block" />
          <div className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={cn(
                  "rounded-full px-3 py-1.5 text-base font-medium whitespace-nowrap transition-colors",
                  isActive(link.href)
                    ? "bg-foreground/20 text-foreground"
                    : "text-foreground/70 hover:text-foreground",
                )}
              >
                {link.title}
              </Link>
            ))}
          </div>
        </div>

        <div className="hidden items-center gap-6 lg:flex">
          <a
            href={SITE.phoneHref}
            className="flex items-center gap-2 whitespace-nowrap text-foreground transition-colors hover:text-foreground/80"
          >
            <Phone className="size-5" />
            <span className="text-sm">{SITE.phoneDisplay}</span>
          </a>
          <LinkButton href="/remates" className="h-10 px-5 font-medium">
            Ver Remates
            <ChevronRight className="size-4 transition-all duration-300 group-hover:translate-x-0.5" />
          </LinkButton>
        </div>

        <Button
          isIconOnly
          aria-label="Abrir menú"
          onPress={drawer.open}
          className="size-10 rounded-full lg:hidden"
        >
          <Equal className="size-4" />
        </Button>

        <Drawer.Backdrop
          variant="blur"
          isOpen={drawer.isOpen}
          onOpenChange={drawer.setOpen}
        >
          <Drawer.Content placement="right">
            <Drawer.Dialog className="dark flex flex-col gap-6 bg-background text-foreground">
              <Drawer.CloseTrigger />
              <Drawer.Header>
                <Link href="/" onClick={drawer.close} aria-label={`${SITE.name} - Inicio`}>
                  <Logo tone="light" />
                </Link>
              </Drawer.Header>

              <Drawer.Body className="flex flex-col gap-1.5">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={drawer.close}
                    aria-current={isActive(link.href) ? "page" : undefined}
                    className={cn(
                      "rounded-lg px-3 py-2 text-base transition-colors",
                      isActive(link.href)
                        ? "bg-foreground/15 text-foreground"
                        : "text-muted hover:bg-foreground/10 hover:text-foreground",
                    )}
                  >
                    {link.title}
                  </Link>
                ))}
              </Drawer.Body>

              <Drawer.Footer className="flex-col items-stretch gap-3">
                <a
                  href={SITE.phoneHref}
                  className="flex items-center gap-2 text-foreground transition-colors hover:text-foreground/80"
                >
                  <Phone className="size-4" />
                  <span className="text-sm">{SITE.phoneDisplay}</span>
                </a>
                <LinkButton href="/remates" onClick={drawer.close} fullWidth className="h-10 font-medium">
                  Ver Remates
                  <ChevronRight className="size-4" />
                </LinkButton>
              </Drawer.Footer>
            </Drawer.Dialog>
          </Drawer.Content>
        </Drawer.Backdrop>
      </div>
    </nav>
  );
}
