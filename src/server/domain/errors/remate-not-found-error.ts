import { DomainError } from "./domain-error.ts";

export class RemateNotFoundError extends DomainError {
  readonly code = "NOT_FOUND";

  constructor(reference: string) {
    super(`No se encontró el remate "${reference}".`);
  }
}
