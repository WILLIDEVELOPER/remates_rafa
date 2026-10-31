/** Resultado de una regla de validación: el valor normalizado o el mensaje para la persona. */
export type Checked<T> = { ok: true; value: T } | { ok: false; error: string };

export function valid<T>(value: T): Checked<T> {
  return { ok: true, value };
}

export function invalid(error: string): Checked<never> {
  return { ok: false, error };
}
