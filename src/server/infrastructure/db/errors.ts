const UNIQUE_VIOLATION = "23505";

/** Detecta una violación de unicidad de Postgres, aunque venga envuelta en `cause`. */
export function isUniqueViolation(error: unknown): boolean {
  let current: unknown = error;
  for (let depth = 0; depth < 3 && current; depth++) {
    if ((current as { code?: string }).code === UNIQUE_VIOLATION) return true;
    current = (current as { cause?: unknown }).cause;
  }
  return false;
}
