import type { RemateRepository } from "../../domain/repositories/remate-repository.ts";
import type { ImageStorage } from "../../domain/services/image-storage.ts";
import type { ListOrphanImagesOutput } from "../dtos/orphan-image-dto.ts";
import { resolveImageUrl } from "../mappers/remate-mapper.ts";
import { scanOrphans } from "./orphan-images.ts";

export class ListOrphanImages {
  private readonly storage: ImageStorage;
  private readonly remates: RemateRepository;
  private readonly minAgeMinutes: number;

  constructor(storage: ImageStorage, remates: RemateRepository, minAgeMinutes: number) {
    this.storage = storage;
    this.remates = remates;
    this.minAgeMinutes = minAgeMinutes;
  }

  async execute(): Promise<ListOrphanImagesOutput> {
    const { orphans, recent } = await scanOrphans(this.storage, this.remates, this.minAgeMinutes);

    return {
      items: orphans.map((image) => ({
        key: image.key,
        url: resolveImageUrl(image.key),
        size: image.size,
        lastModified: image.lastModified.toISOString(),
      })),
      totalBytes: orphans.reduce((sum, image) => sum + image.size, 0),
      recentCount: recent.length,
      minAgeMinutes: this.minAgeMinutes,
    };
  }
}
