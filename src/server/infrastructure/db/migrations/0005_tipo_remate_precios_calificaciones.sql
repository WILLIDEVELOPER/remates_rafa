CREATE TYPE "public"."servicio_solicitado" AS ENUM('informacion', 'gestion_rut');--> statement-breakpoint
CREATE TYPE "public"."tipo_remate" AS ENUM('rama_judicial', 'dian');--> statement-breakpoint
ALTER TABLE "remates" ALTER COLUMN "area" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "remates" ADD COLUMN "tipo_remate" "tipo_remate" DEFAULT 'rama_judicial' NOT NULL;--> statement-breakpoint
ALTER TABLE "remates" ADD COLUMN "precio_derecho" numeric(14, 2);--> statement-breakpoint
ALTER TABLE "remates" ADD COLUMN "calificacion_promedio" numeric(3, 2);--> statement-breakpoint
ALTER TABLE "remates" ADD COLUMN "calificaciones_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "resenas" ADD COLUMN "calificacion" smallint;--> statement-breakpoint
ALTER TABLE "solicitudes_contacto" ADD COLUMN "servicio" "servicio_solicitado" DEFAULT 'informacion' NOT NULL;--> statement-breakpoint
CREATE INDEX "remates_tipo_remate_idx" ON "remates" USING btree ("tipo_remate");--> statement-breakpoint
ALTER TABLE "resenas" ADD CONSTRAINT "resenas_calificacion_rango" CHECK ("resenas"."calificacion" between 1 and 5);