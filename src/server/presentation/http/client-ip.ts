import { headers } from "next/headers";
import { hashIp } from "../../infrastructure/services/client-fingerprint.ts";

/**
 * Huella de la IP de quien hace la petición, o `null` si no se puede determinar (p. ej. en
 * local). Se confía en las cabeceras que fija la plataforma de despliegue, que sobrescribe las
 * que envía el cliente; fuera de ella podrían falsificarse.
 */
export async function getClientIpHash(): Promise<string | null> {
  const requestHeaders = await headers();

  const ip =
    requestHeaders.get("x-nf-client-connection-ip") ??
    requestHeaders.get("x-real-ip") ??
    requestHeaders.get("x-forwarded-for")?.split(",")[0];

  const trimmed = ip?.trim();
  return trimmed ? hashIp(trimmed) : null;
}
