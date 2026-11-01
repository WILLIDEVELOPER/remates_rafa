import type {
  EstadoRemate,
  TipoInmueble,
  TipoRemate,
} from "../../domain/entities/remate.ts";
import type {
  RemateSort,
  RemateStats,
} from "../../domain/repositories/remate-repository.ts";
import type { PublicResenaDto } from "./resena-dto.ts";

export interface RemateDto {
  id: string;
  slug: string;
  nombre: string;
  descripcion: string;
  departamento: string;
  ciudad: string;
  municipio: string;
  direccion: string | null;
  tipoInmueble: TipoInmueble;
  tipoRemate: TipoRemate;
  /** 70 % del valor comercial: desde donde parte el remate. */
  precioBase: number;
  precioComercial: number | null;
  /** 40 % del valor comercial: lo que da derecho a participar. */
  precioDerecho: number | null;
  area: number | null;
  habitaciones: number | null;
  banos: number | null;
  estado: EstadoRemate;
  /** ISO 8601 */
  fechaRemate: string | null;
  /** Referencias tal como se almacenan; úsalas para editar. */
  imagenes: string[];
  /** URLs listas para mostrar, en el mismo orden que `imagenes`. */
  imagenUrls: string[];
  imagenPrincipalUrl: string | null;
  destacado: boolean;
  activo: boolean;
  /** ISO 8601 */
  createdAt: string;
  /** ISO 8601 */
  updatedAt: string;
  createdBy: string | null;
  /** `null` mientras el remate no tenga reseñas calificadas. */
  calificacionPromedio: number | null;
  calificacionesCount: number;
  /** Su mejor reseña, solo en los listados que la piden (`conMejorResena`); `null` en el resto. */
  mejorResena: PublicResenaDto | null;
}

export interface ListRematesInput {
  search?: string;
  departamento?: string;
  ciudad?: string;
  municipio?: string;
  tipos?: TipoInmueble[];
  tiposRemate?: TipoRemate[];
  estados?: EstadoRemate[];
  precioMin?: number;
  precioMax?: number;
  destacado?: boolean;
  activo?: boolean;
  /** Adjunta a cada remate su mejor reseña (una consulta extra para toda la página). */
  conMejorResena?: boolean;
  sort?: RemateSort;
  page?: number;
  pageSize?: number;
}

export interface ListRematesOutput {
  items: RemateDto[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CreateRemateInput {
  nombre: string;
  descripcion: string;
  departamento: string;
  ciudad: string;
  municipio: string;
  direccion?: string | null;
  tipoInmueble: TipoInmueble;
  /** Por defecto, Rama Judicial. */
  tipoRemate?: TipoRemate;
  precioBase: number;
  precioComercial?: number | null;
  precioDerecho?: number | null;
  area?: number | null;
  habitaciones?: number | null;
  banos?: number | null;
  estado?: EstadoRemate;
  /** ISO 8601 con zona horaria */
  fechaRemate?: string | null;
  imagenes: string[];
  destacado?: boolean;
  slug?: string;
}

export interface UpdateRemateInput extends Partial<CreateRemateInput> {
  id: string;
  activo?: boolean;
}

export interface GetRelatedRematesInput {
  departamento: string;
  excludeId: string;
  limit?: number;
}

export type DashboardStatsDto = RemateStats;
