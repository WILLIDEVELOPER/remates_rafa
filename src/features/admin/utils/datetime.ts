// Colombia no tiene horario de verano: siempre UTC-5.
const BOGOTA_OFFSET_MS = 5 * 60 * 60 * 1000;

/** ISO (UTC) -> `YYYY-MM-DDTHH:mm` en hora de Colombia, para `<input type="datetime-local">`. */
export function isoToBogotaLocal(iso: string | null): string {
  if (!iso) return "";
  return new Date(new Date(iso).getTime() - BOGOTA_OFFSET_MS).toISOString().slice(0, 16);
}

/** `YYYY-MM-DDTHH:mm` (hora de Colombia) -> ISO con zona horaria, o `null` si está vacío. */
export function bogotaLocalToIso(local: string): string | null {
  if (!local) return null;
  const withSeconds = local.length === 16 ? `${local}:00` : local;
  return `${withSeconds}-05:00`;
}
