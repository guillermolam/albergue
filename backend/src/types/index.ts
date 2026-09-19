/**
 * Type Definitions
 * Re-exports all database types from domain_model
 */

// Re-export everything from domain_model schema
export * from "@albergue/domain-model";

// Additional backend-specific types

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  orderBy?: string;
  orderDirection?: "asc" | "desc";
}

// Filter types
export interface PilgrimFilter {
  language?: string;
  nationality?: string;
  checkInDateFrom?: string;
  checkInDateTo?: string;
  status?: string;
}

export interface BookingFilter {
  status?: string;
  checkInDateFrom?: string;
  checkInDateTo?: string;
  pilgrimId?: number;
  roomType?: string;
}

export interface BedFilter {
  roomType?: string;
  roomNumber?: number;
  isAvailable?: boolean;
  status?: string;
}

// Create types for inputs
export interface CreatePilgrimInput {
  firstName: string;
  lastName1: string;
  lastName2?: string;
  birthDate: string;
  documentType: string;
  documentNumber: string;
  documentSupport?: string;
  gender: string;
  nationality?: string;
  phone: string;
  email?: string;
  addressCountry: string;
  addressStreet: string;
  addressStreet2?: string;
  addressCity: string;
  addressPostalCode: string;
  addressProvince?: string;
  addressMunicipalityCode?: string;
  idPhotoUrl?: string;
  language?: string;
  consentGiven?: boolean;
}

export interface CreateBookingInput {
  pilgrimId: number;
  checkInDate: string;
  checkOutDate: string;
  numberOfNights: number;
  numberOfPersons?: number;
  numberOfRooms?: number;
  hasInternet?: boolean;
  bedAssignmentId?: number;
  estimatedArrivalTime?: string;
  notes?: string;
  totalAmount: number;
  paymentDeadline: string;
  reservationExpiresAt: string;
}

export interface CreatePaymentInput {
  bookingId: number;
  amount: number;
  paymentType: string;
  currency?: string;
  paymentDeadline: string;
  transactionId?: string;
}

export interface CreateBedInput {
  bedNumber: number;
  roomNumber: number;
  roomName: string;
  roomType?: string;
  pricePerNight?: string;
  currency?: string;
  isAvailable?: boolean;
  status?: string;
  maintenanceNotes?: string | null;
  lastCleanedAt?: Date | null;
  reservedUntil?: Date | null;
}

export interface CreatePricingInput {
  roomType: string;
  bedType: string;
  pricePerNight: string;
  currency?: string;
  isActive?: boolean;
}

// Update types
export interface UpdatePilgrimInput extends Partial<CreatePilgrimInput> {
  id: number;
}

export interface UpdateBookingInput extends Partial<CreateBookingInput> {
  id: number;
}

export interface UpdatePaymentInput extends Partial<CreatePaymentInput> {
  id: number;
}

export interface UpdateBedInput extends Partial<CreateBedInput> {
  id: number;
}

export interface UpdatePricingInput extends Partial<CreatePricingInput> {
  id: number;
}

// Stats types
export interface BookingStats {
  totalBookings: number;
  activeBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalRevenue: string;
  averageStay: number;
  occupancyRate: number;
  monthlyBookings: number;
  byRoomType: Array<{
    roomType: string;
    occupied: number;
    total: number;
    occupancyRate: number;
  }>;
}

export interface PilgrimStats {
  totalPilgrims: number;
  byNationality: Record<string, number>;
  byLanguage: Record<string, number>;
  byGender: Record<string, number>;
}

export interface BedStats {
  totalBeds: number;
  availableBeds: number;
  occupiedBeds: number;
  byRoomType: Record<string, { total: number; available: number }>;
}

export interface BedWithGuest {
  id: number;
  bedNumber: number;
  roomNumber: number;
  roomName: string;
  roomType: string | null;
  status: string | null;
  guestName: string | null;
  checkInDate: string | null;
  checkOutDate: string | null;
}

// Dashboard types
export interface DashboardMetrics {
  bookings: BookingStats;
  pilgrims: PilgrimStats;
  beds: BedStats;
  recentActivity: Array<{
    type: string;
    id: number;
    timestamp: Date;
    description: string;
  }>;
}

// Notification types
export interface EmailNotification {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface SmsNotification {
  to: string;
  message: string;
}

// Government submission types
export interface GovernmentSubmissionData {
  bookingId: number;
  xmlContent: string;
}
