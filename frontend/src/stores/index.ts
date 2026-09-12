// Stores Index - Centralized state management
// Export all stores and utilities from a single entry point

// Booking and localization stores
export {
  bookingActions,
  bookingSelectors,
  bookingStore,
  loadPersistedBooking,
  persistBooking,
} from './bookingStore';
export { i18nActions, i18nStore, loadPersistedLocale, t } from './i18nStore';

// Camino progress stores
export {
  currentStageProgress,
  dailyGoalKm,
  isBusy,
  lastError,
  remainingDays,
  setDailyGoal,
  setStageProgress,
  syncProgressToServer,
} from './app';

// User stores
export {
  bookingCart,
  clearBookingCart,
  clearCurrentUser,
  currentUser,
  setCurrentUser,
  updateBookingCart,
  updateUserPreferences,
  userPreferences,
} from './user';

