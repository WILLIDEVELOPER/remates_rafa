import type { RemateRepository } from "../../domain/repositories/remate-repository.ts";
import type { ResenaRepository } from "../../domain/repositories/resena-repository.ts";
import type { GetRelatedRematesInput, RemateDto } from "../dtos/remate-dto.ts";
import { toRemateDto } from "../mappers/remate-mapper.ts";
import { loadBestResenas } from "./best-resenas.ts";

const DEFAULT_LIMIT = 3;
const MAX_LIMIT = 12;

export class GetRelatedRemates {
  private readonly remates: RemateRepository;
  private readonly resenas?: ResenaRepository;

  constructor(remates: RemateRepository, resenas?: ResenaRepository) {
    this.remates = remates;
    this.resenas = resenas;
  }

  async execute(input: GetRelatedRematesInput): Promise<RemateDto[]> {
    const limit = Math.min(MAX_LIMIT, Math.max(1, input.limit ?? DEFAULT_LIMIT));
    const related = await this.remates.findRelated(
      input.departamento,
      input.excludeId,
      limit,
    );

    const mejores = await loadBestResenas(
      this.resenas,
      related.map((remate) => remate.id),
    );

    return related.map((remate) => toRemateDto(remate, mejores.get(remate.id) ?? null));
  }
}
