import { DomainError } from "./domain-error.ts";

export class InvalidRemateError extends DomainError {
  readonly code = "INVALID";
}
