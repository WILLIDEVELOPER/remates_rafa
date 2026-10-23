import { z } from "zod";
import {
  ESTADOS_REMATE,
  MAX_IMAGENES,
  MIN_IMAGENES,
  TIPOS_INMUEBLE,
  isUploadedImageKey,
} from "../../domain/entities/remate.ts";
import type { ListRematesInput } from "../../application/dtos/remate-dto.ts";

const MAX_PRECIO = 999_999_999_999;
const MAX_AREA = 99_999_999;

// Una imagen es una URL https (p. ej. del seed) o una key creada por la subida al bucket.
const imageRefSchema = z
  .string()
  .trim()
  .max(500)
  .refine(
    (value) => isUploadedImageKey(value) || /^https:\/\/\S+$/.test(value),
    "Referencia de imagen no válida.",
  );

const emptyToUndefined = (value: unknown) =>
  value === "" || value === null ? undefined : value;

// ---------------------------------------------------------------------------
// Formulario de remate (crear / editar)
// ---------------------------------------------------------------------------

export const remateFormSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(5, "El nombre debe tener al menos 5 caracteres.")
    .max(200, "El nombre no puede superar 200 caracteres."),
  descripcion: z
    .string()
    .trim()
    .min(20, "La descripción debe tener al menos 20 caracteres.")
    .max(10_000, "La descripción es demasiado larga."),
  departamento: z.string().trim().min(1, "Selecciona un departamento.").max(80),
  ciudad: z.string().trim().min(1, "Selecciona una ciudad.").max(120),
  municipio: z.string().trim().min(1, "Selecciona un municipio.").max(120),
  direccion: z
    .string()
    .trim()
    .max(255, "La dirección no puede superar 255 caracteres.")
    .nullish(),
  tipoInmueble: z.enum(TIPOS_INMUEBLE, "Selecciona un tipo de inmueble."),
  precioBase: z
    .number("Ingresa un precio base válido.")
    .positive("El precio base debe ser mayor a cero.")
    .max(MAX_PRECIO, "El precio base es demasiado alto."),
  precioComercial: z
    .number("Ingresa un precio comercial válido.")
    .positive("El precio comercial debe ser mayor a cero.")
    .max(MAX_PRECIO, "El precio comercial es demasiado alto.")
    .nullish(),
  area: z
    .number("Ingresa un área válida.")
    .positive("El área debe ser mayor a cero.")
    .max(MAX_AREA, "El área es demasiado grande."),
  habitaciones: z.number().int("Debe ser un entero.").min(0).max(100).nullish(),
  banos: z.number().int("Debe ser un entero.").min(0).max(100).nullish(),
  estado: z.enum(ESTADOS_REMATE).optional(),
  fechaRemate: z.iso
    .datetime({ offset: true, error: "La fecha del remate no es válida." })
    .nullish(),
  imagenes: z
    .array(imageRefSchema)
    .min(MIN_IMAGENES, "Sube al menos una imagen.")
    .max(MAX_IMAGENES, `Máximo ${MAX_IMAGENES} imágenes.`),
  destacado: z.boolean().optional(),
  slug: z.preprocess(
    emptyToUndefined,
    z
      .string()
      .trim()
      .min(3, "El slug debe tener al menos 3 caracteres.")
      .max(160)
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Usa solo minúsculas, números y guiones.",
      )
      .optional(),
  ),
});

export const createRemateSchema = remateFormSchema;

export const updateRemateSchema = remateFormSchema.partial().extend({
  id: z.uuid("Identificador de remate inválido."),
  activo: z.boolean().optional(),
});

export const remateIdSchema = z.uuid("Identificador de remate inválido.");

export const remateSlugSchema = z.string().trim().min(1).max(160);

export const setDestacadoSchema = z.object({
  id: remateIdSchema,
  destacado: z.boolean(),
});

export const relatedRematesSchema = z.object({
  departamento: z.string().trim().min(1).max(80),
  excludeId: remateIdSchema,
  limit: z.number().int().min(1).max(12).optional(),
});

// ---------------------------------------------------------------------------
// Filtros del listado (se leen de la URL, por eso son permisivos: un valor
// inválido se ignora en vez de romper la página)
// ---------------------------------------------------------------------------

const firstValue = (value: unknown) =>
  emptyToUndefined(Array.isArray(value) ? value[0] : value);

const optionalText = z
  .preprocess(firstValue, z.string().trim().max(120).optional())
  .catch(undefined);

const optionalNumber = (max: number) =>
  z
    .preprocess(
      (value) => {
        const raw = firstValue(value);
        return raw === undefined ? undefined : Number(raw);
      },
      z.number().finite().min(0).max(max).optional(),
    )
    .catch(undefined);

function csvEnum<const T extends readonly [string, ...string[]]>(values: T) {
  return z.preprocess(
    (value) => {
      const parts = (Array.isArray(value) ? value : [value])
        .flatMap((item) => String(item ?? "").split(","))
        .map((item) => item.trim());
      const valid = parts.filter((item) => values.includes(item));
      return valid.length > 0 ? valid : undefined;
    },
    z.array(z.enum(values)).optional(),
  );
}

export const listRematesParamsSchema = z
  .object({
    q: optionalText,
    departamento: optionalText,
    ciudad: optionalText,
    municipio: optionalText,
    tipo: csvEnum(TIPOS_INMUEBLE),
    estado: csvEnum(ESTADOS_REMATE),
    min: optionalNumber(MAX_PRECIO),
    max: optionalNumber(MAX_PRECIO),
    orden: z
      .preprocess(
        firstValue,
        z
          .enum(["recientes", "precio_asc", "precio_desc", "fecha_remate"])
          .optional(),
      )
      .catch(undefined),
    pagina: z
      .preprocess(
        (value) => {
          const raw = firstValue(value);
          return raw === undefined ? undefined : Number(raw);
        },
        z.number().int().min(1).max(10_000).optional(),
      )
      .catch(undefined),
    activo: z
      .preprocess(firstValue, z.enum(["true", "false"]).optional())
      .catch(undefined),
  })
  .transform(
    (params): ListRematesInput => ({
      search: params.q,
      departamento: params.departamento,
      ciudad: params.ciudad,
      municipio: params.municipio,
      tipos: params.tipo,
      estados: params.estado,
      precioMin: params.min,
      precioMax: params.max,
      sort: params.orden,
      page: params.pagina,
      activo: params.activo === undefined ? undefined : params.activo === "true",
    }),
  );
