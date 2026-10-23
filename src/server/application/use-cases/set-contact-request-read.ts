import { ContactRequestNotFoundError } from "../../domain/errors/contact-request-not-found-error.ts";
import type { ContactRequestRepository } from "../../domain/repositories/contact-request-repository.ts";

export class SetContactRequestRead {
  private readonly contactRequests: ContactRequestRepository;

  constructor(contactRequests: ContactRequestRepository) {
    this.contactRequests = contactRequests;
  }

  async execute(id: string, leida: boolean): Promise<{ id: string; leida: boolean }> {
    const updated = await this.contactRequests.setRead(id, leida);
    if (!updated) throw new ContactRequestNotFoundError(id);

    return { id: updated.id, leida: updated.leida };
  }
}
