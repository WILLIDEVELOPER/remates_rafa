export interface CreateResenaInput {
  remateId: string;
  nombre: string;
  email: string;
  telefono: string;
  comentario: string;
}

export interface UpdateResenaInput {
  id: string;
  nombre: string;
  comentario: string;
}

/** Lo que ve cualquier visitante: nunca incluye correo ni teléfono. */
export interface PublicResenaDto {
  id: string;
  nombre: string;
  comentario: string;
  /** ISO 8601 */
  createdAt: string;
}

export interface AdminResenaDto extends PublicResenaDto {
  email: string;
  telefono: string;
}

export interface ListResenasOutput<T> {
  items: T[];
  total: number;
}
