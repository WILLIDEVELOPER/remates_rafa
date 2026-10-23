import type { Remate } from "../../domain/entities/remate.ts";
import type { RemateDto } from "../dtos/remate-dto.ts";

/**
 * Las imágenes del bucket (privado) se guardan como key y se sirven por
 * `/api/images/<key>`; las URLs absolutas (p. ej. del seed) pasan sin cambios.
 */
export function resolveImageUrl(reference: string): string {
  return /^https?:\/\//i.test(reference) ? reference : `/api/images/${reference}`;
}

export function toRemateDto(remate: Remate): RemateDto {
  return {
    id: remate.id,
    slug: remate.slug,
    nombre: remate.nombre,
    descripcion: remate.descripcion,
    departamento: remate.departamento,
    ciudad: remate.ciudad,
    municipio: remate.municipio,
    direccion: remate.direccion,
    tipoInmueble: remate.tipoInmueble,
    precioBase: remate.precioBase,
    precioComercial: remate.precioComercial,
    area: remate.area,
    habitaciones: remate.habitaciones,
    banos: remate.banos,
    estado: remate.estado,
    fechaRemate: remate.fechaRemate?.toISOString() ?? null,
    imagenes: remate.imagenes,
    imagenUrls: remate.imagenes.map(resolveImageUrl),
    imagenPrincipalUrl: remate.imagenPrincipal
      ? resolveImageUrl(remate.imagenPrincipal)
      : null,
    destacado: remate.destacado,
    activo: remate.activo,
    createdAt: remate.createdAt.toISOString(),
    updatedAt: remate.updatedAt.toISOString(),
    createdBy: remate.createdBy,
  };
}
