import { defineConfig } from "drizzle-kit";

try {
  process.loadEnvFile(".env.local");
} catch {
  // en CI/producción las variables vienen del entorno
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/server/infrastructure/db/schema.ts",
  out: "./src/server/infrastructure/db/migrations",
  dbCredentials: { url: process.env.DATABASE_URL! },
});
