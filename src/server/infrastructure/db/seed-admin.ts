import { neon } from "@neondatabase/serverless";
import { hashPassword } from "better-auth/crypto";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import { accounts, users } from "./schema.ts";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL no está definida");
}

const DEFAULT_PASSWORD = "Admin123!";

const email = (process.env.ADMIN_EMAIL ?? "admin@remates.co").trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD ?? DEFAULT_PASSWORD;
const name = process.env.ADMIN_NAME ?? "Administrador";

const db = drizzle(neon(databaseUrl));

const [existing] = await db
  .select({ id: users.id })
  .from(users)
  .where(eq(users.email, email))
  .limit(1);

if (existing) {
  console.log(`Seed admin: ${email} ya existe, no se modificó.`);
} else {
  const passwordHash = await hashPassword(password);

  const [user] = await db
    .insert(users)
    .values({ name, email, emailVerified: true, role: "super_admin" })
    .returning({ id: users.id });

  await db.insert(accounts).values({
    accountId: user.id,
    providerId: "credential",
    userId: user.id,
    password: passwordHash,
  });

  console.log(`Seed admin: usuario ${email} creado (super_admin).`);
  if (password === DEFAULT_PASSWORD) {
    console.warn(
      "ATENCIÓN: se usó la contraseña por defecto. Cámbiala antes de publicar (ADMIN_PASSWORD).",
    );
  }
}
