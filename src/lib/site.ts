export const SITE = {
  name: "Remates Vargas",
  description:
    "Remates de vivienda en Colombia: casas, apartamentos, lotes y locales con precios por debajo del mercado y acompañamiento jurídico.",
  /** Placeholder: reemplazar por el número real. */
  phoneDisplay: "+57 601 000 0000",
  phoneHref: "tel:+576010000000",
  /** WhatsApp de atención: `number` con código de país (57) y sin "+" ni espacios. */
  whatsappContacts: [
    { label: "Principal", number: "573187740911", display: "318 774 0911" },
    { label: "Secundario", number: "573232730838", display: "323 273 0838" },
  ],
  whatsappMessage: "Hola, quiero información sobre los remates de vivienda.",
  email: "contacto@rematesvargas.co",
  address: "Bogotá D.C., Colombia",
  schedule: "Lunes a viernes, 8:00 a. m. – 6:00 p. m.",
} as const;

// Video de fondo del hero (fácil de reemplazar por uno propio).
export const HERO_VIDEO_URL =
  "https://images.shadcnspace.com/assets/video/hero-33.mp4";

export const NAV_LINKS = [
  { title: "Inicio", href: "/" },
  { title: "Remates", href: "/remates" },
  { title: "Contacto", href: "/contacto" },
] as const;

/** Enlace de chat de WhatsApp (wa.me, gratuito) con el mensaje ya escrito. */
export function getWhatsappUrl(number: string, message: string = SITE.whatsappMessage): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function getBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.BETTER_AUTH_URL ??
    "http://localhost:3000"
  );
}
