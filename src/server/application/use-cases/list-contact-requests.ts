import type { ContactRequestWithRemate } from "../../domain/entities/contact-request.ts";
import type { ContactRequestRepository } from "../../domain/repositories/contact-request-repository.ts";
import type {
  ContactRequestDto,
  ListContactRequestsInput,
  ListContactRequestsOutput,
} from "../dtos/contact-request-dto.ts";

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 50;

export function toContactRequestDto(request: ContactRequestWithRemate): ContactRequestDto {
  return {
    id: request.id,
    nombre: request.nombre,
    email: request.email,
    telefono: request.telefono,
    mensaje: request.mensaje,
    remateId: request.remateId,
    remateNombre: request.remateNombre,
    remateSlug: request.remateSlug,
    leida: request.leida,
    createdAt: request.createdAt.toISOString(),
  };
}

export class ListContactRequests {
  private readonly contactRequests: ContactRequestRepository;

  constructor(contactRequests: ContactRequestRepository) {
    this.contactRequests = contactRequests;
  }

  async execute(input: ListContactRequestsInput = {}): Promise<ListContactRequestsOutput> {
    const page = Math.max(1, Math.floor(input.page ?? 1));
    const pageSize = Math.min(
      MAX_PAGE_SIZE,
      Math.max(1, Math.floor(input.pageSize ?? DEFAULT_PAGE_SIZE)),
    );

    const [{ items, total }, unread] = await Promise.all([
      this.contactRequests.list({
        page,
        pageSize,
        onlyUnread: input.onlyUnread ?? false,
      }),
      this.contactRequests.countUnread(),
    ]);

    return {
      items: items.map(toContactRequestDto),
      total,
      unread,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    };
  }
}
