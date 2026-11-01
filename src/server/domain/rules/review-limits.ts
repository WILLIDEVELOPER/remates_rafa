// Módulo puro: límites contra reseñas repetidas o masivas.
//
// La IP puede ser compartida (oficinas, redes móviles con CGNAT), por eso su límite es holgado;
// el límite fuerte es una reseña por correo y por remate.

/** Ventana en la que se cuentan las reseñas de una misma IP. */
export const RESENA_VENTANA_HORAS = 24;

/** Reseñas que una misma IP puede dejar sobre un mismo remate en la ventana. */
export const MAX_RESENAS_IP_POR_REMATE = 2;

/** Reseñas que una misma IP puede dejar en total (todos los remates) en la ventana. */
export const MAX_RESENAS_IP_TOTAL = 5;

const GMAIL_DOMAINS = new Set(["gmail.com", "googlemail.com"]);

/**
 * Clave para detectar a la misma persona con distintos alias del correo:
 * `Ana.Perez+remates@Gmail.com` y `anaperez@gmail.com` dan la misma clave.
 * Se quita la etiqueta `+algo` en cualquier dominio y los puntos solo en Gmail,
 * donde no cambian la dirección.
 */
export function emailKey(email: string): string {
  const [rawLocal = "", rawDomain = ""] = email.trim().toLowerCase().split("@");
  const domain = rawDomain === "googlemail.com" ? "gmail.com" : rawDomain;

  let local = rawLocal.split("+")[0] ?? "";
  if (GMAIL_DOMAINS.has(domain)) local = local.replaceAll(".", "");

  return `${local}@${domain}`;
}
