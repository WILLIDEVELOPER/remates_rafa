import type { RemateRepository } from "../../domain/repositories/remate-repository.ts";
import type { GetRelatedRematesInput, RemateDto } from "../dtos/remate-dto.ts";
import { toRemateDto } from "../mappers/remate-mapper.ts";

const DEFAULT_LIMIT = 3;
const MAX_LIMIT = 12;

export class GetRelatedRemates {
  private readonly remates: RemateRepository;

  constructor(remates: RemateRepository) {
    this.remates = remates;
  }

  async execute(input: GetRelatedRematesInput): Promise<RemateDto[]> {
    const limit = Math.min(MAX_LIMIT, Math.max(1, input.limit ?? DEFAULT_LIMIT));
    const related = await this.remates.findRelated(
      input.departamento,
      input.excludeId,
      limit,
    );

    return related.map(toRemateDto);
  }
}
