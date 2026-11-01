export interface CreateResenaInput {
  remateId: string;
  nombre: string;
  email: string;
  telefono: string;
  comentario: string;
  calificacion: number;
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
  /** 1 a 5; `null` en reseñas antiguas sin calificación. */
  calificacion: number | null;
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
