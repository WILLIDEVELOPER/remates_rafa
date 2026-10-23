import { isUploadedImageKey } from "../../domain/entities/remate.ts";
import type { RemateRepository } from "../../domain/repositories/remate-repository.ts";
import type {
  ImageStorage,
  StoredImageInfo,
} from "../../domain/services/image-storage.ts";

export const DEFAULT_ORPHAN_MIN_AGE_MINUTES = 60;

export interface OrphanScan {
  orphans: StoredImageInfo[];
  /** Sin remate, pero demasiado nuevas para borrarlas con seguridad. */
  recent: StoredImageInfo[];
}

/**
 * Una imagen es huérfana si está en el almacenamiento y ningún remate la referencia
 * (ni siquiera uno eliminado, porque puede restaurarse). Las subidas recientes se
 * excluyen: podrían pertenecer a un formulario que aún no se ha guardado.
 */
export async function scanOrphans(
  storage: ImageStorage,
  remates: RemateRepository,
  minAgeMinutes: number,
  now: Date = new Date(),
): Promise<OrphanScan> {
  const [stored, refs] = await Promise.all([
    storage.listImages(),
    remates.listAllImageRefs(),
  ]);

  const referenced = new Set(refs);
  const cutoff = now.getTime() - minAgeMinutes * 60_000;

  const orphans: StoredImageInfo[] = [];
  const recent: StoredImageInfo[] = [];

  for (const image of stored) {
    // Solo se tocan las imágenes que generó la subida; cualquier otro objeto se deja intacto.
    if (!isUploadedImageKey(image.key) || referenced.has(image.key)) continue;

    if (image.lastModified.getTime() <= cutoff) orphans.push(image);
    else recent.push(image);
  }

  orphans.sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime());
  return { orphans, recent };
}
