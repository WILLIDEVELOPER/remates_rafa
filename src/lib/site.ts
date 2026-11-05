export const SITE = {
  name: "Remates Vargas",
  description:
    "Remates judiciales y de la DIAN en Bucaramanga, Santander y toda Colombia: casas, apartamentos, lotes y locales con precio base por debajo del avalúo y asesoría para participar.",
  /** Título por defecto de las páginas que no definen el suyo. */
  tagline: "Remates judiciales en Bucaramanga y Santander",
  /** Teléfono visible en la web: mismo número del WhatsApp principal. */
  phoneDisplay: "+57 318 774 0911",
  phoneHref: "tel:+573187740911",
  /** WhatsApp de atención: `number` con código de país (57) y sin "+" ni espacios. */
  whatsappContacts: [
    { label: "Principal", number: "573187740911", display: "318 774 0911" },
    { label: "Secundario", number: "573232730838", display: "323 273 0838" },
  ],
  whatsappMessage: "Hola, quiero información sobre los remates de vivienda.",
  emails: ["2952vargas@gmail.com", "Voljink@gmail.com"],
  address: "Bucaramanga, Santander, Colombia",
  schedule: "Lunes a viernes, 8:00 a. m. – 6:00 p. m.",
  /** Mismo horario en formato de datos estructurados. */
  openingHours: {
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "08:00",
    closes: "18:00",
  },
} as const;

/** Búsquedas que queremos atender (la etiqueta `keywords` no posiciona, pero orienta los textos). */
export const SEO_KEYWORDS = [
  "remates judiciales Bucaramanga",
  "remates judiciales en Bucaramanga",
  "remates judiciales Santander",
  "inmuebles en remate Bucaramanga",
  "remates de inmuebles Bucaramanga",
  "casas en remate judicial Bucaramanga",
  "apartamentos en remate Bucaramanga",
  "subastas judiciales Bucaramanga",
  "remates judiciales Floridablanca",
  "remates judiciales Girón",
  "remates judiciales Piedecuesta",
  "asesoría en remates judiciales Bucaramanga",
  "cómo participar en un remate judicial",
  "compra de inmuebles en remate judicial",
  "adjudicación de inmuebles Bucaramanga",
] as const;

// Video de fondo del hero (fácil de reemplazar por uno propio).
export const HERO_VIDEO_URL =
  "https://images.shadcnspace.com/assets/video/hero-33.mp4";

export const NAV_LINKS = [
  { title: "Inicio", href: "/" },
  { title: "Remates", href: "/remates" },
  { title: "Cómo participar", href: "/como-participar-en-un-remate-judicial" },
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
