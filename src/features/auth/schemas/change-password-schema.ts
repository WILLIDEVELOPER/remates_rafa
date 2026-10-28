import { z } from "zod";
import { MIN_NEW_PASSWORD_LENGTH } from "@/server/presentation/validators/auth-schema";

export const changePasswordFormSchema = z
  .object({
    currentPassword: z.string().min(1, "Ingresa tu contraseña actual."),
    newPassword: z
      .string()
      .min(
        MIN_NEW_PASSWORD_LENGTH,
        `La nueva contraseña debe tener al menos ${MIN_NEW_PASSWORD_LENGTH} caracteres.`,
      ),
    confirmPassword: z.string().min(1, "Repite la nueva contraseña."),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Las contraseñas no coinciden.",
  })
  .refine((values) => values.newPassword !== values.currentPassword, {
    path: ["newPassword"],
    message: "La nueva contraseña debe ser distinta de la actual.",
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordFormSchema>;
