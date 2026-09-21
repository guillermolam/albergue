-- Anonymous pilgrim km diary (browser session cookie → session_id)
CREATE TABLE IF NOT EXISTS "camino_km_logs" (
  "id" serial PRIMARY KEY NOT NULL,
  "session_id" text NOT NULL,
  "km" numeric(6, 2) NOT NULL,
  "log_date" date NOT NULL,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS "camino_km_logs_session_date_idx"
  ON "camino_km_logs" ("session_id", "log_date");
