import { count, desc, eq } from "drizzle-orm";
import type { NewResena, Resena, ResenaChanges } from "../../domain/entities/resena.ts";
import type { Paginated } from "../../domain/repositories/remate-repository.ts";
import type { ResenaRepository } from "../../domain/repositories/resena-repository.ts";
import type { db } from "../db/client.ts";
import { resenas } from "../db/schema.ts";

type Database = typeof db;

export class DrizzleResenaRepository implements ResenaRepository {
  private readonly db: Database;

  constructor(database: Database) {
    this.db = database;
  }

  async create(data: NewResena): Promise<Resena> {
    const [row] = await this.db.insert(resenas).values(data).returning();

    return row;
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
    const rows = await this.db
      .delete(resenas)
      .where(eq(resenas.id, id))
      .returning({ id: resenas.id });

    return rows.length > 0;
  }
}
