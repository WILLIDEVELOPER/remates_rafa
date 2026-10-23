import { DomainError } from "./domain-error.ts";

export class ContactRequestNotFoundError extends DomainError {
  readonly code = "NOT_FOUND";

  constructor(id: string) {
    super(`No se encontró la solicitud "${id}".`);
  }
}
