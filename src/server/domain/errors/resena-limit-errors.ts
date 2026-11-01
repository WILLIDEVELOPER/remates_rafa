import { DomainError } from "./domain-error.ts";

/** El mismo correo ya reseñó este remate. */
export class DuplicateResenaError extends DomainError {
  readonly code = "CONFLICT";

  constructor() {
    super("Ya enviaste una reseña de este remate con ese correo. Solo se permite una por persona.");
  }
}

/** Demasiadas reseñas desde la misma conexión en poco tiempo. */
export class TooManyResenasError extends DomainError {
  readonly code = "RATE_LIMITED";

  constructor() {
    super("Has enviado demasiadas reseñas en poco tiempo. Inténtalo de nuevo mañana.");
  }
}
