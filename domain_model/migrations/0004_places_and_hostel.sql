CREATE TYPE "public"."hostel_bed_position" AS ENUM('bottom', 'top', 'single');--> statement-breakpoint
CREATE TYPE "public"."place_category" AS ENUM('restaurant', 'bar', 'night_club', 'museum', 'trail', 'park', 'excursion', 'pharmacy', 'atm', 'medical', 'transport', 'supermarket', 'other');--> statement-breakpoint
CREATE TABLE "hostel_bed_bunks" (
	"id" serial PRIMARY KEY NOT NULL,
	"bedroom_id" integer NOT NULL,
	"bunk_number" integer NOT NULL,
	"display_order" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "hostel_bedrooms" (
	"id" serial PRIMARY KEY NOT NULL,
	"building_id" integer NOT NULL,
	"room_number" text NOT NULL,
	"name_es" text NOT NULL,
	"name_en" text NOT NULL,
	"room_type" text DEFAULT 'dormitory',
	"floor" integer,
	"description_es" text,
	"description_en" text,
	"display_order" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "hostel_beds" (
	"id" serial PRIMARY KEY NOT NULL,
	"bunk_id" integer NOT NULL,
	"position" "hostel_bed_position" NOT NULL,
	"label" text,
	"operational_bed_id" integer
);
--> statement-breakpoint
CREATE TABLE "hostel_buildings" (
	"id" serial PRIMARY KEY NOT NULL,
	"hostel_id" integer NOT NULL,
	"name_es" text NOT NULL,
	"name_en" text NOT NULL,
	"description_markdown_es" text,
	"description_markdown_en" text,
	"floor_count" integer,
	"display_order" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "hostel_certifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"hostel_id" integer NOT NULL,
	"name_es" text NOT NULL,
	"name_en" text NOT NULL,
	"badge_icon_name" text,
	"display_order" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "hostel_compliance_badges" (
	"id" serial PRIMARY KEY NOT NULL,
	"hostel_id" integer NOT NULL,
	"code" text NOT NULL,
	"name_es" text NOT NULL,
	"name_en" text NOT NULL,
	"description_es" text,
	"description_en" text,
	"display_order" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "hostel_opening_hours" (
	"id" serial PRIMARY KEY NOT NULL,
	"hostel_id" integer NOT NULL,
	"area" text DEFAULT 'general',
	"day_of_week" integer NOT NULL,
	"opens_at" text,
	"closes_at" text,
	"is_closed" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "hostel_services" (
	"id" serial PRIMARY KEY NOT NULL,
	"hostel_id" integer NOT NULL,
	"title_es" text NOT NULL,
	"title_en" text NOT NULL,
	"description_es" text,
	"description_en" text,
	"price" numeric(10, 2),
	"currency" text DEFAULT 'EUR',
	"icon_name" text,
	"display_order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "hostel_social_links" (
	"id" serial PRIMARY KEY NOT NULL,
	"hostel_id" integer NOT NULL,
	"platform" text NOT NULL,
	"url" text NOT NULL,
	"display_order" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "hostels" (
	"id" serial PRIMARY KEY NOT NULL,
	"name_es" text NOT NULL,
	"name_en" text NOT NULL,
	"tagline_es" text,
	"tagline_en" text,
	"about_markdown_es" text,
	"about_markdown_en" text,
	"history_markdown_es" text,
	"history_markdown_en" text,
	"logo_url" text,
	"hero_image_url" text,
	"address_street" text,
	"address_postal_code" text,
	"address_city" text,
	"address_region" text,
	"address_country" text DEFAULT 'España',
	"latitude" numeric(9, 6),
	"longitude" numeric(9, 6),
	"phone" text,
	"email" text,
	"check_in_from" text,
	"check_in_until" text,
	"check_out_before" text,
	"touristic_registry" text,
	"cif" text,
	"rural_tourism_license" text,
	"data_protection_officer" text,
	"rgpd_registry" text,
	"arbitration_board" text,
	"arbitration_url" text,
	"odr_platform" text,
	"accessibility_level" text,
	"liability_insurance" text,
	"insurance_company" text,
	"payment_methods" text[],
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "place_addresses" (
	"id" serial PRIMARY KEY NOT NULL,
	"place_id" integer NOT NULL,
	"label" text,
	"street" text NOT NULL,
	"city" text NOT NULL,
	"postal_code" text,
	"province" text,
	"country" text DEFAULT 'España',
	"is_primary" boolean DEFAULT true,
	"display_order" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "place_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"place_id" integer NOT NULL,
	"url" text NOT NULL,
	"alt_text_es" text,
	"alt_text_en" text,
	"display_order" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "place_labels" (
	"id" serial PRIMARY KEY NOT NULL,
	"place_id" integer NOT NULL,
	"label_es" text NOT NULL,
	"label_en" text NOT NULL,
	"display_order" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "place_phones" (
	"id" serial PRIMARY KEY NOT NULL,
	"place_id" integer NOT NULL,
	"label" text,
	"phone_number" text NOT NULL,
	"is_primary" boolean DEFAULT true,
	"display_order" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "place_prices" (
	"id" serial PRIMARY KEY NOT NULL,
	"place_id" integer NOT NULL,
	"label_es" text NOT NULL,
	"label_en" text NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"currency" text DEFAULT 'EUR',
	"display_order" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "places" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"category" "place_category" NOT NULL,
	"name_es" text NOT NULL,
	"name_en" text NOT NULL,
	"short_description_es" text,
	"short_description_en" text,
	"description_markdown_es" text,
	"description_markdown_en" text,
	"avatar_url" text,
	"icon_name" text,
	"rating" numeric(2, 1),
	"rating_count" integer DEFAULT 0,
	"price_level" integer,
	"latitude" numeric(9, 6),
	"longitude" numeric(9, 6),
	"website_url" text,
	"is_active" boolean DEFAULT true,
	"is_featured" boolean DEFAULT false,
	"display_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "places_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "hostel_bed_bunks" ADD CONSTRAINT "hostel_bed_bunks_bedroom_id_hostel_bedrooms_id_fk" FOREIGN KEY ("bedroom_id") REFERENCES "public"."hostel_bedrooms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hostel_bedrooms" ADD CONSTRAINT "hostel_bedrooms_building_id_hostel_buildings_id_fk" FOREIGN KEY ("building_id") REFERENCES "public"."hostel_buildings"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hostel_beds" ADD CONSTRAINT "hostel_beds_bunk_id_hostel_bed_bunks_id_fk" FOREIGN KEY ("bunk_id") REFERENCES "public"."hostel_bed_bunks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hostel_beds" ADD CONSTRAINT "hostel_beds_operational_bed_id_beds_id_fk" FOREIGN KEY ("operational_bed_id") REFERENCES "public"."beds"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hostel_buildings" ADD CONSTRAINT "hostel_buildings_hostel_id_hostels_id_fk" FOREIGN KEY ("hostel_id") REFERENCES "public"."hostels"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hostel_certifications" ADD CONSTRAINT "hostel_certifications_hostel_id_hostels_id_fk" FOREIGN KEY ("hostel_id") REFERENCES "public"."hostels"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hostel_compliance_badges" ADD CONSTRAINT "hostel_compliance_badges_hostel_id_hostels_id_fk" FOREIGN KEY ("hostel_id") REFERENCES "public"."hostels"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hostel_opening_hours" ADD CONSTRAINT "hostel_opening_hours_hostel_id_hostels_id_fk" FOREIGN KEY ("hostel_id") REFERENCES "public"."hostels"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hostel_services" ADD CONSTRAINT "hostel_services_hostel_id_hostels_id_fk" FOREIGN KEY ("hostel_id") REFERENCES "public"."hostels"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hostel_social_links" ADD CONSTRAINT "hostel_social_links_hostel_id_hostels_id_fk" FOREIGN KEY ("hostel_id") REFERENCES "public"."hostels"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "place_addresses" ADD CONSTRAINT "place_addresses_place_id_places_id_fk" FOREIGN KEY ("place_id") REFERENCES "public"."places"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "place_images" ADD CONSTRAINT "place_images_place_id_places_id_fk" FOREIGN KEY ("place_id") REFERENCES "public"."places"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "place_labels" ADD CONSTRAINT "place_labels_place_id_places_id_fk" FOREIGN KEY ("place_id") REFERENCES "public"."places"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "place_phones" ADD CONSTRAINT "place_phones_place_id_places_id_fk" FOREIGN KEY ("place_id") REFERENCES "public"."places"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "place_prices" ADD CONSTRAINT "place_prices_place_id_places_id_fk" FOREIGN KEY ("place_id") REFERENCES "public"."places"("id") ON DELETE no action ON UPDATE no action;