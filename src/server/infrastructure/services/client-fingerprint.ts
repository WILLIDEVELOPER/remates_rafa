import { createHmac } from "node:crypto";

/**
 * Huella de una IP para limitar abusos sin guardarla: HMAC con un secreto del servidor, así el
 * valor almacenado no permite recuperar la IP ni cruzarla con datos de otros sitios.
 */
export function hashIp(ip: string): string {
  const secret = process.env.BETTER_AUTH_SECRET;
  if (!secret) throw new Error("BETTER_AUTH_SECRET no está definida");

  return createHmac("sha256", secret).update(ip).digest("hex");
}
