import { DomainError } from "./domain-error.ts";

export class UnauthorizedError extends DomainError {
  readonly code = "UNAUTHORIZED";

  constructor(message = "No tienes permisos para realizar esta acción.") {
    super(message);
  }
}
