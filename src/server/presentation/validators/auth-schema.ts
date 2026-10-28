import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Ingresa tu correo electrónico.")
    .pipe(z.email("Ingresa un correo electrónico válido.")),
  password: z
    .string()
    .min(1, "Ingresa tu contraseña.")
    .max(128, "La contraseña es demasiado larga."),
  next: z.string().max(500).optional(),
});

export const MIN_NEW_PASSWORD_LENGTH = 12;

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "Ingresa tu contraseña actual.")
      .max(128, "La contraseña es demasiado larga."),
    newPassword: z
      .string()
      .min(
        MIN_NEW_PASSWORD_LENGTH,
        `La nueva contraseña debe tener al menos ${MIN_NEW_PASSWORD_LENGTH} caracteres.`,
      )
      .max(128, "La contraseña es demasiado larga."),
  })
  .refine((values) => values.newPassword !== values.currentPassword, {
    path: ["newPassword"],
    message: "La nueva contraseña debe ser distinta de la actual.",
  });

/** Solo se permiten redirecciones internas al panel (evita open redirect). */
export function safeAdminRedirect(next: string | undefined): string {
  if (
    next &&
    next.startsWith("/admin") &&
    !next.startsWith("/admin/login") &&
    !next.includes("//") &&
    !next.includes("\\")
  ) {
    return next;
  }
  return "/admin";
}
