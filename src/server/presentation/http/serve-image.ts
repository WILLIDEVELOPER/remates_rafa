import { getObject } from "../../infrastructure/services/storage.ts";

// Solo se sirven las imágenes de remates; evita exponer otros objetos del bucket.
const KEY_PATTERN = /^remates\/[A-Za-z0-9][A-Za-z0-9._-]{0,200}$/;

const notFound = () => new Response("Not found", { status: 404 });

/** Sirve una imagen del bucket (privado) con caché larga: las keys son únicas e inmutables. */
export async function serveImage(
  request: Request,
  keySegments: string[],
): Promise<Response> {
  const key = keySegments.join("/");
  if (!KEY_PATTERN.test(key)) return notFound();

  const object = await getObject(key);
  if (!object || !object.contentType?.startsWith("image/")) {
    await object?.body.cancel();
    return notFound();
  }

  const headers = new Headers({
    "Content-Type": object.contentType,
    "Cache-Control": "public, max-age=31536000, immutable",
    "X-Content-Type-Options": "nosniff",
  });
  if (object.etag) headers.set("ETag", object.etag);
  if (object.contentLength !== undefined) {
    headers.set("Content-Length", String(object.contentLength));
  }

  if (object.etag && request.headers.get("if-none-match") === object.etag) {
    await object.body.cancel();
    return new Response(null, { status: 304, headers });
  }

  return new Response(object.body, { headers });
}
