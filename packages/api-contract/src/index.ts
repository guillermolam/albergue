export * from "./booking.js";
export * from "./pilgrim.js";
export * from "./auth.js";
export * from "./payment.js";

/** Standard API envelope used by every endpoint. */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}
