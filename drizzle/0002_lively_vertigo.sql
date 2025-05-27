ALTER TABLE "accounts" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "accounts" DROP COLUMN "created_at";--> statement-breakpoint
ALTER TABLE "accounts" DROP COLUMN "updated_at";