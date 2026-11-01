ALTER TABLE "resenas" ADD COLUMN "email_clave" varchar(255);--> statement-breakpoint
ALTER TABLE "resenas" ADD COLUMN "ip_hash" varchar(64);--> statement-breakpoint
CREATE UNIQUE INDEX "resenas_remate_email_clave_uidx" ON "resenas" USING btree ("remate_id","email_clave");--> statement-breakpoint
CREATE INDEX "resenas_ip_created_idx" ON "resenas" USING btree ("ip_hash","created_at");