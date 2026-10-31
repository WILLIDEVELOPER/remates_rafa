import { z } from "zod";
import { checkEmail, checkPhone } from "../../domain/rules/contact-rules.ts";
import { checkedField } from "./checked-field.ts";

export const contactRequestSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(2, "Ingresa tu nombre.")
    .max(120, "El nombre es demasiado largo."),
  email: checkedField(checkEmail, 300),
  telefono: z.preprocess(
    (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
    checkedField(checkPhone, 60).optional(),
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
