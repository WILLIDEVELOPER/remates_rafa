import {
  ALLOWED_IMAGE_TYPES,
  IMAGE_EXTENSIONS,
  MAX_IMAGENES,
  MAX_IMAGE_BYTES,
} from "../../domain/entities/remate.ts";
import { InvalidRemateError } from "../../domain/errors/invalid-remate-error.ts";
import type { ImageStorage } from "../../domain/services/image-storage.ts";
import type {
  ImageUploadRequest,
  ImageUploadTarget,
} from "../dtos/image-upload-dto.ts";

type AllowedType = (typeof ALLOWED_IMAGE_TYPES)[number];

const isAllowedType = (value: string): value is AllowedType =>
  (ALLOWED_IMAGE_TYPES as readonly string[]).includes(value);

export class CreateImageUploads {
  private readonly storage: ImageStorage;

  constructor(storage: ImageStorage) {
    this.storage = storage;
  }

  async execute(files: ImageUploadRequest[]): Promise<ImageUploadTarget[]> {
    if (files.length === 0 || files.length > MAX_IMAGENES) {
      throw new InvalidRemateError(
        `Puedes subir entre 1 y ${MAX_IMAGENES} imágenes a la vez.`,
      );
    }

    for (const file of files) {
      if (!isAllowedType(file.contentType)) {
        throw new InvalidRemateError(
          `"${file.name}" no es válida: solo se aceptan imágenes JPG, PNG o WebP.`,
        );
      }
      if (!(file.size > 0) || file.size > MAX_IMAGE_BYTES) {
        throw new InvalidRemateError(
          `"${file.name}" supera el tamaño máximo de ${MAX_IMAGE_BYTES / 1024 / 1024} MB.`,
        );
      }
    }

    return Promise.all(
      files.map(async (file) => {
        const contentType = file.contentType as AllowedType;
        const key = `remates/${crypto.randomUUID()}.${IMAGE_EXTENSIONS[contentType]}`;
        const uploadUrl = await this.storage.createUploadUrl({
          key,
          contentType,
          size: file.size,
        });
        return { key, uploadUrl, contentType };
      }),
    );
  }
}
