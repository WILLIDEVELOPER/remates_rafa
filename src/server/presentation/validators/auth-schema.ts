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
