import type { RemateRepository } from "../../domain/repositories/remate-repository.ts";
import type { ListRematesInput, ListRematesOutput } from "../dtos/remate-dto.ts";
import { toRemateDto } from "../mappers/remate-mapper.ts";

const DEFAULT_PAGE_SIZE = 12;
const MAX_PAGE_SIZE = 48;

export class ListRemates {
  private readonly remates: RemateRepository;

  constructor(remates: RemateRepository) {
    this.remates = remates;
  }

  async execute(input: ListRematesInput = {}): Promise<ListRematesOutput> {
    const page = Math.max(1, Math.floor(input.page ?? 1));
    const pageSize = Math.min(
      MAX_PAGE_SIZE,
      Math.max(1, Math.floor(input.pageSize ?? DEFAULT_PAGE_SIZE)),
    );

    let { precioMin, precioMax } = input;
    if (precioMin !== undefined && precioMax !== undefined && precioMin > precioMax) {
      [precioMin, precioMax] = [precioMax, precioMin];
    }

    const { items, total } = await this.remates.list({
      filters: {
        search: input.search,
        departamento: input.departamento,
        ciudad: input.ciudad,
        municipio: input.municipio,
        tipos: input.tipos,
        estados: input.estados,
        precioMin,
        precioMax,
        destacado: input.destacado,
        activo: input.activo,
      },
      sort: input.sort ?? "recientes",
      page,
      pageSize,
    });

    return {
      items: items.map(toRemateDto),
      total,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    };
  }
}
