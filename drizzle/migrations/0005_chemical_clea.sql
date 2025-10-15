DROP TABLE "transcripts" CASCADE;--> statement-breakpoint
ALTER TABLE "interviews" ADD COLUMN "completed" boolean DEFAULT false;