import { normalizeResena } from "../../domain/entities/resena.ts";
import { RemateNotFoundError } from "../../domain/errors/remate-not-found-error.ts";
import {
  DuplicateResenaError,
  TooManyResenasError,
} from "../../domain/errors/resena-limit-errors.ts";
import type { RemateRepository } from "../../domain/repositories/remate-repository.ts";
import type { ResenaRepository } from "../../domain/repositories/resena-repository.ts";
import {
  emailKey,
  MAX_RESENAS_IP_POR_REMATE,
  MAX_RESENAS_IP_TOTAL,
  RESENA_VENTANA_HORAS,
} from "../../domain/rules/review-limits.ts";
import type { CreateResenaInput } from "../dtos/resena-dto.ts";

export class CreateResena {
  private readonly resenas: ResenaRepository;
  private readonly remates: RemateRepository;

  constructor(resenas: ResenaRepository, remates: RemateRepository) {
    this.resenas = resenas;
    this.remates = remates;
  }

  /** `ipHash` es la huella de la IP de quien escribe; sin ella solo rige el límite por correo. */
  async execute(
    input: CreateResenaInput,
    { ipHash = null }: { ipHash?: string | null } = {},
  ): Promise<{ id: string }> {
    const data = normalizeResena(input);

    // Solo se reseñan remates visibles en el sitio.
    const remate = await this.remates.findById(data.remateId);
    if (!remate || !remate.activo) throw new RemateNotFoundError(data.remateId);

    const emailClave = emailKey(data.email);
    if (await this.resenas.existsByEmailClave(remate.id, emailClave)) {
      throw new DuplicateResenaError();
    }

    if (ipHash) {
      const since = new Date(Date.now() - RESENA_VENTANA_HORAS * 3_600_000);
      const [enEsteRemate, enTotal] = await Promise.all([
        this.resenas.countByIpSince(ipHash, since, remate.id),
        this.resenas.countByIpSince(ipHash, since),
      ]);
      if (enEsteRemate >= MAX_RESENAS_IP_POR_REMATE || enTotal >= MAX_RESENAS_IP_TOTAL) {
        throw new TooManyResenasError();
      }
    }

    const created = await this.resenas.create(data, { emailClave, ipHash });
    return { id: created.id };
  }
}
