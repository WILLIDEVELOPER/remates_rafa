import { z } from "zod";

export const REVIEW_MIN = 10;
export const REVIEW_MAX = 1000;

export const reviewFormSchema = z.object({
  nombre: z.string().trim().min(2, "Ingresa tu nombre.").max(120, "El nombre es demasiado largo."),
  email: z
    .string()
    .trim()
    .min(1, "Ingresa tu correo electrónico.")
    .pipe(z.email("Ingresa un correo electrónico válido.")),
  telefono: z
    .string()
    .trim()
    .min(1, "Ingresa tu número de teléfono.")
    .regex(/^\+?[\d\s-]{7,20}$/, "Ingresa un teléfono válido."),
  comentario: z
    .string()
    .trim()
    .min(REVIEW_MIN, `Cuéntanos un poco más (mínimo ${REVIEW_MIN} caracteres).`)
    .max(REVIEW_MAX, `La reseña no puede superar ${REVIEW_MAX} caracteres.`),
  website: z.string().max(200),
});

export type ReviewFormValues = z.infer<typeof reviewFormSchema>;
