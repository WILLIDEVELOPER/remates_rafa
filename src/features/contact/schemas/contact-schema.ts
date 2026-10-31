import { z } from "zod";
import { checkEmail, checkPhone } from "@/server/domain/rules/contact-rules";

export const contactFormSchema = z.object({
  nombre: z.string().trim().min(2, "Ingresa tu nombre.").max(120, "El nombre es demasiado largo."),
  // Mismas reglas que valida el servidor; aquí solo avisan antes de enviar.
  email: z.string().superRefine((value, ctx) => {
    const result = checkEmail(value);
    if (!result.ok) ctx.addIssue({ code: "custom", message: result.error });
  }),
  telefono: z.string().superRefine((value, ctx) => {
    if (value.trim() === "") return;
    const result = checkPhone(value);
    if (!result.ok) ctx.addIssue({ code: "custom", message: result.error });
  }),
  mensaje: z
    .string()
    .trim()
    .min(10, "Cuéntanos un poco más (mínimo 10 caracteres).")
    .max(2000, "El mensaje no puede superar 2000 caracteres."),
  website: z.string().max(200),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
