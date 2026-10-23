import { z } from "zod";

export const contactRequestSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(2, "Ingresa tu nombre.")
    .max(120, "El nombre es demasiado largo."),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Ingresa tu correo electrónico.")
    .max(255)
    .pipe(z.email("Ingresa un correo electrónico válido.")),
  telefono: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z
      .string()
      .trim()
      .regex(/^\+?[\d\s-]{7,20}$/, "Ingresa un teléfono válido.")
      .optional(),
  ),
  mensaje: z
    .string()
    .trim()
    .min(10, "Cuéntanos un poco más (mínimo 10 caracteres).")
    .max(2000, "El mensaje no puede superar 2000 caracteres."),
  remateId: z.uuid().nullish(),
  /** Campo trampa: los usuarios reales no lo ven ni lo llenan. */
  website: z.string().max(200).optional(),
});
