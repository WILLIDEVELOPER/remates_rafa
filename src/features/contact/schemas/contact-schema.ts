import { z } from "zod";

export const contactFormSchema = z.object({
  nombre: z.string().trim().min(2, "Ingresa tu nombre.").max(120, "El nombre es demasiado largo."),
  email: z
    .string()
    .trim()
    .min(1, "Ingresa tu correo electrónico.")
    .pipe(z.email("Ingresa un correo electrónico válido.")),
  telefono: z
    .string()
    .trim()
    .refine((value) => value === "" || /^\+?[\d\s-]{7,20}$/.test(value), "Ingresa un teléfono válido."),
  mensaje: z
    .string()
    .trim()
    .min(10, "Cuéntanos un poco más (mínimo 10 caracteres).")
    .max(2000, "El mensaje no puede superar 2000 caracteres."),
  website: z.string().max(200),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
