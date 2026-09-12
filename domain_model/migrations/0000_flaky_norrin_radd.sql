CREATE TABLE IF NOT EXISTS "audit_log" (
	"id" serial PRIMARY KEY NOT NULL,
	"table_name" text NOT NULL,
	"record_id" text NOT NULL,
	"action" text NOT NULL,
	"old_values" jsonb,
	"new_values" jsonb,
	"user_id" integer,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "beds" (
	"id" serial PRIMARY KEY NOT NULL,
	"bed_number" integer NOT NULL,
	"room_number" integer NOT NULL,
	"room_name" text NOT NULL,
	"room_type" text DEFAULT 'dormitory',
	"price_per_night" numeric(10, 2) DEFAULT '15.00' NOT NULL,
	"currency" text DEFAULT 'EUR',
	"is_available" boolean DEFAULT true,
	"status" text DEFAULT 'available',
	"reserved_until" timestamp,
	"last_cleaned_at" timestamp,
	"maintenance_notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "bookings" (
	"id" serial PRIMARY KEY NOT NULL,
	"pilgrim_id" integer NOT NULL,
	"reference_number" text NOT NULL,
	"check_in_date" date NOT NULL,
	"check_out_date" date NOT NULL,
	"number_of_nights" integer NOT NULL,
	"number_of_persons" integer DEFAULT 1,
	"number_of_rooms" integer DEFAULT 1,
	"has_internet" boolean DEFAULT false,
	"status" text DEFAULT 'reserved',
	"bed_assignment_id" integer,
	"estimated_arrival_time" text,
	"notes" text,
	"total_amount" numeric(10, 2) NOT NULL,
	"reservation_expires_at" timestamp NOT NULL,
	"payment_deadline" timestamp NOT NULL,
	"auto_cleanup_processed" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "bookings_reference_number_unique" UNIQUE("reference_number")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "government_submissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"booking_id" integer NOT NULL,
	"xml_content" text NOT NULL,
	"submission_status" text DEFAULT 'pending',
	"response_data" jsonb,
	"attempts" integer DEFAULT 0,
	"last_attempt" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"booking_id" integer,
	"pilgrim_id" integer,
	"channel" text NOT NULL,
	"recipient" text NOT NULL,
	"subject" text,
	"message" text NOT NULL,
	"status" text DEFAULT 'pending',
	"provider_message_id" text,
	"error_message" text,
	"sent_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "payments" (
	"id" serial PRIMARY KEY NOT NULL,
	"booking_id" integer NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"payment_type" text NOT NULL,
	"payment_status" text DEFAULT 'awaiting_payment',
	"currency" text DEFAULT 'EUR',
	"receipt_number" text,
	"payment_date" timestamp,
	"payment_deadline" timestamp NOT NULL,
	"transaction_id" text,
	"gateway_response" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pilgrims" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name_encrypted" text NOT NULL,
	"last_name_1_encrypted" text NOT NULL,
	"last_name_2_encrypted" text,
	"birth_date_encrypted" text NOT NULL,
	"document_type" text NOT NULL,
	"document_number_encrypted" text NOT NULL,
	"document_support" text,
	"gender" text NOT NULL,
	"nationality" text,
	"phone_encrypted" text NOT NULL,
	"email_encrypted" text,
	"address_country" text NOT NULL,
	"address_street_encrypted" text NOT NULL,
	"address_street_2_encrypted" text,
	"address_city_encrypted" text NOT NULL,
	"address_postal_code" text NOT NULL,
	"address_province" text,
	"address_municipality_code" text,
	"id_photo_url" text,
	"language" text DEFAULT 'es',
	"consent_given" boolean DEFAULT true,
	"consent_date" timestamp DEFAULT now(),
	"data_retention_until" timestamp,
	"last_access_date" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pricing" (
	"id" serial PRIMARY KEY NOT NULL,
	"room_type" text NOT NULL,
	"bed_type" text NOT NULL,
	"price_per_night" numeric(10, 2) NOT NULL,
	"currency" text DEFAULT 'EUR',
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bookings" ADD CONSTRAINT "bookings_pilgrim_id_pilgrims_id_fk" FOREIGN KEY ("pilgrim_id") REFERENCES "public"."pilgrims"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bookings" ADD CONSTRAINT "bookings_bed_assignment_id_beds_id_fk" FOREIGN KEY ("bed_assignment_id") REFERENCES "public"."beds"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "government_submissions" ADD CONSTRAINT "government_submissions_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "notifications" ADD CONSTRAINT "notifications_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "notifications" ADD CONSTRAINT "notifications_pilgrim_id_pilgrims_id_fk" FOREIGN KEY ("pilgrim_id") REFERENCES "public"."pilgrims"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payments" ADD CONSTRAINT "payments_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
