import { InvalidRemateError } from "../../domain/errors/invalid-remate-error.ts";
import { isUploadedImageKey } from "../../domain/entities/remate.ts";
import type { RemateRepository } from "../../domain/repositories/remate-repository.ts";
import type { ImageStorage } from "../../domain/services/image-storage.ts";
import type { DeleteOrphanImagesOutput } from "../dtos/orphan-image-dto.ts";
import { scanOrphans } from "./orphan-images.ts";

export class DeleteOrphanImages {
  private readonly storage: ImageStorage;
  private readonly remates: RemateRepository;
  private readonly minAgeMinutes: number;

  constructor(storage: ImageStorage, remates: RemateRepository, minAgeMinutes: number) {
    this.storage = storage;
    this.remates = remates;
    this.minAgeMinutes = minAgeMinutes;
  }

  /**
   * Borra las `keys` indicadas, o todas las huérfanas si no se indica ninguna.
   * Se vuelve a calcular qué es huérfano en este momento: lo que el cliente creía
   * huérfano pudo haberse asignado a un remate mientras tanto y entonces no se toca.
   */
  async execute(keys?: string[]): Promise<DeleteOrphanImagesOutput> {
    if (keys?.some((key) => !isUploadedImageKey(key))) {
      throw new InvalidRemateError("Hay referencias de imagen no válidas.");
    }

    const { orphans } = await scanOrphans(this.storage, this.remates, this.minAgeMinutes);
    const requested = keys ? new Set(keys) : null;

    const toDelete = requested
      ? orphans.filter((image) => requested.has(image.key))
      : orphans;

    if (toDelete.length > 0) {
      await this.storage.deleteImages(toDelete.map((image) => image.key));
    }

    return {
      deleted: toDelete.length,
      skipped: requested ? requested.size - toDelete.length : 0,
      freedBytes: toDelete.reduce((sum, image) => sum + image.size, 0),
    };
  }
}
