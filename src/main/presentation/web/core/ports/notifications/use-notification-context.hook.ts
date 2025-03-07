import {
  Notification,
  NotificationContext,
} from "presentation/web/core/ports/notifications/notification-context";
import { useDepsContainer } from "presentation/web/core/shared/use-deps-container.hook";
import { useState } from "react";

const NotifDurationSecs = 5;

export const useCreateNotificationContext = (): NotificationContext => {
  const [notification, setNotification] = useState<Notification | undefined>(undefined);
  const [currentTimeout, setCurrentTimeout] = useState<number | undefined>(undefined);
  const clearCurrentTimeout = () => {
    if (currentTimeout) window.clearTimeout(currentTimeout);
  };

  const internalSetNotification = (notif?: Notification) => {
    clearCurrentTimeout();

    if (notif)
      setCurrentTimeout(
        window.setTimeout(() => setNotification(undefined), NotifDurationSecs * 1000),
      );

    setNotification(notif);
  };
  return { notification, setNotification: internalSetNotification };
};

export const useNotificationContext = () => {
  const { notificationContext } = useDepsContainer();
  return notificationContext;
};
