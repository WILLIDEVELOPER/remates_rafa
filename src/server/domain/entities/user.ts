export const USER_ROLES = ["admin", "super_admin"] as const;

export type UserRole = (typeof USER_ROLES)[number];

/** Todos los roles actuales pueden entrar al panel administrativo. */
export function isAdminRole(role: unknown): role is UserRole {
  return typeof role === "string" && (USER_ROLES as readonly string[]).includes(role);
}
