import { RemateNotFoundError } from "../../domain/errors/remate-not-found-error.ts";
import type { RemateRepository } from "../../domain/repositories/remate-repository.ts";
import type { RemateDto } from "../dtos/remate-dto.ts";
import { toRemateDto } from "../mappers/remate-mapper.ts";

export class GetRemateById {
  private readonly remates: RemateRepository;

  constructor(remates: RemateRepository) {
    this.remates = remates;
  }

  async execute(id: string): Promise<RemateDto> {
    const remate = await this.remates.findById(id);
    if (!remate) throw new RemateNotFoundError(id);

    return toRemateDto(remate);
  }
}
