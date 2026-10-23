import { PutBucketCorsCommand, S3Client } from "@aws-sdk/client-s3";

// Restringe qué sitios pueden subir imágenes directo al bucket desde el navegador.
// Uso: CORS_ORIGINS="https://tu-dominio.com,http://localhost:3000" pnpm storage:cors
const origins = (process.env.CORS_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

if (origins.length === 0) {
  console.error('Define CORS_ORIGINS, por ejemplo: CORS_ORIGINS="https://tu-dominio.com" pnpm storage:cors');
  process.exit(1);
}

const bucket = process.env.S3_BUCKET ?? "uploads";

await new S3Client({ forcePathStyle: true }).send(
  new PutBucketCorsCommand({
    Bucket: bucket,
    CORSConfiguration: {
      CORSRules: [
        {
          AllowedOrigins: origins,
          AllowedMethods: ["GET", "PUT", "POST", "HEAD", "DELETE"],
          AllowedHeaders: ["*"],
          ExposeHeaders: ["ETag"],
          MaxAgeSeconds: 3000,
        },
      ],
    },
  }),
);

console.log(`CORS del bucket "${bucket}" actualizado. Orígenes permitidos: ${origins.join(", ")}`);
