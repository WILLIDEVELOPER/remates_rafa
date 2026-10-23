import {
  ESTADO_LABELS,
  TIPO_LABELS,
  type EstadoRemateKey,
  type TipoInmuebleKey,
} from "./remate-labels";

export const DEPARTAMENTOS = [
  "Amazonas",
  "Antioquia",
  "Arauca",
  "Atlántico",
  "Bogotá D.C.",
  "Bolívar",
  "Boyacá",
  "Caldas",
  "Caquetá",
  "Casanare",
  "Cauca",
  "Cesar",
  "Chocó",
  "Córdoba",
  "Cundinamarca",
  "Guainía",
  "Guaviare",
  "Huila",
  "La Guajira",
  "Magdalena",
  "Meta",
  "Nariño",
  "Norte de Santander",
  "Putumayo",
  "Quindío",
  "Risaralda",
  "San Andrés y Providencia",
  "Santander",
  "Sucre",
  "Tolima",
  "Valle del Cauca",
  "Vaupés",
  "Vichada",
] as const;

export type Departamento = (typeof DEPARTAMENTOS)[number];

/**
 * Datos de referencia para los selects dependientes:
 * departamento -> ciudad -> municipios.
 * "Ciudad" es el núcleo urbano principal y "municipios" los de su área de influencia.
 */
export const UBICACIONES: Record<string, Record<string, string[]>> = {
  Antioquia: {
    Medellín: [
      "Medellín",
      "Envigado",
      "Bello",
      "Itagüí",
      "Sabaneta",
      "La Estrella",
      "Copacabana",
    ],
    Rionegro: ["Rionegro", "El Retiro", "La Ceja", "Marinilla", "Guarne"],
    Apartadó: ["Apartadó", "Carepa", "Chigorodó", "Turbo"],
  },
  Cundinamarca: {
    Soacha: ["Soacha", "Sibaté"],
    Chía: ["Chía", "Cajicá", "Cota", "Sopó", "Tabio"],
    Zipaquirá: ["Zipaquirá", "Cogua", "Nemocón"],
    Mosquera: ["Mosquera", "Funza", "Madrid"],
    Fusagasugá: ["Fusagasugá", "Silvania", "Arbeláez"],
    Girardot: ["Girardot", "Ricaurte", "Agua de Dios"],
  },
  "Bogotá D.C.": {
    Bogotá: [
      "Usaquén",
      "Chapinero",
      "Teusaquillo",
      "Suba",
      "Engativá",
      "Fontibón",
      "Kennedy",
    ],
  },
  "Valle del Cauca": {
    Cali: ["Cali", "Jamundí", "Yumbo"],
    Palmira: ["Palmira", "Candelaria", "Pradera", "Florida"],
    Tuluá: ["Tuluá", "Bugalagrande", "Andalucía"],
    Cartago: ["Cartago", "Obando"],
    Buenaventura: ["Buenaventura"],
  },
  Atlántico: {
    Barranquilla: [
      "Barranquilla",
      "Soledad",
      "Malambo",
      "Puerto Colombia",
      "Galapa",
    ],
    Sabanalarga: ["Sabanalarga", "Baranoa", "Luruaco"],
  },
  Bolívar: {
    Cartagena: ["Cartagena", "Turbaco", "Arjona", "Clemencia"],
    Magangué: ["Magangué", "Mompox", "Pinillos"],
    "El Carmen de Bolívar": [
      "El Carmen de Bolívar",
      "San Jacinto",
      "María la Baja",
    ],
  },
  Santander: {
    Bucaramanga: ["Bucaramanga", "Floridablanca", "Girón", "Piedecuesta"],
    Barrancabermeja: ["Barrancabermeja", "Puerto Wilches"],
    "San Gil": ["San Gil", "Socorro", "Barichara"],
  },
};

export const TIPOS_INMUEBLE_OPTIONS = (
  Object.entries(TIPO_LABELS) as [TipoInmuebleKey, string][]
).map(([value, label]) => ({ value, label }));

export const ESTADOS_REMATE_OPTIONS = (
  Object.entries(ESTADO_LABELS) as [EstadoRemateKey, string][]
).map(([value, label]) => ({ value, label }));

export function getCiudades(departamento: string): string[] {
  return Object.keys(UBICACIONES[departamento] ?? {});
}

export function getMunicipios(departamento: string, ciudad: string): string[] {
  return UBICACIONES[departamento]?.[ciudad] ?? [];
}
