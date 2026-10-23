"use server";

import type { ImageUploadTarget } from "../../application/dtos/image-upload-dto.ts";
import { CreateImageUploads } from "../../application/use-cases/create-image-uploads.ts";
import { S3ImageStorage } from "../../infrastructure/services/storage.ts";
import { requireAdmin } from "../auth/require-admin.ts";
import { imageUploadsSchema } from "../validators/upload-schema.ts";
import { fail, ok, type ActionResult } from "./action-result.ts";

const createImageUploads = new CreateImageUploads(new S3ImageStorage());

/** Devuelve una URL prefirmada por archivo para que el navegador suba directo al bucket. */
export async function createImageUploadsAction(
  input: unknown,
): Promise<ActionResult<ImageUploadTarget[]>> {
  try {
    await requireAdmin();
    const { files } = imageUploadsSchema.parse(input);
    return ok(await createImageUploads.execute(files));
  } catch (error) {
    return fail(error);
  }
}
