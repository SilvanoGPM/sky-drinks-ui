import { notification } from "antd";
import { NotificationPlacement } from "antd/lib/notification";

type ShowNotificationProps = {
  type: "success" | "warn" | "error" | "info";
  message: string;
  description?: string;
  placement?: NotificationPlacement;
  duration?: number;
};

const defaultProps: ShowNotificationProps = {
  type: "error",
  message: "Ocorreu um erro",
  placement: "bottomRight",
  duration: 5,
};

export function showNotification({
  type = defaultProps.type,
  message = defaultProps.message,
  placement = defaultProps.placement,
  duration = defaultProps.duration,
  description,
}: ShowNotificationProps = defaultProps) {
  notification[type]({ message, description, duration, placement });
}
