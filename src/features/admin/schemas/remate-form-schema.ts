import { z } from "zod";
import { ESTADO_VALUES, TIPO_VALUES } from "@/lib/remate-labels";

export const MAX_IMAGES = 10;
export const MAX_IMAGE_MB = 5;
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

const MAX_PRECIO = 999_999_999_999;

const optionalInt = (label: string) =>
  z
    .number({ error: `${label} no es válido.` })
    .int(`${label} debe ser un número entero.`)
    .min(0, `${label} no puede ser negativo.`)
    .max(100, `${label} es demasiado alto.`)
    .optional();

export const remateFormSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(5, "El nombre debe tener al menos 5 caracteres.")
    .max(200, "El nombre no puede superar 200 caracteres."),
  slug: z
    .string()
    .trim()
    .max(160, "El slug no puede superar 160 caracteres.")
    .refine(
      (value) => value === "" || (value.length >= 3 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)),
      "Usa al menos 3 caracteres: minúsculas, números y guiones.",
    ),
  descripcion: z
    .string()
    .trim()
    .min(20, "La descripción debe tener al menos 20 caracteres.")
    .max(10_000, "La descripción es demasiado larga."),
  tipoInmueble: z.enum(TIPO_VALUES, "Selecciona un tipo de inmueble."),
  estado: z.enum(ESTADO_VALUES, "Selecciona un estado."),
  destacado: z.boolean(),
  /** Hora local de Colombia, formato `YYYY-MM-DDTHH:mm`. */
  fechaRemate: z.string(),
  departamento: z.string().trim().min(1, "Selecciona un departamento."),
  ciudad: z.string().trim().min(1, "Selecciona una ciudad."),
  municipio: z.string().trim().min(1, "Selecciona un municipio."),
  direccion: z.string().trim().max(255, "La dirección no puede superar 255 caracteres."),
  precioBase: z
    .number({ error: "Ingresa un precio base válido." })
    .positive("El precio base debe ser mayor a cero.")
    .max(MAX_PRECIO, "El precio base es demasiado alto."),
  precioComercial: z
    .number({ error: "Ingresa un precio comercial válido." })
    .positive("El precio comercial debe ser mayor a cero.")
    .max(MAX_PRECIO, "El precio comercial es demasiado alto.")
    .optional(),
  area: z
    .number({ error: "Ingresa un área válida." })
    .positive("El área debe ser mayor a cero.")
    .max(99_999_999, "El área es demasiado grande."),
  habitaciones: optionalInt("Las habitaciones"),
  banos: optionalInt("Los baños"),
  imagenes: z
    .array(z.string())
    .min(1, "Sube al menos una imagen.")
    .max(MAX_IMAGES, `Máximo ${MAX_IMAGES} imágenes.`),
});

export type RemateFormValues = z.infer<typeof remateFormSchema>;
