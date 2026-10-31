import { assertResenaChangesRules } from "../../domain/entities/resena.ts";
import { ResenaNotFoundError } from "../../domain/errors/resena-not-found-error.ts";
import type { ResenaRepository } from "../../domain/repositories/resena-repository.ts";
import type { AdminResenaDto, UpdateResenaInput } from "../dtos/resena-dto.ts";
import { toAdminResenaDto } from "../mappers/resena-mapper.ts";

export class UpdateResena {
  private readonly resenas: ResenaRepository;

  constructor(resenas: ResenaRepository) {
    this.resenas = resenas;
  }

  async execute(input: UpdateResenaInput): Promise<AdminResenaDto> {
    const changes = {
      nombre: input.nombre.trim(),
      comentario: input.comentario.trim(),
    };

    assertResenaChangesRules(changes);

    const updated = await this.resenas.update(input.id, changes);
    if (!updated) throw new ResenaNotFoundError(input.id);

    return toAdminResenaDto(updated);
  }
}
