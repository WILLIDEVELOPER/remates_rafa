import { z } from "zod";
import {
  RESENA_COMENTARIO_MAX,
  RESENA_COMENTARIO_MIN,
} from "../../domain/entities/resena.ts";

const nombre = z
  .string()
  .trim()
  .min(2, "Ingresa tu nombre.")
  .max(120, "El nombre es demasiado largo.");

const comentario = z
  .string()
  .trim()
  .min(RESENA_COMENTARIO_MIN, `Cuéntanos un poco más (mínimo ${RESENA_COMENTARIO_MIN} caracteres).`)
  .max(RESENA_COMENTARIO_MAX, `La reseña no puede superar ${RESENA_COMENTARIO_MAX} caracteres.`);

export const resenaIdSchema = z.uuid("Identificador de reseña inválido.");

export const remateResenasIdSchema = z.uuid("Identificador de remate inválido.");

export const createResenaSchema = z.object({
  remateId: remateResenasIdSchema,
  nombre,
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Ingresa tu correo electrónico.")
    .max(255)
    .pipe(z.email("Ingresa un correo electrónico válido.")),
  telefono: z
    .string()
    .trim()
    .min(1, "Ingresa tu número de teléfono.")
    .regex(/^\+?[\d\s-]{7,20}$/, "Ingresa un teléfono válido."),
  comentario,
  /** Campo trampa: los usuarios reales no lo ven ni lo llenan. */
  website: z.string().max(200).optional(),
});

export const updateResenaSchema = z.object({
  id: resenaIdSchema,
  nombre,
  comentario,
});
