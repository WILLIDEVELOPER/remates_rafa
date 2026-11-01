import type { ResenaRepository } from "../../domain/repositories/resena-repository.ts";
import { CALIFICACION_DESTACADA_MIN } from "../../domain/rules/rating-rules.ts";
import type { PublicResenaDto } from "../dtos/resena-dto.ts";
import { toPublicResenaDto } from "../mappers/resena-mapper.ts";

/**
 * La mejor reseña de cada remate, lista para mostrar en sus tarjetas. Una sola consulta para
 * todo el listado; sin repositorio de reseñas (o sin remates) no se consulta nada.
 */
export async function loadBestResenas(
  resenas: ResenaRepository | undefined,
  remateIds: string[],
): Promise<Map<string, PublicResenaDto>> {
  if (!resenas || remateIds.length === 0) return new Map();

  const best = await resenas.findBestByRemates(remateIds, CALIFICACION_DESTACADA_MIN);
  return new Map(best.map((resena) => [resena.remateId, toPublicResenaDto(resena)]));
}
