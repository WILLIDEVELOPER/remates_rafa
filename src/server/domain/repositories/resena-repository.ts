import type { NewResena, Resena, ResenaChanges } from "../entities/resena.ts";
import type { Paginated } from "./remate-repository.ts";

/** Datos de procedencia de una reseña, usados solo contra abusos (nunca se muestran). */
export interface ResenaOrigen {
  /** Correo sin alias (`emailKey`): identifica a la persona, no a la dirección escrita. */
  emailClave: string;
  /** HMAC de la IP; `null` si no se pudo determinar. */
  ipHash: string | null;
}

export interface ResenaRepository {
  /** Guarda la reseña y recalcula el promedio y el conteo de calificaciones del remate. */
  create(data: NewResena, origen: ResenaOrigen): Promise<Resena>;
  /** ¿Esa persona ya reseñó este remate? */
  existsByEmailClave(remateId: string, emailClave: string): Promise<boolean>;
  /** Reseñas de una IP desde `since`; con `remateId`, solo las de ese remate. */
  countByIpSince(ipHash: string, since: Date, remateId?: string): Promise<number>;
  /** Más recientes primero. Sin `limit` devuelve todas; `total` siempre cuenta todas. */
  listByRemate(remateId: string, limit?: number): Promise<Paginated<Resena>>;
  update(id: string, changes: ResenaChanges): Promise<Resena | null>;
  /** `false` si la reseña no existía. Recalcula el promedio del remate. */
  delete(id: string): Promise<boolean>;
  /**
   * La mejor reseña de cada remate (la de mayor calificación y, a igual calificación, la más
   * reciente) entre las que tienen al menos `minCalificacion`. Los remates sin una así no aparecen.
   */
  findBestByRemates(remateIds: string[], minCalificacion: number): Promise<Resena[]>;
}
