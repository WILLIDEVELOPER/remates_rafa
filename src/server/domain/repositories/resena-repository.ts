import type { NewResena, Resena, ResenaChanges } from "../entities/resena.ts";
import type { Paginated } from "./remate-repository.ts";

export interface ResenaRepository {
  create(data: NewResena): Promise<Resena>;
  /** Más recientes primero. Sin `limit` devuelve todas; `total` siempre cuenta todas. */
  listByRemate(remateId: string, limit?: number): Promise<Paginated<Resena>>;
  update(id: string, changes: ResenaChanges): Promise<Resena | null>;
  /** `false` si la reseña no existía. */
  delete(id: string): Promise<boolean>;
}
