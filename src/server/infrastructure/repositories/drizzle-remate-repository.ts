import {
  and,
  asc,
  count,
  desc,
  eq,
  getTableColumns,
  gte,
  ilike,
  inArray,
  lte,
  ne,
  or,
  sql,
  type SQL,
} from "drizzle-orm";
import type {
  EstadoRemate,
  NewRemate,
  Remate,
  RemateChanges,
} from "../../domain/entities/remate.ts";
import { ESTADOS_REMATE } from "../../domain/entities/remate.ts";
import { PRIOR_MEAN, PRIOR_WEIGHT } from "../../domain/rules/rating-rules.ts";
import { SlugAlreadyExistsError } from "../../domain/errors/slug-already-exists-error.ts";
import type {
  DepartamentoCount,
  ListRematesQuery,
  Paginated,
  PublicRemateEntry,
  RemateFilters,
  RemateRepository,
  RemateSort,
  RemateStats,
} from "../../domain/repositories/remate-repository.ts";
import type { db } from "../db/client.ts";
import { isUniqueViolation } from "../db/errors.ts";
import { remates, type RemateRow } from "../db/schema.ts";

type Database = typeof db;
type RemateColumns = Omit<RemateRow, "searchVector">;

// El tsvector solo sirve para filtrar; no se transfiere en las lecturas.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { searchVector: _searchVector, ...columns } = getTableColumns(remates);

function escapeLike(value: string): string {
  return value.replace(/[\\%_]/g, "\\$&");
}

const toNumberOrNull = (value: string | null) => (value === null ? null : Number(value));
const toStringOrNull = (value: number | null) => (value === null ? null : String(value));

function toEntity(row: RemateColumns): Remate {
  return {
    ...row,
    precioBase: Number(row.precioBase),
    precioComercial: toNumberOrNull(row.precioComercial),
    precioDerecho: toNumberOrNull(row.precioDerecho),
    area: toNumberOrNull(row.area),
    calificacionPromedio: toNumberOrNull(row.calificacionPromedio),
  };
}

function toInsertValues(data: NewRemate) {
  return {
    ...data,
    precioBase: String(data.precioBase),
    precioComercial: toStringOrNull(data.precioComercial),
    precioDerecho: toStringOrNull(data.precioDerecho),
    area: toStringOrNull(data.area),
  };
}

function toUpdateValues(changes: RemateChanges) {
  const { precioBase, precioComercial, precioDerecho, area, ...rest } = changes;
  return {
    ...rest,
    ...(precioBase !== undefined && { precioBase: String(precioBase) }),
    ...(precioComercial !== undefined && { precioComercial: toStringOrNull(precioComercial) }),
    ...(precioDerecho !== undefined && { precioDerecho: toStringOrNull(precioDerecho) }),
    ...(area !== undefined && { area: toStringOrNull(area) }),
  };
}

// Mismo cálculo que `rankingScore` del dominio, pero en SQL para ordenar en la base de datos.
const rankingScoreSql = sql`(
  coalesce(${remates.calificacionPromedio}, 0) * ${remates.calificacionesCount} + ${PRIOR_MEAN * PRIOR_WEIGHT}
) / (${remates.calificacionesCount} + ${PRIOR_WEIGHT})`

// Búsqueda aproximada (pg_trgm): tolera errores de tipeo, letras de más o de
// menos y tildes. 0 = nada en común, 1 = coincidencia exacta.
const FUZZY_THRESHOLD = 0.45;

function fuzzyScore(search: string): SQL<number> {
  return sql<number>`word_similarity(
    unaccent('unaccent', lower(${search})),
    unaccent('unaccent', lower(concat_ws(' ', ${remates.nombre}, ${remates.ciudad}, ${remates.municipio}, ${remates.departamento})))
  )`;
}

function buildWhere(filters: RemateFilters): SQL | undefined {
  const conditions: (SQL | undefined)[] = [];

  const search = filters.search?.trim();
  if (search) {
    conditions.push(
      or(
        sql`${remates.searchVector} @@ websearch_to_tsquery('spanish', ${search})`,
        ilike(remates.nombre, `%${escapeLike(search)}%`),
        sql`${fuzzyScore(search)} >= ${FUZZY_THRESHOLD}`,
      ),
    );
  }
  if (filters.departamento) {
    conditions.push(eq(remates.departamento, filters.departamento));
  }
  if (filters.ciudad) conditions.push(eq(remates.ciudad, filters.ciudad));
  if (filters.municipio) {
    conditions.push(eq(remates.municipio, filters.municipio));
  }
  if (filters.tipos?.length) {
    conditions.push(inArray(remates.tipoInmueble, filters.tipos));
  }
  if (filters.tiposRemate?.length) {
    conditions.push(inArray(remates.tipoRemate, filters.tiposRemate));
  }
  if (filters.estados?.length) {
    conditions.push(inArray(remates.estado, filters.estados));
  }
  if (filters.precioMin !== undefined) {
    conditions.push(gte(remates.precioBase, String(filters.precioMin)));
  }
  if (filters.precioMax !== undefined) {
    conditions.push(lte(remates.precioBase, String(filters.precioMax)));
  }
  if (filters.destacado !== undefined) {
    conditions.push(eq(remates.destacado, filters.destacado));
  }
  if (filters.activo !== undefined) {
    conditions.push(eq(remates.activo, filters.activo));
  }

  return and(...conditions);
}

function buildOrderBy(sort: RemateSort, search?: string): SQL[] {
  const tieBreak = [desc(remates.createdAt), asc(remates.id)];
  // Con texto de búsqueda y orden por defecto, primero los más parecidos.
  if (search && sort === "recientes") {
    return [desc(fuzzyScore(search)), ...tieBreak];
  }

  switch (sort) {
    case "precio_asc":
      return [asc(remates.precioBase), ...tieBreak];
    case "precio_desc":
      return [desc(remates.precioBase), ...tieBreak];
    case "fecha_remate":
      return [sql`${remates.fechaRemate} asc nulls last`, ...tieBreak];
    case "mejor_calificados":
      return [desc(rankingScoreSql), desc(remates.calificacionesCount), ...tieBreak];
    default:
      return tieBreak;
  }
}

export class DrizzleRemateRepository implements RemateRepository {
  private readonly db: Database;

  constructor(database: Database) {
    this.db = database;
  }

  async findById(id: string): Promise<Remate | null> {
    const [row] = await this.db
      .select(columns)
      .from(remates)
      .where(eq(remates.id, id))
      .limit(1);

    return row ? toEntity(row) : null;
  }

  async findBySlug(slug: string): Promise<Remate | null> {
    const [row] = await this.db
      .select(columns)
      .from(remates)
      .where(eq(remates.slug, slug))
      .limit(1);

    return row ? toEntity(row) : null;
  }

  async list({
    filters,
    sort,
    page,
    pageSize,
  }: ListRematesQuery): Promise<Paginated<Remate>> {
    const where = buildWhere(filters);

    const [rows, [totalRow]] = await Promise.all([
      this.db
        .select(columns)
        .from(remates)
        .where(where)
        .orderBy(...buildOrderBy(sort, filters.search?.trim()))
        .limit(pageSize)
        .offset((page - 1) * pageSize),
      this.db.select({ total: count() }).from(remates).where(where),
    ]);

    return { items: rows.map(toEntity), total: totalRow?.total ?? 0 };
  }

  async findRelated(
    departamento: string,
    excludeId: string,
    limit: number,
  ): Promise<Remate[]> {
    const rows = await this.db
      .select(columns)
      .from(remates)
      .where(
        and(
          eq(remates.activo, true),
          eq(remates.departamento, departamento),
          ne(remates.id, excludeId),
        ),
      )
      .orderBy(desc(remates.destacado), desc(remates.createdAt))
      .limit(limit);

    return rows.map(toEntity);
  }

  async slugExists(slug: string, excludeId?: string): Promise<boolean> {
    const [row] = await this.db
      .select({ id: remates.id })
      .from(remates)
      .where(
        and(
          eq(remates.slug, slug),
          excludeId ? ne(remates.id, excludeId) : undefined,
        ),
      )
      .limit(1);

    return Boolean(row);
  }

  async create(data: NewRemate): Promise<Remate> {
    try {
      const [row] = await this.db
        .insert(remates)
        .values(toInsertValues(data))
        .returning(columns);

      return toEntity(row);
    } catch (error) {
      if (isUniqueViolation(error)) throw new SlugAlreadyExistsError(data.slug);
      throw error;
    }
  }

  async update(id: string, changes: RemateChanges): Promise<Remate | null> {
    try {
      const [row] = await this.db
        .update(remates)
        .set(toUpdateValues(changes))
        .where(eq(remates.id, id))
        .returning(columns);

      return row ? toEntity(row) : null;
    } catch (error) {
      if (isUniqueViolation(error) && changes.slug) {
        throw new SlugAlreadyExistsError(changes.slug);
      }
      throw error;
    }
  }

  async listAllImageRefs(): Promise<string[]> {
    const rows = await this.db.select({ imagenes: remates.imagenes }).from(remates);
    return rows.flatMap((row) => row.imagenes);
  }

  async listPublicEntries(): Promise<PublicRemateEntry[]> {
    return this.db
      .select({ slug: remates.slug, updatedAt: remates.updatedAt })
      .from(remates)
      .where(eq(remates.activo, true))
      .orderBy(desc(remates.updatedAt))
      .limit(5000);
  }

  async countByDepartamento(): Promise<DepartamentoCount[]> {
    return this.db
      .select({ departamento: remates.departamento, total: count() })
      .from(remates)
      .where(eq(remates.activo, true))
      .groupBy(remates.departamento)
      .orderBy(desc(count()), asc(remates.departamento));
  }

  async getStats(): Promise<RemateStats> {
    const [[totals], byEstado] = await Promise.all([
      this.db
        .select({
          total: count(),
          activos: sql<number>`count(*) filter (where ${remates.activo})`.mapWith(
            Number,
          ),
          destacados: sql<number>`count(*) filter (where ${remates.activo} and ${remates.destacado})`.mapWith(
            Number,
          ),
        })
        .from(remates),
      this.db
        .select({ estado: remates.estado, total: count() })
        .from(remates)
        .where(eq(remates.activo, true))
        .groupBy(remates.estado),
    ]);

    const porEstado = Object.fromEntries(
      ESTADOS_REMATE.map((estado) => [estado, 0]),
    ) as Record<EstadoRemate, number>;
    for (const row of byEstado) porEstado[row.estado] = row.total;

    return {
      total: totals.total,
      activos: totals.activos,
      inactivos: totals.total - totals.activos,
      destacados: totals.destacados,
      porEstado,
    };
  }
}
