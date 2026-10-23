import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "../db/client.ts";
import * as schema from "../db/schema.ts";

const isProduction = process.env.NODE_ENV === "production";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, { provider: "pg", schema, usePlural: true }),
  emailAndPassword: {
    enabled: true,
    // Los administradores se crean por seed; no hay registro público.
    disableSignUp: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "admin",
        input: false,
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    // Evita ir a la base en cada request; el rol puede tardar hasta 60 s en reflejar cambios.
    cookieCache: { enabled: true, maxAge: 60 },
  },
  advanced: {
    database: { generateId: "uuid" },
    useSecureCookies: isProduction,
  },
  plugins: [nextCookies()], // debe ser el último plugin
});
