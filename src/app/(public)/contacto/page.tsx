import { Clock, Mail, MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";
import { ContactForm } from "@/features/contact";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contacto",
  alternates: { canonical: "/contacto" },
  description:
    "Escríbenos o llámanos: un asesor te ayudará a encontrar el remate que mejor se ajusta a tu presupuesto.",
};

const CONTACT_ITEMS = [
  { icon: Phone, label: "Teléfono", value: SITE.phoneDisplay, href: SITE.phoneHref },
  { icon: Mail, label: "Correo", value: SITE.email, href: `mailto:${SITE.email}` },
  { icon: MapPin, label: "Ubicación", value: SITE.address },
  { icon: Clock, label: "Horario", value: SITE.schedule },
] as const;

export default function ContactPage() {
  return (
    <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 py-12 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-20 xl:px-16">
      <div className="flex flex-col gap-8">
        <header className="flex flex-col gap-3">
          <h1 className="text-3xl font-medium tracking-tight sm:text-4xl">Contáctanos</h1>
          <p className="max-w-lg text-muted">
            Cuéntanos qué tipo de inmueble buscas y en qué zona. Un asesor te
            responderá a la brevedad.
          </p>
        </header>

        <ul className="flex flex-col gap-4">
          {CONTACT_ITEMS.map((item) => {
            const content = (
              <>
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
                  <item.icon className="size-5" />
                </span>
                <span className="flex min-w-0 flex-col">
                  <span className="text-xs text-muted">{item.label}</span>
                  <span className="font-medium break-words">{item.value}</span>
                </span>
              </>
            );

            return (
              <li key={item.label}>
                {"href" in item ? (
                  <a href={item.href} className="flex items-center gap-4 transition-opacity hover:opacity-70">
                    {content}
                  </a>
                ) : (
                  <div className="flex items-center gap-4">{content}</div>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="rounded-2xl border border-border p-6 sm:p-8">
        <h2 className="mb-6 text-xl font-medium tracking-tight">Envíanos un mensaje</h2>
        <ContactForm />
      </div>
    </div>
  );
}
