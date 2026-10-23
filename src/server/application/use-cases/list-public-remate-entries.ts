import type { RemateRepository } from "../../domain/repositories/remate-repository.ts";

export class ListPublicRemateEntries {
  private readonly remates: RemateRepository;

  constructor(remates: RemateRepository) {
    this.remates = remates;
  }

  async execute(): Promise<{ slug: string; updatedAt: string }[]> {
    const entries = await this.remates.listPublicEntries();
    return entries.map((entry) => ({
      slug: entry.slug,
      updatedAt: entry.updatedAt.toISOString(),
    }));
  }
}
