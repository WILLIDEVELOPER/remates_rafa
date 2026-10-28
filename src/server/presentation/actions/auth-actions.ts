"use server";

import { APIError } from "better-auth/api";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { isAdminRole } from "../../domain/entities/user.ts";
import { UnauthorizedError } from "../../domain/errors/unauthorized-error.ts";
import { auth } from "../../infrastructure/services/auth.ts";
import { requireAdmin } from "../auth/require-admin.ts";
import {
  changePasswordSchema,
  loginSchema,
  safeAdminRedirect,
} from "../validators/auth-schema.ts";
import { fail, ok, type ActionResult } from "./action-result.ts";

export async function loginAction(
  input: unknown,
): Promise<ActionResult<{ redirectTo: string }>> {
  try {
    const { email, password, next } = loginSchema.parse(input);

    let user: { role?: unknown };
    try {
      ({ user } = await auth.api.signInEmail({
        body: { email, password },
        headers: await headers(),
      }));
    } catch (error) {
      if (error instanceof APIError && error.statusCode === 429) {
        throw new UnauthorizedError(
          "Demasiados intentos. Espera un momento e inténtalo de nuevo.",
        );
      }
      if (error instanceof APIError && error.statusCode < 500) {
        throw new UnauthorizedError("Correo o contraseña incorrectos.");
      }
      throw error;
    }

    if (!isAdminRole(user.role)) {
      await auth.api.signOut({ headers: await headers() });
      throw new UnauthorizedError("Tu cuenta no tiene acceso al panel.");
    }

    return ok({ redirectTo: safeAdminRedirect(next) });
  } catch (error) {
    return fail(error);
  }
}

export async function changePasswordAction(input: unknown): Promise<ActionResult<null>> {
  try {
    await requireAdmin();
    const { currentPassword, newPassword } = changePasswordSchema.parse(input);

    try {
      // Cierra las demás sesiones del usuario y conserva la actual.
      await auth.api.changePassword({
        body: { currentPassword, newPassword, revokeOtherSessions: true },
        headers: await headers(),
      });
    } catch (error) {
      if (error instanceof APIError && error.statusCode === 429) {
        throw new UnauthorizedError("Demasiados intentos. Espera un momento e inténtalo de nuevo.");
      }
      if (error instanceof APIError && error.statusCode < 500) {
        return {
          ok: false,
          error: {
            code: "VALIDATION",
            message: "La contraseña actual no es correcta.",
            fieldErrors: { currentPassword: ["La contraseña actual no es correcta."] },
          },
        };
      }
      throw error;
    }

    return ok(null);
  } catch (error) {
    return fail(error);
  }
}

export async function logoutAction(): Promise<void> {
  await auth.api.signOut({ headers: await headers() });
  redirect("/admin/login");
}
