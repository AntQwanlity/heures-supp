export type NotificationType = "success" | "error";

export type Notification = {
  type: NotificationType;
  text: string;
  subText?: string;
};

export type NotificationContext = {
  notification: Notification | undefined;
  setNotification: (notif?: Notification) => void;
};
