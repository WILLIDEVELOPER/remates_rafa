CREATE TABLE "resenas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"remate_id" uuid NOT NULL,
	"nombre" varchar(120) NOT NULL,
	"email" varchar(255) NOT NULL,
	"telefono" varchar(30) NOT NULL,
	"comentario" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "resenas" ADD CONSTRAINT "resenas_remate_id_remates_id_fk" FOREIGN KEY ("remate_id") REFERENCES "public"."remates"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "resenas_remate_created_idx" ON "resenas" USING btree ("remate_id","created_at");