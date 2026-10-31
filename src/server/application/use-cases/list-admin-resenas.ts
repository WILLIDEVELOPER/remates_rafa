import type { ResenaRepository } from "../../domain/repositories/resena-repository.ts";
import type { AdminResenaDto, ListResenasOutput } from "../dtos/resena-dto.ts";
import { toAdminResenaDto } from "../mappers/resena-mapper.ts";

export class ListAdminResenas {
  private readonly resenas: ResenaRepository;

  constructor(resenas: ResenaRepository) {
    this.resenas = resenas;
  }

  async execute(remateId: string): Promise<ListResenasOutput<AdminResenaDto>> {
    const { items, total } = await this.resenas.listByRemate(remateId);

    return { items: items.map(toAdminResenaDto), total };
  }
}
