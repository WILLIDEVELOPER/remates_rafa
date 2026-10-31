import { InvalidRemateError } from "../errors/invalid-remate-error.ts";

export const RESENA_COMENTARIO_MIN = 10;
export const RESENA_COMENTARIO_MAX = 1000;

/**
 * Reseña de un remate. Quien la escribe no tiene cuenta: sus datos de contacto
 * viven en la propia reseña y solo los ve el administrador.
 */
export interface Resena {
  id: string;
  remateId: string;
  nombre: string;
  email: string;
  telefono: string;
  comentario: string;
  createdAt: Date;
}

export type NewResena = Omit<Resena, "id" | "createdAt">;

/** Lo único que el administrador puede corregir de una reseña. */
export type ResenaChanges = Pick<Resena, "nombre" | "comentario">;

export function assertResenaChangesRules(changes: ResenaChanges): void {
  if (!changes.nombre.trim()) {
    throw new InvalidRemateError("Indica el nombre de quien escribe la reseña.");
  }
  const length = changes.comentario.trim().length;
  if (length < RESENA_COMENTARIO_MIN) {
    throw new InvalidRemateError("La reseña es demasiado corta.");
  }
  if (length > RESENA_COMENTARIO_MAX) {
    throw new InvalidRemateError(
      `La reseña no puede superar ${RESENA_COMENTARIO_MAX} caracteres.`,
    );
  }
}

export function assertResenaRules(
  resena: Pick<NewResena, "nombre" | "email" | "telefono" | "comentario">,
): void {
  assertResenaChangesRules(resena);
  if (!resena.email.includes("@")) {
    throw new InvalidRemateError("El correo electrónico no es válido.");
  }
  if (!resena.telefono.trim()) {
    throw new InvalidRemateError("Indica tu número de teléfono.");
  }
}
