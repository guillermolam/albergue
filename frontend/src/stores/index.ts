// Stores Index - Centralized state management
// Export all stores and utilities from a single entry point

// Localization store (booking workflow is server-session, not a nanostore)
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

// UI state stores
export { uiActions, uiState, type UIState, type ModalConfig, type Theme } from './uiState';

// Notification / toast store
export {
  notificationActions,
  notifications,
  type Notification,
  type NotificationsState,
  type ToastType,
} from './notifications';

// Search / filter state store
export { searchActions, searchState, type SearchFilters, type SearchState } from './searchState';

// Form validation state store
export { formActions, formState, type FormErrors, type FormState } from './formState';
