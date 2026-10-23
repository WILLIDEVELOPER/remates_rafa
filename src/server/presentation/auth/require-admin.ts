import { headers } from "next/headers";
import { cache } from "react";
import { isAdminRole, type UserRole } from "../../domain/entities/user.ts";
import { UnauthorizedError } from "../../domain/errors/unauthorized-error.ts";
import { auth } from "../../infrastructure/services/auth.ts";

export interface AdminSession {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
}

/** Sesión del administrador actual, o `null` si no hay sesión o el rol no alcanza. */
export const getAdminSession = cache(async (): Promise<AdminSession | null> => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || !isAdminRole(session.user.role)) return null;

  return {
    userId: session.user.id,
    name: session.user.name,
    email: session.user.email,
    role: session.user.role,
  };
});

/** Guard de las acciones administrativas: lanza `UnauthorizedError` si no hay un admin. */
export async function requireAdmin(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) throw new UnauthorizedError("Tu sesión expiró. Inicia sesión de nuevo.");

  return session;
}
