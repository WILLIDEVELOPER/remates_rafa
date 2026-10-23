import { sql } from "drizzle-orm";
import {
  boolean,
  customType,
  index,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import {
  ESTADOS_REMATE,
  TIPOS_INMUEBLE,
} from "../../domain/entities/remate.ts";
import { USER_ROLES } from "../../domain/entities/user.ts";

const tsvector = customType<{ data: string }>({
  dataType: () => "tsvector",
});

export const tipoInmuebleEnum = pgEnum("tipo_inmueble", TIPOS_INMUEBLE);
export const estadoRemateEnum = pgEnum("estado_remate", ESTADOS_REMATE);
export const userRoleEnum = pgEnum("user_role", USER_ROLES);

// Better Auth (usePlural: true): users, sessions, accounts, verifications
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  role: userRoleEnum("role").notNull().default("admin"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [index("sessions_user_id_idx").on(t.userId)],
);

export const accounts = pgTable(
  "accounts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [index("accounts_user_id_idx").on(t.userId)],
);

export const verifications = pgTable(
  "verifications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [index("verifications_identifier_idx").on(t.identifier)],
);

export const remates = pgTable(
  "remates",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: varchar("slug", { length: 160 }).notNull(),
    nombre: varchar("nombre", { length: 200 }).notNull(),
    descripcion: text("descripcion").notNull(),
    departamento: varchar("departamento", { length: 80 }).notNull(),
    ciudad: varchar("ciudad", { length: 120 }).notNull(),
    municipio: varchar("municipio", { length: 120 }).notNull(),
    direccion: varchar("direccion", { length: 255 }),
    tipoInmueble: tipoInmuebleEnum("tipo_inmueble").notNull(),
    precioBase: numeric("precio_base", { precision: 14, scale: 2 }).notNull(),
    precioComercial: numeric("precio_comercial", { precision: 14, scale: 2 }),
    area: numeric("area", { precision: 10, scale: 2 }).notNull(),
    habitaciones: integer("habitaciones"),
    banos: integer("banos"),
    estado: estadoRemateEnum("estado").notNull().default("disponible"),
    fechaRemate: timestamp("fecha_remate"),
    imagenes: jsonb("imagenes").$type<string[]>().notNull().default([]),
    imagenPrincipal: text("imagen_principal"),
    destacado: boolean("destacado").notNull().default(false),
    activo: boolean("activo").notNull().default(true),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    createdBy: uuid("created_by").references(() => users.id, {
      onDelete: "set null",
    }),
    searchVector: tsvector("search_vector").generatedAlwaysAs(
      sql`to_tsvector('spanish', coalesce(nombre, '') || ' ' || coalesce(descripcion, ''))`,
    ),
  },
  (t) => [
    uniqueIndex("remates_slug_uidx").on(t.slug),
    index("remates_ubicacion_idx").on(t.departamento, t.ciudad, t.municipio),
    index("remates_estado_activo_idx").on(t.estado, t.activo),
    index("remates_precio_base_idx").on(t.precioBase),
    index("remates_destacado_activo_idx").on(t.destacado, t.activo),
    index("remates_search_idx").using("gin", t.searchVector),
  ],
);

export type RemateRow = typeof remates.$inferSelect;
export type NewRemateRow = typeof remates.$inferInsert;

export const solicitudesContacto = pgTable(
  "solicitudes_contacto",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    nombre: varchar("nombre", { length: 120 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    telefono: varchar("telefono", { length: 30 }),
    mensaje: text("mensaje").notNull(),
    remateId: uuid("remate_id").references(() => remates.id, {
      onDelete: "set null",
    }),
    leida: boolean("leida").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [
    index("solicitudes_contacto_created_at_idx").on(t.createdAt),
    index("solicitudes_contacto_remate_id_idx").on(t.remateId),
  ],
);
