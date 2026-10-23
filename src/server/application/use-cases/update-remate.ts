import {
  assertRemateRules,
  deriveImagenPrincipal,
  type RemateChanges,
} from "../../domain/entities/remate.ts";
import { RemateNotFoundError } from "../../domain/errors/remate-not-found-error.ts";
import { SlugAlreadyExistsError } from "../../domain/errors/slug-already-exists-error.ts";
import type { RemateRepository } from "../../domain/repositories/remate-repository.ts";
import type { RemateDto, UpdateRemateInput } from "../dtos/remate-dto.ts";
import { toRemateDto } from "../mappers/remate-mapper.ts";
import { emptyToNull, parseFechaRemate } from "./create-remate.ts";

export class UpdateRemate {
  private readonly remates: RemateRepository;

  constructor(remates: RemateRepository) {
    this.remates = remates;
  }

  async execute(input: UpdateRemateInput): Promise<RemateDto> {
    const existing = await this.remates.findById(input.id);
    if (!existing) throw new RemateNotFoundError(input.id);

    const { id, slug, nombre, descripcion, direccion, fechaRemate, imagenes, ...rest } =
      input;

    const changes: RemateChanges = Object.fromEntries(
      Object.entries(rest).filter(([, value]) => value !== undefined),
    );

    if (nombre !== undefined) changes.nombre = nombre.trim();
    if (descripcion !== undefined) changes.descripcion = descripcion.trim();
    if (direccion !== undefined) changes.direccion = emptyToNull(direccion);
    if (fechaRemate !== undefined) changes.fechaRemate = parseFechaRemate(fechaRemate);
    if (imagenes !== undefined) {
      changes.imagenes = imagenes;
      changes.imagenPrincipal = deriveImagenPrincipal(imagenes);
    }
    if (slug !== undefined && slug !== existing.slug) {
      if (await this.remates.slugExists(slug, id)) {
        throw new SlugAlreadyExistsError(slug);
      }
      changes.slug = slug;
    }

    assertRemateRules({ ...existing, ...changes });

    const updated = await this.remates.update(id, changes);
    if (!updated) throw new RemateNotFoundError(id);

    return toRemateDto(updated);
  }
}
