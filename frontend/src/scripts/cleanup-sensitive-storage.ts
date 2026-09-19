const SENSITIVE_EXACT_KEYS = [
  'access_token',
  'refresh_token',
  'albergue-booking',
  'booking',
  'bookingStore',
];

const SENSITIVE_KEY_PREFIXES = [
  'pilgrim:auth:',
  'pilgrim:profile:',
  'pilgrim:pilgrimage:',
  'pilgrim:bookings:',
  'pilgrim:health:',
  'pilgrim:social:',
];

export function cleanupSensitiveBrowserStorage(): void {
  for (const storage of [window.localStorage, window.sessionStorage]) {
    for (const key of SENSITIVE_EXACT_KEYS) storage.removeItem(key);
    for (let index = storage.length - 1; index >= 0; index--) {
      const key = storage.key(index);
      if (key && SENSITIVE_KEY_PREFIXES.some((prefix) => key.startsWith(prefix))) {
        storage.removeItem(key);
      }
    }
  }
}
