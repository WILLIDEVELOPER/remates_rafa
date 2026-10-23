import { neon } from "@neondatabase/serverless";
import { hashPassword } from "better-auth/crypto";
import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import { accounts, sessions, users } from "./schema.ts";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL no está definida");
}

const email = (process.env.ADMIN_EMAIL ?? "admin@remates.co").trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;

if (!password || password.length < 12) {
  console.error(
    "Define ADMIN_PASSWORD con al menos 12 caracteres.\n" +
      "Ejemplo: ADMIN_PASSWORD='una-clave-larga-y-unica' pnpm db:admin-password",
  );
  process.exit(1);
}

const db = drizzle(neon(databaseUrl));

const [user] = await db
  .select({ id: users.id })
  .from(users)
  .where(eq(users.email, email))
  .limit(1);

if (!user) {
  console.error(`No existe un usuario con el correo ${email}. Crea uno con: pnpm db:seed:admin`);
  process.exit(1);
}

const passwordHash = await hashPassword(password);

const updated = await db
  .update(accounts)
  .set({ password: passwordHash })
  .where(and(eq(accounts.userId, user.id), eq(accounts.providerId, "credential")))
  .returning({ id: accounts.id });

if (updated.length === 0) {
  console.error(`El usuario ${email} no tiene credenciales de correo y contraseña.`);
  process.exit(1);
}

// Cierra las sesiones abiertas: quien tuviera la clave anterior debe volver a entrar.
const closed = await db.delete(sessions).where(eq(sessions.userId, user.id)).returning({ id: sessions.id });

console.log(`Contraseña de ${email} actualizada. Sesiones cerradas: ${closed.length}.`);
