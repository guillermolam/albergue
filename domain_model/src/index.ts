// Main exports for the domain model
export * from './lib/db';
export * from './lib/errors';
export * from './commands';
export * from './queries';

// Re-export schema types
export type {
  User,
  Pilgrim,
  Booking,
  Bed,
  Payment,
  Pricing,
  GovernmentSubmission,
  Notification,
  AuditLog,
  InsertUser,
  InsertPilgrim,
  InsertBooking,
  InsertBed,
  InsertPayment,
  InsertPricing,
  InsertGovernmentSubmission,
  InsertNotification,
  InsertAuditLog,
} from '../schema';
