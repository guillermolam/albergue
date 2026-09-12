ALTER TABLE "notifications" ADD COLUMN IF NOT EXISTS "attempts" integer DEFAULT 0;
