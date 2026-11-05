/** Zonas con página propia (`/remates-judiciales/<slug>`) para el SEO local. */
export interface Zona {
  slug: string;
  nombre: string;
  /** Filtros del listado (mismos nombres que los parámetros de `/remates`). */
  filtros: { departamento: string; ciudad?: string; municipio?: string };
  /** Texto propio de la zona, para que cada página no sea una copia de las demás. */
  intro: string;
}

export const ZONAS: readonly Zona[] = [
  {
    slug: "bucaramanga",
    nombre: "Bucaramanga",
    filtros: { departamento: "Santander", ciudad: "Bucaramanga", municipio: "Bucaramanga" },
    intro:
      "Bucaramanga es la capital de Santander y el centro de su área metropolitana. Aquí reunimos las casas, apartamentos, lotes y locales que salen a remate judicial en la ciudad, con su precio base, el valor para participar y la fecha del remate.",
  },
  {
    slug: "floridablanca",
    nombre: "Floridablanca",
    filtros: { departamento: "Santander", ciudad: "Bucaramanga", municipio: "Floridablanca" },
    intro:
      "Floridablanca hace parte del área metropolitana de Bucaramanga. Consulta los inmuebles en remate judicial del municipio y compara su precio base con el avalúo comercial antes de decidir.",
  },
  {
    slug: "giron",
    nombre: "Girón",
    filtros: { departamento: "Santander", ciudad: "Bucaramanga", municipio: "Girón" },
    intro:
      "Girón también forma parte del área metropolitana de Bucaramanga. Estos son los inmuebles en remate judicial del municipio, con la información que necesitas para preparar tu participación.",
  },
  {
    slug: "piedecuesta",
    nombre: "Piedecuesta",
    filtros: { departamento: "Santander", ciudad: "Bucaramanga", municipio: "Piedecuesta" },
    intro:
      "Piedecuesta es otro de los municipios del área metropolitana de Bucaramanga. Revisa aquí los inmuebles que salen a remate judicial en el municipio y pide asesoría antes de participar.",
  },
  {
    slug: "santander",
    nombre: "Santander",
    filtros: { departamento: "Santander" },
    intro:
      "Reunimos los remates judiciales y de la DIAN de todo Santander: Bucaramanga, Floridablanca, Girón, Piedecuesta y el resto del departamento.",
  },
];

export function getZona(slug: string): Zona | undefined {
  return ZONAS.find((zona) => zona.slug === slug);
}

export const zonaPath = (zona: Zona) => `/remates-judiciales/${zona.slug}`;

/** Enlace al listado general con los filtros de la zona ya aplicados. */
export function zonaListadoHref(zona: Zona): string {
  return `/remates?${new URLSearchParams(zona.filtros).toString()}`;
}

export const GUIA_PATH = "/como-participar-en-un-remate-judicial";
