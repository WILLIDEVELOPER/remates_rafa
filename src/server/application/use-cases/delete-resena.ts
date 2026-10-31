import { ResenaNotFoundError } from "../../domain/errors/resena-not-found-error.ts";
import type { ResenaRepository } from "../../domain/repositories/resena-repository.ts";

/** Borrado definitivo: una reseña eliminada no se puede recuperar. */
export class DeleteResena {
  private readonly resenas: ResenaRepository;

  constructor(resenas: ResenaRepository) {
    this.resenas = resenas;
  }

  async execute(id: string): Promise<void> {
    if (!(await this.resenas.delete(id))) throw new ResenaNotFoundError(id);
  }
}
