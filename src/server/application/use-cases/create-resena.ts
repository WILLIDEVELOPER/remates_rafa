import { normalizeResena } from "../../domain/entities/resena.ts";
import { RemateNotFoundError } from "../../domain/errors/remate-not-found-error.ts";
import type { RemateRepository } from "../../domain/repositories/remate-repository.ts";
import type { ResenaRepository } from "../../domain/repositories/resena-repository.ts";
import type { CreateResenaInput } from "../dtos/resena-dto.ts";

export class CreateResena {
  private readonly resenas: ResenaRepository;
  private readonly remates: RemateRepository;

  constructor(resenas: ResenaRepository, remates: RemateRepository) {
    this.resenas = resenas;
    this.remates = remates;
  }

  async execute(input: CreateResenaInput): Promise<{ id: string }> {
    const data = normalizeResena(input);

    // Solo se reseñan remates visibles en el sitio.
    const remate = await this.remates.findById(data.remateId);
    if (!remate || !remate.activo) throw new RemateNotFoundError(data.remateId);

    const created = await this.resenas.create(data);
    return { id: created.id };
  }
}
