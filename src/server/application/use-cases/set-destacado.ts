import { assertRemateRules } from "../../domain/entities/remate.ts";
import { RemateNotFoundError } from "../../domain/errors/remate-not-found-error.ts";
import type { RemateRepository } from "../../domain/repositories/remate-repository.ts";
import type { RemateDto } from "../dtos/remate-dto.ts";
import { toRemateDto } from "../mappers/remate-mapper.ts";

export class SetDestacadoRemate {
  private readonly remates: RemateRepository;

  constructor(remates: RemateRepository) {
    this.remates = remates;
  }

  async execute(id: string, destacado: boolean): Promise<RemateDto> {
    const existing = await this.remates.findById(id);
    if (!existing) throw new RemateNotFoundError(id);

    assertRemateRules({ ...existing, destacado });

    const updated = await this.remates.update(id, { destacado });
    if (!updated) throw new RemateNotFoundError(id);

    return toRemateDto(updated);
  }
}
