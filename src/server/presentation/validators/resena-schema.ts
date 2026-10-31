import { z } from "zod";
import {
  RESENA_COMENTARIO_MAX,
  RESENA_COMENTARIO_MIN,
} from "../../domain/entities/resena.ts";
import { checkEmail, checkPhone } from "../../domain/rules/contact-rules.ts";
import { checkComentario, checkNombre } from "../../domain/rules/content-rules.ts";
import { checkedField } from "./checked-field.ts";

const comentarioEditable = z
  .string()
  .trim()
  .min(RESENA_COMENTARIO_MIN, `Cuéntanos un poco más (mínimo ${RESENA_COMENTARIO_MIN} caracteres).`)
  .max(RESENA_COMENTARIO_MAX, `La reseña no puede superar ${RESENA_COMENTARIO_MAX} caracteres.`);

export const resenaIdSchema = z.uuid("Identificador de reseña inválido.");

export const remateResenasIdSchema = z.uuid("Identificador de remate inválido.");

export const createResenaSchema = z.object({
  remateId: remateResenasIdSchema,
  nombre: checkedField(checkNombre, 200),
  email: checkedField(checkEmail, 300),
  telefono: checkedField(checkPhone, 60),
  comentario: checkedField(checkComentario, RESENA_COMENTARIO_MAX * 2),
  /** Campo trampa: los usuarios reales no lo ven ni lo llenan. */
  website: z.string().max(200).optional(),
});

/** El administrador puede reescribir libremente (p. ej. quitando una grosería). */
export const updateResenaSchema = z.object({
  id: resenaIdSchema,
  nombre: z.string().trim().min(2, "Indica el nombre.").max(120, "El nombre es demasiado largo."),
  comentario: comentarioEditable,
});
