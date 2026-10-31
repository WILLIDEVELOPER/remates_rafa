ALTER TABLE "remates" ALTER COLUMN "estado" SET DATA TYPE text;--> statement-breakpoint
UPDATE "remates" SET "estado" = 'disponible' WHERE "estado" = 'en_remate';--> statement-breakpoint
ALTER TABLE "remates" ALTER COLUMN "estado" SET DEFAULT 'disponible'::text;--> statement-breakpoint
DROP TYPE "public"."estado_remate";--> statement-breakpoint
CREATE TYPE "public"."estado_remate" AS ENUM('disponible', 'adjudicado', 'suspendido');--> statement-breakpoint
ALTER TABLE "remates" ALTER COLUMN "estado" SET DEFAULT 'disponible'::"public"."estado_remate";--> statement-breakpoint
ALTER TABLE "remates" ALTER COLUMN "estado" SET DATA TYPE "public"."estado_remate" USING "estado"::"public"."estado_remate";