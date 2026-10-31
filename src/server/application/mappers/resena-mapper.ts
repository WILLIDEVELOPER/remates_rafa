import type { Resena } from "../../domain/entities/resena.ts";
import type { AdminResenaDto, PublicResenaDto } from "../dtos/resena-dto.ts";

export function toPublicResenaDto(resena: Resena): PublicResenaDto {
  return {
    id: resena.id,
    nombre: resena.nombre,
    comentario: resena.comentario,
    createdAt: resena.createdAt.toISOString(),
  };
}

export function toAdminResenaDto(resena: Resena): AdminResenaDto {
  return {
    ...toPublicResenaDto(resena),
    email: resena.email,
    telefono: resena.telefono,
  };
}
