import {
  assertRemateRules,
  deriveImagenPrincipal,
  generateSlug,
  type NewRemate,
} from "../../domain/entities/remate.ts";
import { InvalidRemateError } from "../../domain/errors/invalid-remate-error.ts";
import { SlugAlreadyExistsError } from "../../domain/errors/slug-already-exists-error.ts";
import type { RemateRepository } from "../../domain/repositories/remate-repository.ts";
import type { CreateRemateInput, RemateDto } from "../dtos/remate-dto.ts";
import { toRemateDto } from "../mappers/remate-mapper.ts";
import { findAvailableSlug } from "./unique-slug.ts";

export function parseFechaRemate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new InvalidRemateError("La fecha del remate no es válida.");
  }
  return date;
}

export function emptyToNull(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export class CreateRemate {
  private readonly remates: RemateRepository;

  constructor(remates: RemateRepository) {
    this.remates = remates;
  }

  async execute(
    input: CreateRemateInput,
    createdBy: string | null,
  ): Promise<RemateDto> {
    const nombre = input.nombre.trim();

    let slug: string;
    if (input.slug) {
      if (await this.remates.slugExists(input.slug)) {
        throw new SlugAlreadyExistsError(input.slug);
      }
      slug = input.slug;
    } else {
      slug = await findAvailableSlug(this.remates, generateSlug(nombre));
    }

    const data: NewRemate = {
      slug,
      nombre,
      descripcion: input.descripcion.trim(),
      departamento: input.departamento.trim(),
      ciudad: input.ciudad.trim(),
      municipio: input.municipio.trim(),
      direccion: emptyToNull(input.direccion),
      tipoInmueble: input.tipoInmueble,
      precioBase: input.precioBase,
      precioComercial: input.precioComercial ?? null,
      area: input.area,
      habitaciones: input.habitaciones ?? null,
      banos: input.banos ?? null,
      estado: input.estado ?? "disponible",
      fechaRemate: parseFechaRemate(input.fechaRemate),
      imagenes: input.imagenes,
      imagenPrincipal: deriveImagenPrincipal(input.imagenes),
      destacado: input.destacado ?? false,
      activo: true,
      createdBy,
    };

    assertRemateRules(data);

    return toRemateDto(await this.remates.create(data));
  }
}
