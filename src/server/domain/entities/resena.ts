import { InvalidRemateError } from "../errors/invalid-remate-error.ts";
import type { Checked } from "../rules/checked.ts";
import { checkEmail, checkPhone } from "../rules/contact-rules.ts";
import {
  checkComentario,
  checkNombre,
  COMENTARIO_MAX,
  COMENTARIO_MIN,
} from "../rules/content-rules.ts";

export {
  COMENTARIO_MAX as RESENA_COMENTARIO_MAX,
  COMENTARIO_MIN as RESENA_COMENTARIO_MIN,
};

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

function unwrap<T>(result: Checked<T>): T {
  if (!result.ok) throw new InvalidRemateError(result.error);
  return result.value;
}

/**
 * Validación estricta de una reseña pública: devuelve los datos normalizados
 * (correo en minúsculas, teléfono con formato) o lanza `InvalidRemateError`.
 */
export function normalizeResena(input: NewResena): NewResena {
  return {
    remateId: input.remateId,
    nombre: unwrap(checkNombre(input.nombre)),
    email: unwrap(checkEmail(input.email)),
    telefono: unwrap(checkPhone(input.telefono)),
    comentario: unwrap(checkComentario(input.comentario)),
  };
}

/**
 * Reglas mínimas para lo que edita el administrador. No aplican los filtros del público:
 * moderar una reseña implica poder reescribirla (por ejemplo, quitando una grosería).
 */
export function assertResenaChangesRules(changes: ResenaChanges): void {
  if (!changes.nombre.trim()) {
    throw new InvalidRemateError("Indica el nombre de quien escribe la reseña.");
  }
  const length = changes.comentario.trim().length;
  if (length < COMENTARIO_MIN) {
    throw new InvalidRemateError("La reseña es demasiado corta.");
  }
  if (length > COMENTARIO_MAX) {
    throw new InvalidRemateError(`La reseña no puede superar ${COMENTARIO_MAX} caracteres.`);
  }
}
