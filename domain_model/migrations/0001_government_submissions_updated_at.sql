ALTER TABLE "government_submissions" ADD COLUMN IF NOT EXISTS "updated_at" timestamp DEFAULT now();
