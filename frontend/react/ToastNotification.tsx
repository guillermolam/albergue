import { useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { motion, AnimatePresence } from 'motion/react';
import {
  notifications,
  notificationActions,
  type Notification,
  type ToastType,
} from '../../src/stores/notifications';
import { useI18n } from './hooks/useI18n';

const ICONS: Record<ToastType, string> = {
  success: '✅',
  error: '❌',
  warning: '⚠️',
  info: 'ℹ️',
};

const TOAST_TL_MS = 5000;

function ToastItem({ notification }: { notification: Notification }) {
  const { t } = useI18n();

  useEffect(() => {
    if (notification.ttlMs && notification.ttlMs > 0) {
      const timer = window.setTimeout(() => {
        notificationActions.dismissToast(notification.id);
      }, notification.ttlMs);
      return () => window.clearTimeout(timer);
    }
  }, [notification.id, notification.ttlMs]);

  const typeStyles: Record<ToastType, string> = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={`
        flex items-start gap-3 min-w-[280px] max-w-sm p-4 rounded-lg border shadow-lg
        backdrop-blur-sm
        ${typeStyles[notification.type]}
      `}
      role="status"
      aria-live="polite"
    >
      <span className="text-lg shrink-0 mt-0.5" aria-hidden="true">
        {ICONS[notification.type]}
      </span>
      <div className="flex-1 min-w-0">
        {notification.title && (
          <p className="font-semibold text-sm leading-tight">{notification.title}</p>
        )}
        <p className="text-sm opacity-90 leading-snug break-words">{notification.message}</p>
        {notification.action && (
          <button
            type="button"
            onClick={notification.action.onClick}
            className="mt-2 text-xs font-bold underline hover:opacity-80 transition-opacity"
          >
            {notification.action.label}
          </button>
        )}
      </div>
      <button
        type="button"
        aria-label={t('common.close')}
        onClick={() => notificationActions.dismissToast(notification.id)}
        className="shrink-0 text-sm opacity-60 hover:opacity-100 transition-opacity"
      >
        ✕
      </button>
    </motion.div>
  );
}

/**
 * ToastNotification — renders the global toast stack from the `notifications`
 * nanostore. Mount once at the app root (e.g. inside a layout) and every
 * component can call `notificationActions.success(...)` to push a toast.
 */
export function ToastNotification() {
  const state = useStore(notifications);

  // Auto-dismiss on mount for any toasts that lost their TTL (e.g. after HMR)
  useEffect(() => {
    const now = Date.now();
    for (const n of state.toasts) {
      if (n.expiresAt && n.expiresAt < now) {
        notificationActions.dismissToast(n.id);
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      className="
        fixed top-4 right-4 z-[9999] flex flex-col gap-3
        pointer-events-none
      "
      aria-live="polite"
    >
      <AnimatePresence initial={false}>
        {state.toasts.map((n: Notification) => (
          <div key={n.id} className="pointer-events-auto">
            <ToastItem notification={n} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default ToastNotification;
