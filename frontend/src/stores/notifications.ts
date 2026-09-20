import { map } from 'nanostores';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: ToastType;
  message: string;
  duration: number;
  createdAt: number;
}

export interface NotificationsState {
  notifications: Notification[];
}

export const notifications = map<NotificationsState>({
  notifications: [],
});

let notificationId = 0;

export const notificationActions = {
  showToast(message: string, type: ToastType = 'info', duration: number = 4000): string {
    const id = `toast-${++notificationId}-${Date.now()}`;
    const notification: Notification = {
      id,
      type,
      message,
      duration,
      createdAt: Date.now(),
    };

    const current = notifications.get();
    notifications.set({ notifications: [...current.notifications, notification] });

    if (duration > 0) {
      setTimeout(() => {
        notificationActions.dismissToast(id);
      }, duration);
    }

    return id;
  },

  dismissToast(id: string) {
    const current = notifications.get();
    notifications.set({
      notifications: current.notifications.filter((n) => n.id !== id),
    });
  },

  clearAll() {
    notifications.set({ notifications: [] });
  },

  success(message: string, duration?: number) {
    return notificationActions.showToast(message, 'success', duration);
  },

  error(message: string, duration?: number) {
    return notificationActions.showToast(message, 'error', duration);
  },

  warning(message: string, duration?: number) {
    return notificationActions.showToast(message, 'warning', duration);
  },

  info(message: string, duration?: number) {
    return notificationActions.showToast(message, 'info', duration);
  },
};

export default notifications;
