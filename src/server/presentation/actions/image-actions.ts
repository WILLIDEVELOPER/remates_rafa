"use server";

import { revalidatePath } from "next/cache";
import type {
  DeleteOrphanImagesOutput,
  ListOrphanImagesOutput,
} from "../../application/dtos/orphan-image-dto.ts";
import { DeleteOrphanImages } from "../../application/use-cases/delete-orphan-images.ts";
import { ListOrphanImages } from "../../application/use-cases/list-orphan-images.ts";
import { DEFAULT_ORPHAN_MIN_AGE_MINUTES } from "../../application/use-cases/orphan-images.ts";
import { db } from "../../infrastructure/db/client.ts";
import { DrizzleRemateRepository } from "../../infrastructure/repositories/drizzle-remate-repository.ts";
import { S3ImageStorage } from "../../infrastructure/services/storage.ts";
import { requireAdmin } from "../auth/require-admin.ts";
import { deleteOrphanImagesSchema } from "../validators/upload-schema.ts";
import { fail, ok, type ActionResult } from "./action-result.ts";

// Antigüedad mínima (en minutos) para considerar huérfana una imagen. Configurable con ORPHAN_MIN_AGE_MINUTES.
const configuredAge = process.env.ORPHAN_MIN_AGE_MINUTES;
const minAgeMinutes =
  configuredAge !== undefined && configuredAge !== "" && Number.isFinite(Number(configuredAge))
    ? Number(configuredAge)
    : DEFAULT_ORPHAN_MIN_AGE_MINUTES;

const storage = new S3ImageStorage();
const remateRepository = new DrizzleRemateRepository(db);

const listOrphanImages = new ListOrphanImages(storage, remateRepository, minAgeMinutes);
const deleteOrphanImages = new DeleteOrphanImages(storage, remateRepository, minAgeMinutes);

export async function listOrphanImagesAction(): Promise<ActionResult<ListOrphanImagesOutput>> {
  try {
    await requireAdmin();
    return ok(await listOrphanImages.execute());
  } catch (error) {
    return fail(error);
  }
}

/** Sin `keys` borra todas las huérfanas; con `keys`, solo esas (si siguen siendo huérfanas). */
export async function deleteOrphanImagesAction(
  input: unknown,
): Promise<ActionResult<DeleteOrphanImagesOutput>> {
  try {
    await requireAdmin();
    const { keys } = deleteOrphanImagesSchema.parse(input ?? {});
    const result = await deleteOrphanImages.execute(keys);
    revalidatePath("/admin/imagenes");
    return ok(result);
  } catch (error) {
    return fail(error);
  }
}
