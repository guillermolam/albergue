import { initStoresBridge } from './runtime_stores_bridge';
import { initializeSwupPlugins } from './swup-plugins';
import { cleanupSensitiveBrowserStorage } from './cleanup-sensitive-storage';

function onIdle(cb: () => void) {
  const w = window as unknown as { requestIdleCallback?: (fn: () => void) => number };
  if (w.requestIdleCallback) w.requestIdleCallback(cb);
  else setTimeout(cb, 1);
}

function bootstrap() {
  cleanupSensitiveBrowserStorage();
  queueMicrotask(() => initStoresBridge());
  void initializeSwupPlugins();
  onIdle(() => {
    document.dispatchEvent(new CustomEvent('app:ready'));
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap, { once: true });
} else {
  bootstrap();
}
