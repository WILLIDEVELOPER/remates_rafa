import { Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/branding/logo";
import { NAV_LINKS, SITE } from "@/lib/site";

const LEGAL_LINKS = [
  { title: "Términos y condiciones", href: "/legal/terminos" },
  { title: "Política de privacidad", href: "/legal/privacidad" },
] as const;

export function PublicFooter() {
  return (
    <footer className="dark bg-background text-foreground">
      <div className="mx-auto w-full max-w-7xl px-4 py-14 lg:px-8 xl:px-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-4 lg:col-span-2">
            <Logo tone="light" />
            <p className="max-w-md text-sm text-muted">
              Conectamos a compradores con oportunidades de vivienda en remate
              en toda Colombia, con respaldo jurídico y total transparencia.
            </p>
          </div>

          <nav aria-label="Navegación del pie de página" className="flex flex-col gap-3">
            <h2 className="text-sm font-medium">Navegación</h2>
            <ul className="flex flex-col gap-2 text-sm text-muted">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition-colors hover:text-foreground">
                    {link.title}
                  </Link>
                </li>
              ))}
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition-colors hover:text-foreground">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col gap-3">
            <h2 className="text-sm font-medium">Contacto</h2>
            <ul className="flex flex-col gap-2 text-sm text-muted">
              <li>
                <a href={SITE.phoneHref} className="flex items-center gap-2 transition-colors hover:text-foreground">
                  <Phone className="size-4 shrink-0" />
                  {SITE.phoneDisplay}
                </a>
              </li>
              {SITE.emails.map((email) => (
                <li key={email}>
                  <a href={`mailto:${email}`} className="flex items-center gap-2 break-all transition-colors hover:text-foreground">
                    <Mail className="size-4 shrink-0" />
                    {email}
                  </a>
                </li>
              ))}
              <li className="flex items-center gap-2">
                <MapPin className="size-4 shrink-0" />
                {SITE.address}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {SITE.name}. Todos los derechos
            reservados.
          </p>
          <p>{SITE.schedule}</p>
        </div>
      </div>
    </footer>
  );
}
