import { invalid, valid, type Checked } from "./checked.ts";

// Módulo puro (sin imports de otras capas): lo usan el servidor, la consulta de
// ranking y los formularios.

export const CALIFICACION_MIN = 1;
export const CALIFICACION_MAX = 5;

/**
 * Promedio bayesiano: cada remate parte con `PRIOR_WEIGHT` reseñas "virtuales" de
 * `PRIOR_MEAN` estrellas. Con pocas reseñas el puntaje se queda cerca de la media
 * general; con muchas, manda el promedio real. Así un remate con una sola reseña de
 * 5★ (puntaje 3,75) no supera a uno con 40 reseñas de 4,8★ (puntaje 4,67).
 */
export const PRIOR_MEAN = 3.5;
export const PRIOR_WEIGHT = 5;

/** Una reseña solo se destaca en la tarjeta del remate si tiene al menos esta calificación. */
export const CALIFICACION_DESTACADA_MIN = 4;

export function rankingScore(promedio: number | null, count: number): number {
  const sum = (promedio ?? 0) * count;
  return (sum + PRIOR_MEAN * PRIOR_WEIGHT) / (count + PRIOR_WEIGHT);
}

export function isCalificacion(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= CALIFICACION_MIN &&
    value <= CALIFICACION_MAX
  );
}

export function checkCalificacion(raw: unknown): Checked<number> {
  const value = typeof raw === "string" && raw.trim() !== "" ? Number(raw) : raw;
  if (!isCalificacion(value)) {
    return invalid(`Elige una calificación de ${CALIFICACION_MIN} a ${CALIFICACION_MAX} estrellas.`);
  }
  return valid(value);
}
