export interface CreateContactRequestInput {
  nombre: string;
  email: string;
  telefono?: string | null;
  mensaje: string;
  remateId?: string | null;
}

export interface ContactRequestDto {
  id: string;
  nombre: string;
  email: string;
  telefono: string | null;
  mensaje: string;
  remateId: string | null;
  remateNombre: string | null;
  remateSlug: string | null;
  leida: boolean;
  /** ISO 8601 */
  createdAt: string;
}

export interface ListContactRequestsInput {
  page?: number;
  pageSize?: number;
  onlyUnread?: boolean;
}

export interface ListContactRequestsOutput {
  items: ContactRequestDto[];
  total: number;
  /** Solicitudes sin leer en total, sin importar el filtro. */
  unread: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
