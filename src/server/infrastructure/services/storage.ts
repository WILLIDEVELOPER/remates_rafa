import {
  DeleteObjectsCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type {
  ImageStorage,
  StoredImageInfo,
} from "../../domain/services/image-storage.ts";

// Neon Object Storage es compatible con S3. El SDK lee AWS_ENDPOINT_URL_S3 del
// entorno. Las credenciales y la región se toman de S3_ACCESS_KEY_ID,
// S3_SECRET_ACCESS_KEY y S3_REGION (Netlify reserva los nombres AWS_*); si no
// están definidas, el SDK usa AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY y AWS_REGION.
let client: S3Client | undefined;

function getClient(): S3Client {
  if (!client) {
    const accessKeyId = process.env.S3_ACCESS_KEY_ID;
    const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;

    client = new S3Client({
      forcePathStyle: true,
      ...(process.env.S3_REGION && { region: process.env.S3_REGION }),
      ...(accessKeyId && secretAccessKey && {
        credentials: { accessKeyId, secretAccessKey },
      }),
    });
  }
  return client;
}

export function getBucketName(): string {
  return process.env.S3_BUCKET ?? "uploads";
}

const UPLOAD_URL_TTL_SECONDS = 300;
const IMAGES_PREFIX = "remates/";
/** Límite de S3 por llamada a DeleteObjects. */
const DELETE_BATCH_SIZE = 1000;

export class S3ImageStorage implements ImageStorage {
  async createUploadUrl({
    key,
    contentType,
    size,
  }: {
    key: string;
    contentType: string;
    size: number;
  }): Promise<string> {
    return getSignedUrl(
      getClient(),
      new PutObjectCommand({
        Bucket: getBucketName(),
        Key: key,
        ContentType: contentType,
        ContentLength: size,
      }),
      {
        expiresIn: UPLOAD_URL_TTL_SECONDS,
        // Fuerza el tipo y el tamaño exactos: otro valor da 403.
        signableHeaders: new Set(["content-type", "content-length"]),
      },
    );
  }

  async listImages(): Promise<StoredImageInfo[]> {
    const images: StoredImageInfo[] = [];
    let continuationToken: string | undefined;

    do {
      const page = await getClient().send(
        new ListObjectsV2Command({
          Bucket: getBucketName(),
          Prefix: IMAGES_PREFIX,
          ContinuationToken: continuationToken,
        }),
      );

      for (const object of page.Contents ?? []) {
        if (object.Key && object.LastModified) {
          images.push({
            key: object.Key,
            size: object.Size ?? 0,
            lastModified: object.LastModified,
          });
        }
      }
      continuationToken = page.IsTruncated ? page.NextContinuationToken : undefined;
    } while (continuationToken);

    return images;
  }

  async deleteImages(keys: string[]): Promise<void> {
    for (let start = 0; start < keys.length; start += DELETE_BATCH_SIZE) {
      const batch = keys.slice(start, start + DELETE_BATCH_SIZE);
      const result = await getClient().send(
        new DeleteObjectsCommand({
          Bucket: getBucketName(),
          Delete: { Objects: batch.map((Key) => ({ Key })), Quiet: true },
        }),
      );

      if (result.Errors?.length) {
        const first = result.Errors[0];
        throw new Error(
          `No se pudieron borrar ${result.Errors.length} objeto(s): ${first.Key} (${first.Code}).`,
        );
      }
    }
  }
}

export interface StoredObject {
  body: ReadableStream;
  contentType: string | undefined;
  contentLength: number | undefined;
  etag: string | undefined;
}

/** Devuelve el objeto o `null` si no existe. */
export async function getObject(key: string): Promise<StoredObject | null> {
  try {
    const output = await getClient().send(
      new GetObjectCommand({ Bucket: getBucketName(), Key: key }),
    );
    if (!output.Body) return null;

    return {
      body: output.Body.transformToWebStream(),
      contentType: output.ContentType,
      contentLength: output.ContentLength,
      etag: output.ETag,
    };
  } catch (error) {
    const name = (error as { name?: string }).name;
    if (name === "NoSuchKey" || name === "NotFound") return null;
    throw error;
  }
}
