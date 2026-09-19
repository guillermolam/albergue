import {
  pgTable,
  text,
  serial,
  integer,
  boolean,
  timestamp,
  decimal,
  date,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const pilgrims = pgTable("pilgrims", {
  id: serial("id").primaryKey(),
  firstName: text("first_name_encrypted").notNull(),
  lastName1: text("last_name_1_encrypted").notNull(),
  lastName2: text("last_name_2_encrypted"),
  birthDate: text("birth_date_encrypted").notNull(),
  documentType: text("document_type").notNull(),
  documentNumber: text("document_number_encrypted").notNull(),
  documentSupport: text("document_support"),
  gender: text("gender").notNull(),
  nationality: text("nationality"),
  phone: text("phone_encrypted").notNull(),
  email: text("email_encrypted"),
  addressCountry: text("address_country").notNull(),
  addressStreet: text("address_street_encrypted").notNull(),
  addressStreet2: text("address_street_2_encrypted"),
  addressCity: text("address_city_encrypted").notNull(),
  addressPostalCode: text("address_postal_code").notNull(),
  addressProvince: text("address_province"),
  addressMunicipalityCode: text("address_municipality_code"),
  idPhotoUrl: text("id_photo_url"),
  language: text("language").default("es"),
  consentGiven: boolean("consent_given").default(true),
  consentDate: timestamp("consent_date").defaultNow(),
  dataRetentionUntil: timestamp("data_retention_until"),
  lastAccessDate: timestamp("last_access_date").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const beds = pgTable("beds", {
  id: serial("id").primaryKey(),
  bedNumber: integer("bed_number").notNull(),
  roomNumber: integer("room_number").notNull(),
  roomName: text("room_name").notNull(),
  roomType: text("room_type").default("dormitory"),
  pricePerNight: decimal("price_per_night", { precision: 10, scale: 2 })
    .notNull()
    .default("15.00"),
  currency: text("currency").default("EUR"),
  isAvailable: boolean("is_available").default(true),
  status: text("status").default("available"),
  reservedUntil: timestamp("reserved_until"),
  lastCleanedAt: timestamp("last_cleaned_at"),
  maintenanceNotes: text("maintenance_notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  pilgrimId: integer("pilgrim_id")
    .references(() => pilgrims.id)
    .notNull(),
  referenceNumber: text("reference_number").notNull().unique(),
  checkInDate: date("check_in_date").notNull(),
  checkOutDate: date("check_out_date").notNull(),
  numberOfNights: integer("number_of_nights").notNull(),
  numberOfPersons: integer("number_of_persons").default(1),
  numberOfRooms: integer("number_of_rooms").default(1),
  hasInternet: boolean("has_internet").default(false),
  status: text("status").default("reserved"),
  bedAssignmentId: integer("bed_assignment_id").references(() => beds.id),
  estimatedArrivalTime: text("estimated_arrival_time"),
  notes: text("notes"),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  reservationExpiresAt: timestamp("reservation_expires_at").notNull(),
  paymentDeadline: timestamp("payment_deadline").notNull(),
  autoCleanupProcessed: boolean("auto_cleanup_processed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id")
    .references(() => bookings.id)
    .notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  paymentType: text("payment_type").notNull(),
  paymentStatus: text("payment_status").default("awaiting_payment"),
  currency: text("currency").default("EUR"),
  receiptNumber: text("receipt_number"),
  paymentDate: timestamp("payment_date"),
  paymentDeadline: timestamp("payment_deadline").notNull(),
  transactionId: text("transaction_id"),
  gatewayResponse: jsonb("gateway_response"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const pricing = pgTable("pricing", {
  id: serial("id").primaryKey(),
  roomType: text("room_type").notNull(),
  bedType: text("bed_type").notNull(),
  pricePerNight: decimal("price_per_night", {
    precision: 10,
    scale: 2,
  }).notNull(),
  currency: text("currency").default("EUR"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const governmentSubmissions = pgTable("government_submissions", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id")
    .references(() => bookings.id)
    .notNull(),
  xmlContent: text("xml_content").notNull(),
  submissionStatus: text("submission_status").default("pending"),
  responseData: jsonb("response_data"),
  attempts: integer("attempts").default(0),
  lastAttempt: timestamp("last_attempt"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").references(() => bookings.id),
  pilgrimId: integer("pilgrim_id").references(() => pilgrims.id),
  channel: text("channel").notNull(),
  recipient: text("recipient").notNull(),
  subject: text("subject"),
  message: text("message").notNull(),
  status: text("status").default("pending"),
  providerMessageId: text("provider_message_id"),
  errorMessage: text("error_message"),
  attempts: integer("attempts").default(0),
  sentAt: timestamp("sent_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject"),
  message: text("message").notNull(),
  status: text("status").default("new"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const auditLog = pgTable("audit_log", {
  id: serial("id").primaryKey(),
  tableName: text("table_name").notNull(),
  recordId: text("record_id").notNull(),
  action: text("action").notNull(),
  oldValues: jsonb("old_values"),
  newValues: jsonb("new_values"),
  userId: integer("user_id").references(() => users.id),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
});

// --- Places (points of interest: restaurants, bars, night clubs, museums,
// trails, parks, excursions, and practical nearby services like
// pharmacies/ATMs) -- a generic gallery aggregate, distinct from the
// hostel's own operational booking data. ---

export const placeCategoryEnum = pgEnum("place_category", [
  "restaurant",
  "bar",
  "night_club",
  "museum",
  "trail",
  "park",
  "excursion",
  "pharmacy",
  "atm",
  "medical",
  "transport",
  "supermarket",
  "other",
]);

export const places = pgTable("places", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  category: placeCategoryEnum("category").notNull(),
  nameEs: text("name_es").notNull(),
  nameEn: text("name_en").notNull(),
  shortDescriptionEs: text("short_description_es"),
  shortDescriptionEn: text("short_description_en"),
  descriptionMarkdownEs: text("description_markdown_es"),
  descriptionMarkdownEn: text("description_markdown_en"),
  avatarUrl: text("avatar_url"),
  iconName: text("icon_name"),
  rating: decimal("rating", { precision: 2, scale: 1 }),
  ratingCount: integer("rating_count").default(0),
  priceLevel: integer("price_level"),
  latitude: decimal("latitude", { precision: 9, scale: 6 }),
  longitude: decimal("longitude", { precision: 9, scale: 6 }),
  websiteUrl: text("website_url"),
  isActive: boolean("is_active").default(true),
  isFeatured: boolean("is_featured").default(false),
  displayOrder: integer("display_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const placeAddresses = pgTable("place_addresses", {
  id: serial("id").primaryKey(),
  placeId: integer("place_id")
    .references(() => places.id)
    .notNull(),
  label: text("label"),
  street: text("street").notNull(),
  city: text("city").notNull(),
  postalCode: text("postal_code"),
  province: text("province"),
  country: text("country").default("España"),
  isPrimary: boolean("is_primary").default(true),
  displayOrder: integer("display_order").default(0),
});

export const placePhones = pgTable("place_phones", {
  id: serial("id").primaryKey(),
  placeId: integer("place_id")
    .references(() => places.id)
    .notNull(),
  label: text("label"),
  phoneNumber: text("phone_number").notNull(),
  isPrimary: boolean("is_primary").default(true),
  displayOrder: integer("display_order").default(0),
});

export const placeImages = pgTable("place_images", {
  id: serial("id").primaryKey(),
  placeId: integer("place_id")
    .references(() => places.id)
    .notNull(),
  url: text("url").notNull(),
  altTextEs: text("alt_text_es"),
  altTextEn: text("alt_text_en"),
  displayOrder: integer("display_order").default(0),
});

export const placeLabels = pgTable("place_labels", {
  id: serial("id").primaryKey(),
  placeId: integer("place_id")
    .references(() => places.id)
    .notNull(),
  labelEs: text("label_es").notNull(),
  labelEn: text("label_en").notNull(),
  displayOrder: integer("display_order").default(0),
});

export const placePrices = pgTable("place_prices", {
  id: serial("id").primaryKey(),
  placeId: integer("place_id")
    .references(() => places.id)
    .notNull(),
  labelEs: text("label_es").notNull(),
  labelEn: text("label_en").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").default("EUR"),
  displayOrder: integer("display_order").default(0),
});

// --- Hostel (the hostel's own structure + descriptive/legal/contact
// content) -- fully separate from the operational `beds`/`bookings` tables
// above, so this content aggregate carries zero risk to the booking flow.
// `hostelBeds.operationalBedId` is an optional link back to the booking
// engine's own beds, so a future "explore the hostel" view can surface live
// availability without duplicating pricing/status data here. ---

export const hostels = pgTable("hostels", {
  id: serial("id").primaryKey(),
  nameEs: text("name_es").notNull(),
  nameEn: text("name_en").notNull(),
  taglineEs: text("tagline_es"),
  taglineEn: text("tagline_en"),
  aboutMarkdownEs: text("about_markdown_es"),
  aboutMarkdownEn: text("about_markdown_en"),
  historyMarkdownEs: text("history_markdown_es"),
  historyMarkdownEn: text("history_markdown_en"),
  logoUrl: text("logo_url"),
  heroImageUrl: text("hero_image_url"),
  addressStreet: text("address_street"),
  addressPostalCode: text("address_postal_code"),
  addressCity: text("address_city"),
  addressRegion: text("address_region"),
  addressCountry: text("address_country").default("España"),
  latitude: decimal("latitude", { precision: 9, scale: 6 }),
  longitude: decimal("longitude", { precision: 9, scale: 6 }),
  phone: text("phone"),
  email: text("email"),
  checkInFrom: text("check_in_from"),
  checkInUntil: text("check_in_until"),
  checkOutBefore: text("check_out_before"),
  touristicRegistry: text("touristic_registry"),
  cif: text("cif"),
  ruralTourismLicense: text("rural_tourism_license"),
  dataProtectionOfficer: text("data_protection_officer"),
  rgpdRegistry: text("rgpd_registry"),
  arbitrationBoard: text("arbitration_board"),
  arbitrationUrl: text("arbitration_url"),
  odrPlatform: text("odr_platform"),
  accessibilityLevel: text("accessibility_level"),
  liabilityInsurance: text("liability_insurance"),
  insuranceCompany: text("insurance_company"),
  paymentMethods: text("payment_methods").array(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const hostelSocialLinks = pgTable("hostel_social_links", {
  id: serial("id").primaryKey(),
  hostelId: integer("hostel_id")
    .references(() => hostels.id)
    .notNull(),
  platform: text("platform").notNull(),
  url: text("url").notNull(),
  displayOrder: integer("display_order").default(0),
});

export const hostelCertifications = pgTable("hostel_certifications", {
  id: serial("id").primaryKey(),
  hostelId: integer("hostel_id")
    .references(() => hostels.id)
    .notNull(),
  nameEs: text("name_es").notNull(),
  nameEn: text("name_en").notNull(),
  badgeIconName: text("badge_icon_name"),
  displayOrder: integer("display_order").default(0),
});

export const hostelComplianceBadges = pgTable("hostel_compliance_badges", {
  id: serial("id").primaryKey(),
  hostelId: integer("hostel_id")
    .references(() => hostels.id)
    .notNull(),
  code: text("code").notNull(),
  nameEs: text("name_es").notNull(),
  nameEn: text("name_en").notNull(),
  descriptionEs: text("description_es"),
  descriptionEn: text("description_en"),
  displayOrder: integer("display_order").default(0),
});

export const hostelServices = pgTable("hostel_services", {
  id: serial("id").primaryKey(),
  hostelId: integer("hostel_id")
    .references(() => hostels.id)
    .notNull(),
  titleEs: text("title_es").notNull(),
  titleEn: text("title_en").notNull(),
  descriptionEs: text("description_es"),
  descriptionEn: text("description_en"),
  price: decimal("price", { precision: 10, scale: 2 }),
  currency: text("currency").default("EUR"),
  iconName: text("icon_name"),
  displayOrder: integer("display_order").default(0),
  isActive: boolean("is_active").default(true),
});

export const hostelOpeningHours = pgTable("hostel_opening_hours", {
  id: serial("id").primaryKey(),
  hostelId: integer("hostel_id")
    .references(() => hostels.id)
    .notNull(),
  area: text("area").default("general"),
  dayOfWeek: integer("day_of_week").notNull(),
  opensAt: text("opens_at"),
  closesAt: text("closes_at"),
  isClosed: boolean("is_closed").default(false),
});

export const hostelBuildings = pgTable("hostel_buildings", {
  id: serial("id").primaryKey(),
  hostelId: integer("hostel_id")
    .references(() => hostels.id)
    .notNull(),
  nameEs: text("name_es").notNull(),
  nameEn: text("name_en").notNull(),
  descriptionMarkdownEs: text("description_markdown_es"),
  descriptionMarkdownEn: text("description_markdown_en"),
  floorCount: integer("floor_count"),
  displayOrder: integer("display_order").default(0),
});

export const hostelBedrooms = pgTable("hostel_bedrooms", {
  id: serial("id").primaryKey(),
  buildingId: integer("building_id")
    .references(() => hostelBuildings.id)
    .notNull(),
  roomNumber: text("room_number").notNull(),
  nameEs: text("name_es").notNull(),
  nameEn: text("name_en").notNull(),
  roomType: text("room_type").default("dormitory"),
  floor: integer("floor"),
  descriptionEs: text("description_es"),
  descriptionEn: text("description_en"),
  displayOrder: integer("display_order").default(0),
});

export const hostelBedBunks = pgTable("hostel_bed_bunks", {
  id: serial("id").primaryKey(),
  bedroomId: integer("bedroom_id")
    .references(() => hostelBedrooms.id)
    .notNull(),
  bunkNumber: integer("bunk_number").notNull(),
  displayOrder: integer("display_order").default(0),
});

export const hostelBedPositionEnum = pgEnum("hostel_bed_position", [
  "bottom",
  "top",
  "single",
]);

export const hostelBeds = pgTable("hostel_beds", {
  id: serial("id").primaryKey(),
  bunkId: integer("bunk_id")
    .references(() => hostelBedBunks.id)
    .notNull(),
  position: hostelBedPositionEnum("position").notNull(),
  label: text("label"),
  operationalBedId: integer("operational_bed_id").references(() => beds.id),
});

export const usersRelations = relations(users, ({ many }) => ({
  auditLog: many(auditLog),
}));

export const pilgrimsRelations = relations(pilgrims, ({ many }) => ({
  bookings: many(bookings),
  notifications: many(notifications),
}));

export const bookingsRelations = relations(bookings, ({ one, many }) => ({
  pilgrim: one(pilgrims, {
    fields: [bookings.pilgrimId],
    references: [pilgrims.id],
  }),
  bed: one(beds, {
    fields: [bookings.bedAssignmentId],
    references: [beds.id],
  }),
  payments: many(payments),
  governmentSubmissions: many(governmentSubmissions),
  notifications: many(notifications),
}));

export const bedsRelations = relations(beds, ({ many }) => ({
  bookings: many(bookings),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  booking: one(bookings, {
    fields: [payments.bookingId],
    references: [bookings.id],
  }),
}));

export const governmentSubmissionsRelations = relations(
  governmentSubmissions,
  ({ one }) => ({
    booking: one(bookings, {
      fields: [governmentSubmissions.bookingId],
      references: [bookings.id],
    }),
  }),
);

export const notificationsRelations = relations(notifications, ({ one }) => ({
  booking: one(bookings, {
    fields: [notifications.bookingId],
    references: [bookings.id],
  }),
  pilgrim: one(pilgrims, {
    fields: [notifications.pilgrimId],
    references: [pilgrims.id],
  }),
}));

export const auditLogRelations = relations(auditLog, ({ one }) => ({
  user: one(users, {
    fields: [auditLog.userId],
    references: [users.id],
  }),
}));

export const placesRelations = relations(places, ({ many }) => ({
  addresses: many(placeAddresses),
  phones: many(placePhones),
  images: many(placeImages),
  labels: many(placeLabels),
  prices: many(placePrices),
}));

export const placeAddressesRelations = relations(placeAddresses, ({ one }) => ({
  place: one(places, { fields: [placeAddresses.placeId], references: [places.id] }),
}));

export const placePhonesRelations = relations(placePhones, ({ one }) => ({
  place: one(places, { fields: [placePhones.placeId], references: [places.id] }),
}));

export const placeImagesRelations = relations(placeImages, ({ one }) => ({
  place: one(places, { fields: [placeImages.placeId], references: [places.id] }),
}));

export const placeLabelsRelations = relations(placeLabels, ({ one }) => ({
  place: one(places, { fields: [placeLabels.placeId], references: [places.id] }),
}));

export const placePricesRelations = relations(placePrices, ({ one }) => ({
  place: one(places, { fields: [placePrices.placeId], references: [places.id] }),
}));

export const hostelsRelations = relations(hostels, ({ many }) => ({
  socialLinks: many(hostelSocialLinks),
  certifications: many(hostelCertifications),
  complianceBadges: many(hostelComplianceBadges),
  services: many(hostelServices),
  openingHours: many(hostelOpeningHours),
  buildings: many(hostelBuildings),
}));

export const hostelSocialLinksRelations = relations(hostelSocialLinks, ({ one }) => ({
  hostel: one(hostels, { fields: [hostelSocialLinks.hostelId], references: [hostels.id] }),
}));

export const hostelCertificationsRelations = relations(hostelCertifications, ({ one }) => ({
  hostel: one(hostels, { fields: [hostelCertifications.hostelId], references: [hostels.id] }),
}));

export const hostelComplianceBadgesRelations = relations(
  hostelComplianceBadges,
  ({ one }) => ({
    hostel: one(hostels, {
      fields: [hostelComplianceBadges.hostelId],
      references: [hostels.id],
    }),
  }),
);

export const hostelServicesRelations = relations(hostelServices, ({ one }) => ({
  hostel: one(hostels, { fields: [hostelServices.hostelId], references: [hostels.id] }),
}));

export const hostelOpeningHoursRelations = relations(hostelOpeningHours, ({ one }) => ({
  hostel: one(hostels, { fields: [hostelOpeningHours.hostelId], references: [hostels.id] }),
}));

export const hostelBuildingsRelations = relations(hostelBuildings, ({ one, many }) => ({
  hostel: one(hostels, { fields: [hostelBuildings.hostelId], references: [hostels.id] }),
  bedrooms: many(hostelBedrooms),
}));

export const hostelBedroomsRelations = relations(hostelBedrooms, ({ one, many }) => ({
  building: one(hostelBuildings, {
    fields: [hostelBedrooms.buildingId],
    references: [hostelBuildings.id],
  }),
  bedBunks: many(hostelBedBunks),
}));

export const hostelBedBunksRelations = relations(hostelBedBunks, ({ one, many }) => ({
  bedroom: one(hostelBedrooms, {
    fields: [hostelBedBunks.bedroomId],
    references: [hostelBedrooms.id],
  }),
  beds: many(hostelBeds),
}));

export const hostelBedsRelations = relations(hostelBeds, ({ one }) => ({
  bunk: one(hostelBedBunks, { fields: [hostelBeds.bunkId], references: [hostelBedBunks.id] }),
  operationalBed: one(beds, {
    fields: [hostelBeds.operationalBedId],
    references: [beds.id],
  }),
}));

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertPilgrimSchema = createInsertSchema(pilgrims).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBedSchema = createInsertSchema(beds).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertGovernmentSubmissionSchema = createInsertSchema(
  governmentSubmissions,
).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPricingSchema = createInsertSchema(pricing).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  attempts: true,
  createdAt: true,
});

export const insertAuditLogSchema = createInsertSchema(auditLog).omit({
  id: true,
  createdAt: true,
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  status: true,
  createdAt: true,
});

export const insertPlaceSchema = createInsertSchema(places).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const insertPlaceAddressSchema = createInsertSchema(placeAddresses).omit({ id: true });
export const insertPlacePhoneSchema = createInsertSchema(placePhones).omit({ id: true });
export const insertPlaceImageSchema = createInsertSchema(placeImages).omit({ id: true });
export const insertPlaceLabelSchema = createInsertSchema(placeLabels).omit({ id: true });
export const insertPlacePriceSchema = createInsertSchema(placePrices).omit({ id: true });

export const insertHostelSchema = createInsertSchema(hostels).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const insertHostelSocialLinkSchema = createInsertSchema(hostelSocialLinks).omit({
  id: true,
});
export const insertHostelCertificationSchema = createInsertSchema(hostelCertifications).omit({
  id: true,
});
export const insertHostelComplianceBadgeSchema = createInsertSchema(
  hostelComplianceBadges,
).omit({ id: true });
export const insertHostelServiceSchema = createInsertSchema(hostelServices).omit({ id: true });
export const insertHostelOpeningHoursSchema = createInsertSchema(hostelOpeningHours).omit({
  id: true,
});
export const insertHostelBuildingSchema = createInsertSchema(hostelBuildings).omit({ id: true });
export const insertHostelBedroomSchema = createInsertSchema(hostelBedrooms).omit({ id: true });
export const insertHostelBedBunkSchema = createInsertSchema(hostelBedBunks).omit({ id: true });
export const insertHostelBedSchema = createInsertSchema(hostelBeds).omit({ id: true });

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Pilgrim = typeof pilgrims.$inferSelect;
export type InsertPilgrim = z.infer<typeof insertPilgrimSchema>;
export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Bed = typeof beds.$inferSelect;
export type InsertBed = z.infer<typeof insertBedSchema>;
export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type GovernmentSubmission = typeof governmentSubmissions.$inferSelect;
export type InsertGovernmentSubmission = z.infer<
  typeof insertGovernmentSubmissionSchema
>;
export type Pricing = typeof pricing.$inferSelect;
export type InsertPricing = z.infer<typeof insertPricingSchema>;
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type AuditLog = typeof auditLog.$inferSelect;
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;

export type Place = typeof places.$inferSelect;
export type InsertPlace = z.infer<typeof insertPlaceSchema>;
export type PlaceAddress = typeof placeAddresses.$inferSelect;
export type InsertPlaceAddress = z.infer<typeof insertPlaceAddressSchema>;
export type PlacePhone = typeof placePhones.$inferSelect;
export type InsertPlacePhone = z.infer<typeof insertPlacePhoneSchema>;
export type PlaceImage = typeof placeImages.$inferSelect;
export type InsertPlaceImage = z.infer<typeof insertPlaceImageSchema>;
export type PlaceLabel = typeof placeLabels.$inferSelect;
export type InsertPlaceLabel = z.infer<typeof insertPlaceLabelSchema>;
export type PlacePrice = typeof placePrices.$inferSelect;
export type InsertPlacePrice = z.infer<typeof insertPlacePriceSchema>;

export type Hostel = typeof hostels.$inferSelect;
export type InsertHostel = z.infer<typeof insertHostelSchema>;
export type HostelSocialLink = typeof hostelSocialLinks.$inferSelect;
export type InsertHostelSocialLink = z.infer<typeof insertHostelSocialLinkSchema>;
export type HostelCertification = typeof hostelCertifications.$inferSelect;
export type InsertHostelCertification = z.infer<typeof insertHostelCertificationSchema>;
export type HostelComplianceBadge = typeof hostelComplianceBadges.$inferSelect;
export type InsertHostelComplianceBadge = z.infer<typeof insertHostelComplianceBadgeSchema>;
export type HostelService = typeof hostelServices.$inferSelect;
export type InsertHostelService = z.infer<typeof insertHostelServiceSchema>;
export type HostelOpeningHours = typeof hostelOpeningHours.$inferSelect;
export type InsertHostelOpeningHours = z.infer<typeof insertHostelOpeningHoursSchema>;
export type HostelBuilding = typeof hostelBuildings.$inferSelect;
export type InsertHostelBuilding = z.infer<typeof insertHostelBuildingSchema>;
export type HostelBedroom = typeof hostelBedrooms.$inferSelect;
export type InsertHostelBedroom = z.infer<typeof insertHostelBedroomSchema>;
export type HostelBedBunk = typeof hostelBedBunks.$inferSelect;
export type InsertHostelBedBunk = z.infer<typeof insertHostelBedBunkSchema>;
export type HostelBed = typeof hostelBeds.$inferSelect;
export type InsertHostelBed = z.infer<typeof insertHostelBedSchema>;
