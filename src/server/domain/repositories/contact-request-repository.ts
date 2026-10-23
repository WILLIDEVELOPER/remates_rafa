import type {
  ContactRequest,
  ContactRequestWithRemate,
  NewContactRequest,
} from "../entities/contact-request.ts";
import type { Paginated } from "./remate-repository.ts";

export interface ListContactRequestsQuery {
  page: number;
  pageSize: number;
  onlyUnread: boolean;
}

export interface ContactRequestRepository {
  create(data: NewContactRequest): Promise<ContactRequest>;
  list(query: ListContactRequestsQuery): Promise<Paginated<ContactRequestWithRemate>>;
  setRead(id: string, leida: boolean): Promise<ContactRequest | null>;
  countUnread(): Promise<number>;
}
