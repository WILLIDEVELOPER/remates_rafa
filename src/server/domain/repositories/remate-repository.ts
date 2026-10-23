import type {
  EstadoRemate,
  NewRemate,
  Remate,
  RemateChanges,
  TipoInmueble,
} from "../entities/remate.ts";

export type RemateSort =
  | "recientes"
  | "precio_asc"
  | "precio_desc"
  | "fecha_remate";

export interface RemateFilters {
  search?: string;
  departamento?: string;
  ciudad?: string;
  municipio?: string;
  tipos?: TipoInmueble[];
  estados?: EstadoRemate[];
  precioMin?: number;
  precioMax?: number;
  destacado?: boolean;
  /** `undefined` = activos e inactivos. */
  activo?: boolean;
}

export interface ListRematesQuery {
  filters: RemateFilters;
  sort: RemateSort;
  page: number;
  pageSize: number;
}

export interface Paginated<T> {
  items: T[];
  total: number;
}

export interface RemateStats {
  total: number;
  activos: number;
  inactivos: number;
  destacados: number;
  porEstado: Record<EstadoRemate, number>;
}

export interface DepartamentoCount {
  departamento: string;
  total: number;
}

export interface PublicRemateEntry {
  slug: string;
  updatedAt: Date;
}

export interface RemateRepository {
  findById(id: string): Promise<Remate | null>;
  findBySlug(slug: string): Promise<Remate | null>;
  list(query: ListRematesQuery): Promise<Paginated<Remate>>;
  findRelated(
    departamento: string,
    excludeId: string,
    limit: number,
  ): Promise<Remate[]>;
  slugExists(slug: string, excludeId?: string): Promise<boolean>;
  create(data: NewRemate): Promise<Remate>;
  update(id: string, changes: RemateChanges): Promise<Remate | null>;
  getStats(): Promise<RemateStats>;
  /**
   * Todas las referencias de imagen guardadas, de remates activos y eliminados
   * (un remate eliminado puede restaurarse, así que sus imágenes siguen en uso).
   */
  listAllImageRefs(): Promise<string[]>;
  /** Slug y última modificación de todos los remates activos (para el sitemap). */
  listPublicEntries(): Promise<PublicRemateEntry[]>;
  /** Remates activos agrupados por departamento. */
  countByDepartamento(): Promise<DepartamentoCount[]>;
}
