import { count, desc, eq } from "drizzle-orm";
import type {
  ContactRequest,
  ContactRequestWithRemate,
  NewContactRequest,
} from "../../domain/entities/contact-request.ts";
import type {
  ContactRequestRepository,
  ListContactRequestsQuery,
} from "../../domain/repositories/contact-request-repository.ts";
import type { Paginated } from "../../domain/repositories/remate-repository.ts";
import type { db } from "../db/client.ts";
import { remates, solicitudesContacto } from "../db/schema.ts";

type Database = typeof db;

export class DrizzleContactRequestRepository
  implements ContactRequestRepository
{
  private readonly db: Database;

  constructor(database: Database) {
    this.db = database;
  }

  async create(data: NewContactRequest): Promise<ContactRequest> {
    const [row] = await this.db
      .insert(solicitudesContacto)
      .values(data)
      .returning();

    return row;
  }

  async list({
    page,
    pageSize,
    onlyUnread,
  }: ListContactRequestsQuery): Promise<Paginated<ContactRequestWithRemate>> {
    const where = onlyUnread ? eq(solicitudesContacto.leida, false) : undefined;

    const [rows, [totalRow]] = await Promise.all([
      this.db
        .select({
          request: solicitudesContacto,
          remateNombre: remates.nombre,
          remateSlug: remates.slug,
        })
        .from(solicitudesContacto)
        .leftJoin(remates, eq(solicitudesContacto.remateId, remates.id))
        .where(where)
        .orderBy(desc(solicitudesContacto.createdAt))
        .limit(pageSize)
        .offset((page - 1) * pageSize),
      this.db.select({ total: count() }).from(solicitudesContacto).where(where),
    ]);

    return {
      items: rows.map(({ request, remateNombre, remateSlug }) => ({
        ...request,
        remateNombre,
        remateSlug,
      })),
      total: totalRow?.total ?? 0,
    };
  }

  async setRead(id: string, leida: boolean): Promise<ContactRequest | null> {
    const [row] = await this.db
      .update(solicitudesContacto)
      .set({ leida })
      .where(eq(solicitudesContacto.id, id))
      .returning();

    return row ?? null;
  }

  async countUnread(): Promise<number> {
    const [row] = await this.db
      .select({ total: count() })
      .from(solicitudesContacto)
      .where(eq(solicitudesContacto.leida, false));

    return row?.total ?? 0;
  }
}
