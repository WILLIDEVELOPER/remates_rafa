import { assertContactRequestRules } from "../../domain/entities/contact-request.ts";
import type { ContactRequestRepository } from "../../domain/repositories/contact-request-repository.ts";
import type { RemateRepository } from "../../domain/repositories/remate-repository.ts";
import type { CreateContactRequestInput } from "../dtos/contact-request-dto.ts";
import { emptyToNull } from "./create-remate.ts";

export class CreateContactRequest {
  private readonly contactRequests: ContactRequestRepository;
  private readonly remates: RemateRepository;

  constructor(
    contactRequests: ContactRequestRepository,
    remates: RemateRepository,
  ) {
    this.contactRequests = contactRequests;
    this.remates = remates;
  }

  async execute(input: CreateContactRequestInput): Promise<{ id: string }> {
    const data = {
      nombre: input.nombre.trim(),
      email: input.email.trim().toLowerCase(),
      telefono: emptyToNull(input.telefono),
      mensaje: input.mensaje.trim(),
      remateId: input.remateId ?? null,
    };

    assertContactRequestRules(data);

    // Si el remate ya no existe, la solicitud se guarda igualmente sin vínculo.
    if (data.remateId && !(await this.remates.findById(data.remateId))) {
      data.remateId = null;
    }

    const created = await this.contactRequests.create(data);
    return { id: created.id };
  }
}
