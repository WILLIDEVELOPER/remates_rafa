CREATE TYPE "public"."estado_remate" AS ENUM('disponible', 'en_remate', 'adjudicado', 'suspendido');--> statement-breakpoint
CREATE TYPE "public"."tipo_inmueble" AS ENUM('casa', 'apartamento', 'lote', 'local', 'bodega', 'finca');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('admin', 'super_admin');--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" uuid NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "remates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(160) NOT NULL,
	"nombre" varchar(200) NOT NULL,
	"descripcion" text NOT NULL,
	"departamento" varchar(80) NOT NULL,
	"ciudad" varchar(120) NOT NULL,
	"municipio" varchar(120) NOT NULL,
	"direccion" varchar(255),
	"tipo_inmueble" "tipo_inmueble" NOT NULL,
	"precio_base" numeric(14, 2) NOT NULL,
	"precio_comercial" numeric(14, 2),
	"area" numeric(10, 2) NOT NULL,
	"habitaciones" integer,
	"banos" integer,
	"estado" "estado_remate" DEFAULT 'disponible' NOT NULL,
	"fecha_remate" timestamp,
	"imagenes" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"imagen_principal" text,
	"destacado" boolean DEFAULT false NOT NULL,
	"activo" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid,
	"search_vector" "tsvector" GENERATED ALWAYS AS (to_tsvector('spanish', coalesce(nombre, '') || ' ' || coalesce(descripcion, ''))) STORED
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"role" "user_role" DEFAULT 'admin' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "remates" ADD CONSTRAINT "remates_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "accounts_user_id_idx" ON "accounts" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "remates_slug_uidx" ON "remates" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "remates_ubicacion_idx" ON "remates" USING btree ("departamento","ciudad","municipio");--> statement-breakpoint
CREATE INDEX "remates_estado_activo_idx" ON "remates" USING btree ("estado","activo");--> statement-breakpoint
CREATE INDEX "remates_precio_base_idx" ON "remates" USING btree ("precio_base");--> statement-breakpoint
CREATE INDEX "remates_destacado_activo_idx" ON "remates" USING btree ("destacado","activo");--> statement-breakpoint
CREATE INDEX "remates_search_idx" ON "remates" USING gin ("search_vector");--> statement-breakpoint
CREATE INDEX "sessions_user_id_idx" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verifications_identifier_idx" ON "verifications" USING btree ("identifier");