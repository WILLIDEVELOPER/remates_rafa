import { z } from "zod";
import type { Checked } from "@/server/domain/rules/checked";
import { checkEmail, checkPhone } from "@/server/domain/rules/contact-rules";
import { CALIFICACION_MAX, CALIFICACION_MIN } from "@/server/domain/rules/rating-rules";
import { checkComentario, checkNombre, COMENTARIO_MAX } from "@/server/domain/rules/content-rules";

export const REVIEW_MAX = COMENTARIO_MAX;

/**
 * Mismas reglas que valida el servidor (que es quien las hace cumplir):
 * aquí solo sirven para avisar antes de enviar.
 */
function checked(check: (raw: string) => Checked<string>) {
  return z.string().superRefine((value, ctx) => {
    const result = check(value);
    if (!result.ok) ctx.addIssue({ code: "custom", message: result.error });
  });
}

export const reviewFormSchema = z.object({
  calificacion: z
    .number("Elige una calificación de 1 a 5 estrellas.")
    .int()
    .min(CALIFICACION_MIN, "Elige al menos una estrella.")
    .max(CALIFICACION_MAX),
  nombre: checked(checkNombre),
  email: checked(checkEmail),
  telefono: checked(checkPhone),
  comentario: checked(checkComentario),
  website: z.string().max(200),
});

export type ReviewFormValues = z.infer<typeof reviewFormSchema>;
