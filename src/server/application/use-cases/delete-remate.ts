import { RemateNotFoundError } from "../../domain/errors/remate-not-found-error.ts";
import type { RemateRepository } from "../../domain/repositories/remate-repository.ts";
import type { RemateDto } from "../dtos/remate-dto.ts";
import { toRemateDto } from "../mappers/remate-mapper.ts";

/** Soft delete: el remate queda inactivo y deja de estar destacado. */
export class DeleteRemate {
  private readonly remates: RemateRepository;

  constructor(remates: RemateRepository) {
    this.remates = remates;
  }

  async execute(id: string): Promise<RemateDto> {
    const updated = await this.remates.update(id, {
      activo: false,
      destacado: false,
    });
    if (!updated) throw new RemateNotFoundError(id);

    return toRemateDto(updated);
  }
}
