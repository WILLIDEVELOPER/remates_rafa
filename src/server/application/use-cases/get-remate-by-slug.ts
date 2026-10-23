import { RemateNotFoundError } from "../../domain/errors/remate-not-found-error.ts";
import type { RemateRepository } from "../../domain/repositories/remate-repository.ts";
import type { RemateDto } from "../dtos/remate-dto.ts";
import { toRemateDto } from "../mappers/remate-mapper.ts";

export class GetRemateBySlug {
  private readonly remates: RemateRepository;

  constructor(remates: RemateRepository) {
    this.remates = remates;
  }

  async execute(
    slug: string,
    options: { includeInactive?: boolean } = {},
  ): Promise<RemateDto> {
    const remate = await this.remates.findBySlug(slug);
    if (!remate || (!remate.activo && !options.includeInactive)) {
      throw new RemateNotFoundError(slug);
    }

    return toRemateDto(remate);
  }
}
