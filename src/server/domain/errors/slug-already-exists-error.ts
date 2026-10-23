import { DomainError } from "./domain-error.ts";

export class SlugAlreadyExistsError extends DomainError {
  readonly code = "CONFLICT";

  constructor(slug: string) {
    super(`Ya existe un remate con el slug "${slug}".`);
  }
}
