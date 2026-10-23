import { InvalidRemateError } from "../errors/invalid-remate-error.ts";

export const TIPOS_INMUEBLE = [
  "casa",
  "apartamento",
  "lote",
  "local",
  "bodega",
  "finca",
] as const;

export const ESTADOS_REMATE = [
  "disponible",
  "en_remate",
  "adjudicado",
  "suspendido",
] as const;

export const MIN_IMAGENES = 1;
export const MAX_IMAGENES = 10;

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export const IMAGE_EXTENSIONS: Record<(typeof ALLOWED_IMAGE_TYPES)[number], string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

/** Key que genera la subida de imágenes: `remates/<uuid>.jpg|png|webp`. */
export const UPLOADED_IMAGE_KEY =
  /^remates\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|png|webp)$/;

export function isUploadedImageKey(value: string): boolean {
  return UPLOADED_IMAGE_KEY.test(value);
}

export type TipoInmueble = (typeof TIPOS_INMUEBLE)[number];
export type EstadoRemate = (typeof ESTADOS_REMATE)[number];

export interface Remate {
  id: string;
  slug: string;
  nombre: string;
  descripcion: string;
  departamento: string;
  ciudad: string;
  municipio: string;
  direccion: string | null;
  tipoInmueble: TipoInmueble;
  precioBase: number;
  precioComercial: number | null;
  area: number;
  habitaciones: number | null;
  banos: number | null;
  estado: EstadoRemate;
  fechaRemate: Date | null;
  /** Referencias a las imágenes: URL absoluta o key del objeto en el bucket. */
  imagenes: string[];
  imagenPrincipal: string | null;
  destacado: boolean;
  activo: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string | null;
}

export type NewRemate = Omit<Remate, "id" | "createdAt" | "updatedAt">;
export type RemateChanges = Partial<Omit<NewRemate, "createdBy">>;

type RemateRulesInput = Pick<
  Remate,
  | "nombre"
  | "precioBase"
  | "precioComercial"
  | "area"
  | "habitaciones"
  | "banos"
  | "imagenes"
  | "activo"
  | "destacado"
>;

export function generateSlug(nombre: string): string {
  return nombre
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 160);
}

export function deriveImagenPrincipal(imagenes: string[]): string | null {
  return imagenes[0] ?? null;
}

function isNonNegativeInteger(value: number): boolean {
  return Number.isInteger(value) && value >= 0;
}

export function assertRemateRules(remate: RemateRulesInput): void {
  if (remate.nombre.trim().length === 0) {
    throw new InvalidRemateError("El remate debe tener un nombre.");
  }
  if (!(remate.precioBase > 0)) {
    throw new InvalidRemateError("El precio base debe ser mayor a cero.");
  }
  if (remate.precioComercial !== null && !(remate.precioComercial > 0)) {
    throw new InvalidRemateError("El precio comercial debe ser mayor a cero.");
  }
  if (!(remate.area > 0)) {
    throw new InvalidRemateError("El área debe ser mayor a cero.");
  }
  if (remate.habitaciones !== null && !isNonNegativeInteger(remate.habitaciones)) {
    throw new InvalidRemateError("Las habitaciones deben ser un entero positivo.");
  }
  if (remate.banos !== null && !isNonNegativeInteger(remate.banos)) {
    throw new InvalidRemateError("Los baños deben ser un entero positivo.");
  }
  if (
    remate.imagenes.length < MIN_IMAGENES ||
    remate.imagenes.length > MAX_IMAGENES
  ) {
    throw new InvalidRemateError(
      `El remate debe tener entre ${MIN_IMAGENES} y ${MAX_IMAGENES} imágenes.`,
    );
  }
  if (remate.destacado && !remate.activo) {
    throw new InvalidRemateError("Un remate inactivo no puede ser destacado.");
  }
}
