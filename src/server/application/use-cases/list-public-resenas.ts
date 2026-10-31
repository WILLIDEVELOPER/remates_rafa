import type { ResenaRepository } from "../../domain/repositories/resena-repository.ts";
import type { ListResenasOutput, PublicResenaDto } from "../dtos/resena-dto.ts";
import { toPublicResenaDto } from "../mappers/resena-mapper.ts";

const PUBLIC_LIMIT = 100;

export class ListPublicResenas {
  private readonly resenas: ResenaRepository;

  constructor(resenas: ResenaRepository) {
    this.resenas = resenas;
  }

  async execute(remateId: string): Promise<ListResenasOutput<PublicResenaDto>> {
    const { items, total } = await this.resenas.listByRemate(remateId, PUBLIC_LIMIT);

    return { items: items.map(toPublicResenaDto), total };
  }
}
