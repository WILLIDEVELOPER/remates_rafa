import { z } from "zod";
import {
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGENES,
  MAX_IMAGE_BYTES,
  UPLOADED_IMAGE_KEY,
} from "../../domain/entities/remate.ts";

export const deleteOrphanImagesSchema = z.object({
  /** Sin `keys` se borran todas las huérfanas. */
  keys: z
    .array(z.string().regex(UPLOADED_IMAGE_KEY, "Referencia de imagen no válida."))
    .min(1)
    .max(1000)
    .optional(),
});

export const imageUploadsSchema = z.object({
  files: z
    .array(
      z.object({
        name: z.string().trim().min(1).max(200),
        contentType: z.enum(ALLOWED_IMAGE_TYPES, "Solo se aceptan imágenes JPG, PNG o WebP."),
        size: z
          .number()
          .int()
          .positive()
          .max(MAX_IMAGE_BYTES, "Cada imagen debe pesar 5 MB o menos."),
      }),
    )
    .min(1)
    .max(MAX_IMAGENES),
});

export const contactRequestsParamsSchema = z.object({
  pagina: z.coerce.number().int().min(1).max(10_000).optional().catch(undefined),
  filtro: z.enum(["todas", "sin_leer"]).optional().catch(undefined),
});

export const setContactReadSchema = z.object({
  id: z.uuid(),
  leida: z.boolean(),
});
