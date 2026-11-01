import { and, count, desc, eq, gte, inArray, sql } from "drizzle-orm";
import type { NewResena, Resena, ResenaChanges } from "../../domain/entities/resena.ts";
import type { Paginated } from "../../domain/repositories/remate-repository.ts";
import { DuplicateResenaError } from "../../domain/errors/resena-limit-errors.ts";
import type { ResenaOrigen, ResenaRepository } from "../../domain/repositories/resena-repository.ts";
import type { db } from "../db/client.ts";
import { isUniqueViolation } from "../db/errors.ts";
import { remates, resenas } from "../db/schema.ts";

type Database = typeof db;

export class DrizzleResenaRepository implements ResenaRepository {
  private readonly db: Database;

  constructor(database: Database) {
    this.db = database;
  }

  /**
   * Recalcula el promedio y el conteo desde las reseñas (la fuente de verdad) en una sola
   * sentencia: si falla o se repite, el siguiente alta o baja lo deja correcto.
   */
  private async refreshRating(remateId: string): Promise<void> {
    await this.db
      .update(remates)
      .set({
        calificacionPromedio: sql`(
          select round(avg(${resenas.calificacion})::numeric, 2)
          from ${resenas} where ${resenas.remateId} = ${remateId}
        )`,
        calificacionesCount: sql`(
          select count(${resenas.calificacion})::int
          from ${resenas} where ${resenas.remateId} = ${remateId}
        )`,
      })
      .where(eq(remates.id, remateId));
  }

  async create(data: NewResena, origen: ResenaOrigen): Promise<Resena> {
    try {
      const [row] = await this.db
        .insert(resenas)
        .values({ ...data, emailClave: origen.emailClave, ipHash: origen.ipHash })
        .returning();
      await this.refreshRating(row.remateId);

      return row;
    } catch (error) {
      // Dos envíos simultáneos del mismo correo: el índice único deja pasar solo uno.
      if (isUniqueViolation(error)) throw new DuplicateResenaError();
      throw error;
    }
  }

  async existsByEmailClave(remateId: string, emailClave: string): Promise<boolean> {
    const [row] = await this.db
      .select({ id: resenas.id })
      .from(resenas)
      .where(and(eq(resenas.remateId, remateId), eq(resenas.emailClave, emailClave)))
      .limit(1);

    return Boolean(row);
  }

  async countByIpSince(ipHash: string, since: Date, remateId?: string): Promise<number> {
    const [row] = await this.db
      .select({ total: count() })
      .from(resenas)
      .where(
        and(
          eq(resenas.ipHash, ipHash),
          gte(resenas.createdAt, since),
          remateId ? eq(resenas.remateId, remateId) : undefined,
        ),
      );

    return row?.total ?? 0;
  }

  async findBestByRemates(remateIds: string[], minCalificacion: number): Promise<Resena[]> {
    if (remateIds.length === 0) return [];

    return this.db
      .selectDistinctOn([resenas.remateId])
      .from(resenas)
      .where(and(inArray(resenas.remateId, remateIds), gte(resenas.calificacion, minCalificacion)))
      .orderBy(resenas.remateId, desc(resenas.calificacion), desc(resenas.createdAt));
  }

  async listByRemate(remateId: string, limit?: number): Promise<Paginated<Resena>> {
    const query = this.db
      .select()
      .from(resenas)
      .where(eq(resenas.remateId, remateId))
      .orderBy(desc(resenas.createdAt))
      .$dynamic();

    const [items, [totalRow]] = await Promise.all([
      limit ? query.limit(limit) : query,
      this.db.select({ total: count() }).from(resenas).where(eq(resenas.remateId, remateId)),
    ]);

    return { items, total: totalRow?.total ?? 0 };
  }

  async update(id: string, changes: ResenaChanges): Promise<Resena | null> {
    const [row] = await this.db
      .update(resenas)
      .set(changes)
      .where(eq(resenas.id, id))
      .returning();

    return row ?? null;
  }

  async delete(id: string): Promise<boolean> {
    const [deleted] = await this.db
      .delete(resenas)
      .where(eq(resenas.id, id))
      .returning({ remateId: resenas.remateId });
    if (!deleted) return false;

    await this.refreshRating(deleted.remateId);
    return true;
  }
}
