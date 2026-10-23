CREATE TABLE "solicitudes_contacto" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nombre" varchar(120) NOT NULL,
	"email" varchar(255) NOT NULL,
	"telefono" varchar(30),
	"mensaje" text NOT NULL,
	"remate_id" uuid,
	"leida" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "solicitudes_contacto" ADD CONSTRAINT "solicitudes_contacto_remate_id_remates_id_fk" FOREIGN KEY ("remate_id") REFERENCES "public"."remates"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "solicitudes_contacto_created_at_idx" ON "solicitudes_contacto" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "solicitudes_contacto_remate_id_idx" ON "solicitudes_contacto" USING btree ("remate_id");